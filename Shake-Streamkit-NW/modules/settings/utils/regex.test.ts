import { hostname, hostport, ipv4, port } from './regex'

const hostRegex = new RegExp(`^${hostname}$`)
test.each([
	['localhost', true],

	['domain.jp', true],
	['domain.com', true],

	['subdomain.domain.jp', true],
	['subdomain.domain.com', true],

	['hyphen-test.hyphen-test.jp', true],

	['digit-test.ng.0abc', false],
	['digit-test.ok.abc0', true],
])('host "%s" is %s', (host, expected) => {
	const result = hostRegex.test(host)
	expect(result).toBe(expected)
})

const ipv4Regex = new RegExp(`^${ipv4}$`)
test.each([
	['192.168.1.-1', false],
	['192.168.1.0', true],
	['192.168.1.1', true],
	['192.168.1.2', true],
	['192.168.1.254', true],
	['192.168.1.255', true],
	['192.168.1.256', false],

	['172.16.0.-1', false],
	['172.16.0.0', true],
	['172.16.0.1', true],
	['172.16.0.2', true],
	['172.16.0.254', true],
	['172.16.0.255', true],
	['172.16.0.256', false],

	['10.0.0.-1', false],
	['10.0.0.0', true],
	['10.0.0.1', true],
	['10.0.0.2', true],
	['10.0.0.254', true],
	['10.0.0.255', true],
	['10.0.0.256', false],
])('IPv4 "%s" is %s', (host, expected) => {
	const result = ipv4Regex.test(host)
	expect(result).toBe(expected)
})

const portRegex = new RegExp(`^${port}$`)
test.each([
	['-1', false],
	['0', false],
	['1', true],
	['2', true],

	['99', true],
	['100', true],
	['101', true],

	['999', true],
	['1000', true],
	['1001', true],

	['9999', true],
	['10000', true],
	['10001', true],

	['65534', true],
	['65535', true],
	['65536', false],
])('Port "%s" is %s', (host, expected) => {
	const result = portRegex.test(host)
	expect(result).toBe(expected)
})

const mixedRegex = new RegExp(`^${hostport}$`)
test.each([
	['localhost:4649', true],
	['192.168.1.2:4649', true],
])('Host & port "%s" is %s', (host, expected) => {
	const result = mixedRegex.test(host)
	expect(result).toBe(expected)
})
