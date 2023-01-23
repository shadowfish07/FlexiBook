export default class {
  private validUrl: string | null;
  constructor(private config: Config) {
    this.validUrl = config.backendURL
      ? this.getValidUrl(config.backendURL)
      : null;
  }

  private getValidUrl(url: string) {
    if (url.endsWith("/")) {
      return url.slice(0, -1);
    }

    return url;
  }

  public async getMetaOfWebsite(url: string) {
    if (!this.validUrl) return null;
    try {
      const result = await fetch(
        encodeURI(`${this.validUrl}/website/meta?url=${url}`)
      );
      return await result.json();
    } catch (error) {
      console.log(error);
      throw new Error("获取网站信息失败");
    }
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
