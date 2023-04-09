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

  private sendRequest<T>(
    url: string,
    httpMethod: "GET" | "POST",
    data?: unknown
  ): Promise<T | null> {
    return new Promise<T | null>(async (resolve, reject) => {
      if (!this.validUrl) {
        resolve(null);
        return;
      }
      try {
        const result = await fetch(encodeURI(url), {
          method: httpMethod,
          body: JSON.stringify(data),
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
