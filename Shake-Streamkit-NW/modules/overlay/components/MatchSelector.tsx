import { type FormatDateOptions, useIntl } from 'react-intl'
import { connect } from 'react-redux'

import { Select, SelectItem } from '@/core/components/Select'
import { ShakeMatch } from '@/telemetry/models/match'
import { selectMatches } from '@/telemetry/selector'

import type { RootState } from 'app/store'

import OverlayMessages from '../messages'
import { selectMatchId } from '../selector'
import { setMatch } from '../slicers'

import type { ConditionalExcept } from 'type-fest'

const opts: FormatDateOptions = Object.freeze({
	year: 'numeric',
	month: 'short',
	day: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
})

interface MatchSelectorProps {
	readonly matches: ShakeMatch[]
	readonly matchId?: string
	changeMatch(id: string): void
}

export const MatchSelector = function (props: MatchSelectorProps) {
	const {
		matches,
		matchId,

		changeMatch,
	} = props
	const intl = useIntl()

	return (
		<Select
			disabled={matches.length === 0}
			value={matchId}
			placeholder={intl.formatMessage(OverlayMessages.noData)}
			onValueChange={changeMatch}
		>
			{matches
				.toSorted((a, b) => a.timestampInMillisecond - b.timestampInMillisecond)
				.map(match => (
					<SelectItem key={match.id} value={match.id}>
						{intl.formatDate(match.timestampInMillisecond, opts)}
					</SelectItem>
				))}
		</Select>
	)
}

function mapStateToProps(state: RootState) {
	return {
		matches: selectMatches(state),
		matchId: selectMatchId(state),
	} satisfies ConditionalExcept<MatchSelectorProps, Function>
}

const actionCreators = {
	changeMatch: setMatch,
}

export default connect(
	mapStateToProps,
	actionCreators,
)(MatchSelector)
