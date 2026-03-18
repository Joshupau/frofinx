type UnknownRecord = Record<string, unknown>

export const isRecord = (value: unknown): value is UnknownRecord => {
  return typeof value === 'object' && value !== null
}

export const getApiDataNode = (payload: unknown): unknown => {
  if (!isRecord(payload)) return payload
  if ('data' in payload) {
    return payload.data
  }
  return payload
}

export const extractArrayFromApiResponse = <T>(payload: unknown, keys: string[] = ['items']): T[] => {
  const dataNode = getApiDataNode(payload)

  if (Array.isArray(dataNode)) {
    return dataNode as T[]
  }

  if (!isRecord(dataNode)) {
    return []
  }

  for (const key of keys) {
    const value = dataNode[key]
    if (Array.isArray(value)) {
      return value as T[]
    }
  }

  return []
}

export const extractNumberFromApiResponse = (payload: unknown, keys: string[], fallback = 0): number => {
  const dataNode = getApiDataNode(payload)
  if (!isRecord(dataNode)) return fallback

  for (const key of keys) {
    const value = dataNode[key]
    const numericValue = typeof value === 'number' ? value : Number(value)

    if (Number.isFinite(numericValue)) {
      return numericValue
    }
  }

  return fallback
}

export const resolveEntityId = (record: UnknownRecord, fallback: string): string => {
  const raw = record._id ?? record.id
  if (typeof raw === 'string' && raw.trim().length > 0) {
    return raw
  }
  return fallback
}