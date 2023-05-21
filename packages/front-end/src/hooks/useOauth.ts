import { omit } from "lodash";
import { useOauthState } from "../store/useOauthState";
import { useStorage } from "./useStorage";
import { useConfig } from "./useConfig";

type EntityPermission =
  | {
      entityType: "bookmarks";
      entity: Bookmark;
      allowEdit: boolean;
    }
  | {
      entityType: "tags";
      entity: Tag;
      allowEdit: boolean;
    }
  | {
      entityType: "categories";
      entity: Category;
      allowEdit: boolean;
    };

export type ParsedInvitation = Exclude<Invitation, "defaultPermissions"> & {
  permissions: EntityPermission[];
} & {
  users: (Omit<Oauth, "permissions"> & {
    permissions: EntityPermission[];
    allowEdit: boolean;
  })[];
};

export type UseOauthReturnType = {
  invitations: ParsedInvitation[];
  loadRemoteData: () => Promise<void>;
  findInvitation: (id: ID) => ParsedInvitation | undefined;
  getShareURL: (shareId: string) => string;
};

export const useOauth = (): UseOauthReturnType => {
  const {
    oauthItems,
    invitations: originInvitations,
    invitationUsageHistories,
    nickname,
    loadRemoteData: originLoadRemoteData,
  } = useOauthState();
  const { config, httpHelper } = useConfig();
  const { selectHelper } = useStorage();

  const invitations = originInvitations
    .filter((invitation) => !invitation.deletedAt)
    .map((invitation) => {
      const permissions =
        invitation.defaultPermissions.map(transformPermission);

      const users = oauthItems
        .filter(
          (oauthItem) =>
            !oauthItem.deletedAt &&
            oauthItem.permissions.some(
              (permission) => permission.invitationId === invitation.id
            )
        )
        .map((oauthItem) => {
          const permissions = oauthItem.permissions.map(transformPermission);

          return {
            ...oauthItem,
            permissions,
            allowEdit: oauthItem.permissions.some(
              (permission) =>
                permission.invitationId === invitation.id &&
                permission.allowEdit
            ),
          };
        });

      return {
        ...omit(invitation, "defaultPermissions"),
        permissions,
        users,
      };

      function transformPermission(permission: Permission) {
        switch (permission.entity) {
          case "tags":
            return {
              entityType: permission.entity,
              entity: selectHelper.selectTag(permission.entityId),
              allowEdit: permission.allowEdit,
            };
          case "categories":
            return {
              entityType: permission.entity,
              entity: selectHelper.selectCategory(permission.entityId),
              allowEdit: permission.allowEdit,
            };
          default:
            throw new Error("unknown entity type");
        }
      }
    }) as ParsedInvitation[];

  const loadRemoteData = async () => {
    return originLoadRemoteData(httpHelper);
  };

  const findInvitation = (entityId: ID): ParsedInvitation | undefined => {
    return invitations.find((invitation) =>
      invitation.permissions.some(
        (permission) => permission.entity?.id === entityId
      )
    );
  };

  const getShareURL = (shareId: string) => {
    return `${config.backendURL}/invitation/activate/${shareId}`;
  };

  return { invitations, loadRemoteData, findInvitation, getShareURL };
};
