import { ReactNode, memo } from 'react'
import { IntlShape, useIntl } from 'react-intl'

import EggGraphMessages from './messages'

// -----[ Wave ]----------
interface WaveProps {
	readonly wave: number
	readonly intl: IntlShape
}

function getLargeTextNode(chunks: ReactNode[]) {
	return (
		<span style={{ fontSize: '1.25em' }}>
			{chunks}
		</span>
	)
}

export const Wave = function ({ wave, intl }: WaveProps) {
	return (
		<span className='EggGraph-wave'>
			{intl.formatMessage(
				EggGraphMessages.wave,
				{
					big: getLargeTextNode,
					wave,
				},
			)}
		</span>
	)
}

// -----[ Status ]----------
interface StatusProps {
	readonly status?: boolean | undefined
	readonly intl: IntlShape
}

export const Status = function ({ status, intl }: StatusProps) {
	if (status === undefined) {
		return null
	}

	return (
		<span className={`EggGraph-status EggGraph-status-${status ? 'clear' : 'fail'}`}>
			{intl.formatMessage(status ? EggGraphMessages.clear : EggGraphMessages.fail)}
		</span>
	)
}

// -----[ Quota ]----------
interface QuotaProps {
	readonly amount: number
	readonly quota: number
	readonly intl: IntlShape
}

export const Quota = function ({ intl, ...nextProps }: QuotaProps) {
	return (
		<span className='EggGraph-quota'>
			{intl.formatMessage(EggGraphMessages.quotaFormat, nextProps)}
		</span>
	)
}

// -----[ Header ]----------
type HeaderProps =
	& Omit<WaveProps, 'intl' >
	& Omit<StatusProps, 'intl' >
	& Omit<QuotaProps, 'intl'>

const MemoWave = memo(Wave)
const MemoStatus = memo(Status)
const MemoQuota = memo(Quota)

export const Header = function ({ wave, status, ...quotaProps }: HeaderProps) {
	const intl = useIntl()
	return (
		<header>
			<MemoWave intl={intl} wave={wave} />
			<MemoStatus intl={intl} status={status} />
			<MemoQuota intl={intl} {...quotaProps} />
		</header>
	)
}

export default Header
