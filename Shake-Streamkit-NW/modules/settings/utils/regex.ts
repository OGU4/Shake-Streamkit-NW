const alphabet = 'A-Za-z'
const alphanum = `${alphabet}0-9`
const domainLabel = `[${alphanum}](?:[${alphanum}\\-]{0,61}[${alphanum}])?`
const topLabel = `[${alphabet}](?:[${alphanum}\\-]{0,61}[${alphanum}])?`
export const hostname = `(?:${domainLabel}\\.)*${topLabel}`

const ipv4Part = '(?:25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)'
export const ipv4 = `(?:${ipv4Part}\\.){3}${ipv4Part}`

export const host = `(?:${hostname}|${ipv4})`

export const port = '(?:6553[0-5]|655[0-2]\\d|65[0-4]\\d{2}|6[0-4]\\d{3}|[1-5]\\d{4}|[1-9]\\d{1,3}|[1-9])'
export const hostport = `${host}(?::${port})?`

export const websocket = `wss?://${hostport}/?`
