import { create } from "zustand";
import { HttpHelper } from "../utils";

interface OauthState {
  nickname: string;
  oauthItems: Oauth[];
  invitations: Invitation[];
  invitationUsageHistories: InvitationUsageHistory[];
  loadRemoteData(httpHelper: HttpHelper): Promise<void>;
  loadLocalData(): Promise<void>;
  writeLocalCache(): Promise<void>;
}

export const useOauthState = create<OauthState>((set, get) => ({
  nickname: "",
  oauthItems: [],
  invitations: [],
  invitationUsageHistories: [],
  loadRemoteData: async (httpHelper: HttpHelper) => {
    try {
      const data = await httpHelper.getOauth();

      set({
        nickname: data.nickname,
        oauthItems: data.oauthItems,
        invitations: data.invitations,
        invitationUsageHistories: data.invitationUsageHistories,
      });

      get().writeLocalCache();
    } catch (error) {
      console.error("fail to load oauth remote data", error);
    }
  },
  loadLocalData: async () => {
    const data = await chrome.storage.local.get(["oauth"]);
    if (!data || !data.oauth) return;
    set({
      nickname: data.oauth.nickname,
      oauthItems: data.oauth.oauthItems,
      invitations: data.oauth.invitations,
      invitationUsageHistories: data.oauth.invitationUsageHistories,
    });
  },
  writeLocalCache: async () => {
    await chrome.storage.local.set({
      oauth: {
        nickname: get().nickname,
        oauthItems: get().oauthItems,
        invitations: get().invitations,
        invitationUsageHistories: get().invitationUsageHistories,
      },
    });
  },
}));
