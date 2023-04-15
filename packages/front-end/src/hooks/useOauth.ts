import { omit } from "lodash";
import { useOauthState } from "../store/useOauthState";
import { useStorage } from "./useStorage";

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
};

export const useOauth = () => {
  const {
    oauthItems,
    invitations: originInvitations,
    invitationUsageHistories,
    nickname,
  } = useOauthState();
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
          case "bookmarks":
            return {
              entityType: permission.entity,
              entity: selectHelper.selectBookmark(permission.entityId),
              allowEdit: permission.allowEdit,
            };
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
    });

  return { invitations };
};
