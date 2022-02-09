import { PkgType } from './enum'
import type {
  CpcPkg,
  Nullable,
  PostMessage,
  RequestId,
  RequestPkg,
  RespCallback,
  ResponsePkg
} from './types'
import { genRequestId } from './utils'

const messageMap: Map<RequestId, RespCallback> = new Map()
const targetMap: Map<string, object> = new Map()

function useCpc() {
  let postMessage: Nullable<PostMessage> = null

  function onMessage(postFn: PostMessage) {
    postMessage = postFn
  }

  function handleMessage(pkg: CpcPkg) {
    if (pkg.type === PkgType.REQUEST) {
      _handleRequest(pkg as RequestPkg)
    }

    if (pkg.type === PkgType.RESPONSE) {
      _handleResponse(pkg as ResponsePkg)
    }
  }

  function _handleRequest(pkg: RequestPkg) {
    const target = targetMap.get(pkg.target)
    const resultPkg: ResponsePkg = {
      type: PkgType.RESPONSE,
      requestId: pkg.requestId,
      success: true,
      data: null
    }
    if (target) {
      try {
        const callResult = target[pkg.cmd](...pkg.args)
        resultPkg.data = callResult
      } catch (e) {
        resultPkg.success = false
        resultPkg.data = e
      }
    } else {
      resultPkg.success = false
      resultPkg.data = new ReferenceError(
        `'${pkg.target}' is not defined. before calling, bind it at the called end.`
      )
    }
    postMessage?.(resultPkg)
  }

  function _handleResponse(pkg: ResponsePkg) {
    const callback = messageMap.get(pkg.requestId)
    if (pkg.success) {
      if (callback) {
        callback(pkg)
      }
    } else {
      throw pkg.data
    }
  }

  function bind(target: object, name: string) {
    targetMap.set(name, target)
  }

  function proxy<T extends object>(name: string) {
    return new Proxy<T>({} as T, {
      get(_, key) {
        return (...args) => {
          const requestId = genRequestId()
          const pkg: RequestPkg = {
            requestId,
            type: PkgType.REQUEST,
            cmd: key as string,
            target: name,
            args
          }

          postMessage?.(pkg)

          return new Promise((reject, resolve) => {
            messageMap.set(requestId, (respPkg: ResponsePkg) => {
              if (respPkg.success) {
                reject(respPkg.data)
              } else {
                resolve(respPkg.data)
              }
            })
          })
        }
      }
    })
  }

  return {
    onMessage,
    handleMessage,
    bind,
    proxy
  }
}
export default useCpc
