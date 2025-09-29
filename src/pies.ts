import axios from "axios"

export interface StringObject {
  [key: string]: string
}


export class PieSDK {
  private authToken: string
  private getAuthHeader() {
    return "Bearer " + this.authToken
  }
  constructor(authToken: string) {
    this.authToken = authToken
  }

  private createQuery(obj: StringObject) {
    let strs = []
    for (const key in obj) {
      const value = obj[key]
      strs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    }
    return `?${strs.join("&")}`
  }

  private apiURL: string = "https://api.pies.cf"
  public setAPIUrl(string: string) {
    this.apiURL = string
  }


  private url(path: string, body?: StringObject) {
    let str = `${this.apiURL}${path}`
    if (body != null && Object.keys(body).length != 0) {
      str += this.createQuery(body)
    }
    return str
  }

  private async get(url: string, body?: StringObject) {
    return await axios.get(this.url(url, body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.getAuthHeader()
      },
      //@ts-ignore
      data: body
    })
  }

  private async post(url: string, body?: StringObject) {
    return await axios.post(this.url(url, body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.getAuthHeader()
      }
    })
  }

  async ping() {
    return (await this.get("/ping")).data
  }

  async getAppInfo(): Promise<AppInfo> {
    //@ts-ignore
    return (await this.get("/app/info")).data.data
  }

  async getIntentMeta(): Promise<IntentMeta> {
    //@ts-ignore
    return (await this.get("/resources/intent_meta")).data.data
  }

  async getAllIntents(): Promise<Intents[]> {
    //@ts-ignore
    return (await this.get("/resources/intents")).data.data
  }

  async getAccountInfo(code: AccountCode): Promise<AccountInfo> {
    //@ts-ignore
    return (await this.get("/account/info", { code })).data.data
  }

  async getShortendURLS(code: AccountCode): Promise<URLShort[]> {
    //@ts-ignore
    return (await this.get("/account/urlshort", { code })).data.data
  }

  async createShortendURL(code: AccountCode, name: string, host: string, url: string): Promise<void> {
    //@ts-ignore
    return (await this.post("/account/urlshort", { code, name, host, url })).data.data
  }
  async getAccountTunnels(code: AccountCode): Promise<Tunnel[]> {
    //@ts-ignore
    return (await this.get("/account/tunnels", { code })).data.data
  }

  async getAccountLinks(code: AccountCode): Promise<Link[]> {
    //@ts-ignore
    return (await this.get("/account/links", { code })).data.data
  }

  async getAccountLicenses(code: AccountCode): Promise<License[]> {
    //@ts-ignore
    return (await this.get("/account/licenses", { code })).data.data
  }

  async getAccountPermissions(code: AccountCode): Promise<Permission[]> {
    //@ts-ignore
    return (await this.get("/account/permissions", { code })).data.data
  }

  async getAllMetaData(code: AccountCode): Promise<MetaData[]> {
    //@ts-ignore
    return (await this.get("/account/metadata/all", { code })).data.data
  }

  async setMetaData(code: AccountCode, key: string, value: string): Promise<void> {
    //@ts-ignore
    return (await this.get("/account/metadata/set", { code, key, value })).data.data
  }

  async getMetaData(code: AccountCode, key: string): Promise<MetaData[]> {
    //@ts-ignore
    return (await this.get("/account/metadata/get", { code, key })).data.data
  }

  async deleteMetaData(code: AccountCode, key: string): Promise<void> {
    //@ts-ignore
    return (await this.get("/account/metadata/delete", { code, key })).data.data
  }
}

export type IntentMeta = {
  error_message: StringObject,
  default_redirect: {
    accepted: string,
    denied: string
  },
  requires_verified: Intents[],
  lang_name: {
    [key: number]: string
  },
  extra: object
}

export type MetaData = {
  id: number,
  key: string,
  value: string,
}

export type AppInfo = {
  id: number,
  owner: number,
  name: string,
  redirect_uri_agreed: string,
  redirect_uri_denied: string,
  verified: boolean,
  intents: Intents[],
  auth_url: string
}

export type AccountInfo = {
  id?: number,
  username?: string,
  email?: string,
  created?: string,
  "2fa"?: string,
  admin?: boolean,
  verified?: boolean
}

export type URLShort = {
  id: number,
  name: string,
  host: string,
  url: string
}

export type Tunnel = {
  id: number,
  url: string
}

export type Link = {
  id: number,
  type: string,
  oneTime: boolean
}

export type License = {
  id: number,
  type: string,
  status: string,
  disabled: boolean,
  eula: boolean
}

export type Permission = string

export type AccountCode = string

export enum Intents {
  "AccountID" = 0,
  "AccountEmail" = 1,
  "AccountUsername" = 2,
  "AccountPermissions" = 3,
  "AccountCreationDate" = 4,
  "AccountVerified" = 5,
  "AccountIsAdmin" = 6,
  "Account2FAEnabled" = 7,
  "ViewLicenses" = 8,
  "ViewURLShort" = 9,
  "CreateURLShort" = 10,
  "ViewTunnels"= 11,
  "ViewLinks" = 12,
  "MetaData" = 13
}