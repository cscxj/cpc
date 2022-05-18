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

function genRequestId() {
  return Date.now()
}

function useCpc(executor?) {
  const messageMap: Map<RequestId, RespCallback> = new Map()
  let callTarget: Nullable<object> = null

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

  async function _handleRequest(pkg: RequestPkg) {
    const resultPkg: ResponsePkg = {
      type: PkgType.RESPONSE,
      requestId: pkg.requestId,
      success: true,
      data: null
    }
    if (callTarget) {
      try {
        const callResult = await callTarget[pkg.cmd](...pkg.args)
        resultPkg.data = callResult
      } catch (e) {
        resultPkg.success = false
        if (
          e instanceof TypeError &&
          (e.message = 'callTarget[pkg.cmd] is not a function')
        ) {
          resultPkg.data = new Error(`[cpc] 被调用对象不存在函数 ${pkg.cmd} `)
        } else {
          resultPkg.data = e
        }
      }
    } else {
      resultPkg.success = false
      resultPkg.data = new Error(
        '[cpc] 被调用端需要绑定一个调用目标，例如：useCpc(target)'
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

  function bind(target: object) {
    callTarget = target
  }

  function proxy<T extends object>() {
    return new Proxy<T>({} as T, {
      get(_, key) {
        return (...args) => {
          const requestId = genRequestId()
          const pkg: RequestPkg = {
            requestId,
            type: PkgType.REQUEST,
            cmd: key as string,
            args
          }

          postMessage?.(pkg)

          return new Promise((resolve, reject) => {
            messageMap.set(requestId, (respPkg: ResponsePkg) => {
              if (respPkg.success) {
                resolve(respPkg.data)
              } else {
                reject(respPkg.data)
              }
            })
          })
        }
      }
    })
  }

  executor && bind(executor)

  return {
    onMessage,
    handleMessage,
    Channel: proxy()
  }
}

export { useCpc }
