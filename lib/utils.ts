import { Nullable } from './types'

export function getPropByPath(
  obj: any,
  path: string
): {
  o: unknown
  k: string
  v: Nullable<unknown>
} {
  let tempObj = obj
  let key, value

  if (obj && path in obj) {
    key = path
    value = tempObj?.[path]
  } else {
    const keyArr = path.split('.')
    let i = 0
    for (; i < keyArr.length - 1; i++) {
      if (!tempObj) break
      const key = keyArr[i]

      if (key in tempObj) {
        tempObj = tempObj[key]
      } else break
    }
    key = keyArr[i]
    value = tempObj?.[keyArr[i]]
  }
  return {
    o: tempObj,
    k: key,
    v: value
  }
}

export function genRequestId() {
  return Date.now()
}
