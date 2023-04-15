import { nanoid } from "nanoid";
import { getTimestamp } from "./utils";
import md5 from "md5";

export default class {
  private validUrl: string | null;
  constructor(private config: Config) {
    this.validUrl = this.config.backendURL
      ? this.getValidUrl(this.config.backendURL)
      : null;
  }

  private getValidUrl(url: string) {
    if (url.endsWith("/")) {
      return url.slice(0, -1);
    }

    return url;
  }

  private getAuthHeaders(): Record<string, string> {
    const timestamp = getTimestamp();
    return {
      "X-Client-ID": this.config.clientId,
      "X-Timestamp": String(timestamp),
      "X-Signature": md5(
        this.config.clientId + this.config.clientSecret + timestamp
      ),
    };
  }

  private sendRequest<T>(
    url: string,
    httpMethod: "GET" | "POST",
    data?: unknown
  ): Promise<T> {
    return new Promise<T>(async (resolve, reject) => {
      if (!this.validUrl) {
        reject(undefined);
        return;
      }
      try {
        const result = await fetch(encodeURI(url), {
          method: httpMethod,
          body: JSON.stringify(data),
          headers: this.getAuthHeaders(),
        });
        const json = (await result.json()) as APIResult<T>;
        if (json.status === "error") {
          reject(json.message);
          return;
        }
        resolve(json.data);
      } catch (error) {
        console.log(error);
        reject("接口异常");
      }
    });
  }

  public async getOauth(): Promise<ServerOauth> {
    return this.sendRequest<ServerOauth>(
      `${this.validUrl}/auth/oauth-data`,
      "GET"
    );
  }

  public async addShareInvitation(invitation: {
    password?: string;
    usesLimit?: number;
    usesUntil?: number;
    entity: EntitySupportedByBackend;
    entityId: string;
    allowEdit: boolean;
  }): Promise<null> {
    const id = nanoid();
    return this.sendRequest<null>(`${this.validUrl}/invitation`, "POST", {
      password: invitation.password,
      usesLimit: invitation.usesLimit,
      usesUntil: invitation.usesUntil,
      id,
      createdAt: getTimestamp(),
      defaultPermissions: [
        {
          entity: invitation.entity,
          entityId: invitation.entityId,
          allowEdit: invitation.allowEdit,
          invitationId: id,
        },
      ],
    });
  }

  public async getMetaOfWebsite(
    url: string
  ): Promise<{ title: string; description: string } | null> {
    return this.sendRequest<WebsiteMetaResult>(
      `${this.validUrl}/website/meta?url=${url}`,
      "GET"
    );
  }

  public async syncLocalUpdate(
    data: OperationLog
  ): Promise<OperationLog[] | null> {
    if (this.config.enableSync === false) return Promise.resolve([]);
    return this.sendRequest<OperationLog[]>(
      `${this.validUrl}/sync/incremental`,
      "POST",
      data
    );
  }

  public async getRemoteUpdate(
    incrementalUpdateSerialNumber: number
  ): Promise<OperationLog[] | null> {
    if (this.config.enableSync === false) return Promise.resolve([]);
    return this.sendRequest<OperationLog[]>(
      `${this.validUrl}/sync/incremental/${incrementalUpdateSerialNumber}`,
      "GET"
    );
  }

  public async initSync(config: Config): Promise<null> {
    return this.sendRequest<null>(`${this.validUrl}/sync/init`, "POST", config);
  }

  // 更改后端地址比较麻烦，这里的思路是给新老地址都尝试发一次更新请求
  public async updateConfig(config: Config): Promise<null[]> {
    const promises: Promise<null>[] = [];
    if (config.backendURL !== this.config.backendURL && config.backendURL) {
      promises.push(
        this.sendRequest<null>(
          `${this.getValidUrl(config.backendURL)}/config`,
          "POST",
          config
        )
      );
    }
    promises.push(
      this.sendRequest<null>(`${this.validUrl}/config`, "POST", config)
    );

    return Promise.all(promises);
  }

  public async getIconOfWebsite(url: string) {
    if (!this.validUrl) return null;
    try {
      const response = await fetch(
        encodeURI(`${this.validUrl}/website/icons?url=${url}`)
      );
      if (
        response.status === 200 &&
        response.headers.get("content-type")?.startsWith("image")
      ) {
        const blob = await response.blob();
        return blob;
      }
    } catch (error) {
      console.log(error);
      throw new Error("获取图标失败");
    }
  }
}
