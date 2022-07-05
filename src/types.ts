export enum PkgType {
  REQUEST = '__cpc_request__',
  RESPONSE = '__cpc_response__'
}

export type Nullable<T> = T | null

export type RequestId = string

export interface CpcPkg {
  type: PkgType
  requestId: RequestId
}

export interface RequestPkg extends CpcPkg {
  type: PkgType.REQUEST
  cmd: string
  args: unknown[]
}

export interface ResponsePkg extends CpcPkg {
  type: PkgType.RESPONSE
  success: boolean
  data: unknown
}

export type PostMessage = (pkg: CpcPkg) => void

export interface RespCallback {
  (data: ResponsePkg): void
}

export interface MessageHandler {
  // 像目标方发送消息
  postMessage: (data: unknown) => unknown
  // 接收到目标方的消息
  onMessage: (data: unknown, cpcMessageHandler) => void
}
