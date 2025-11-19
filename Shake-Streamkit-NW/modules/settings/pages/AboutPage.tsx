import { useIntl } from 'react-intl'

import DialogMessages from '../messages'

const AboutPage = function () {
	const intl = useIntl()

	return (
		<>
			<section className='About-group'>
				<p className='About-name'>
					Shake
					<br />
					StreamKit
				</p>

				<p className='About-version'>
					{intl.formatMessage(
						DialogMessages.aboutVersion,
						{ version: import.meta.env.APP_VERSION },
					)}
				</p>
				<p className='About-copyright'>© 2024 mntone</p>

				<p className='About-license'>
					{intl.formatMessage(DialogMessages.aboutLicense)}
				</p>
			</section>
		</>
	)
}

export default AboutPage
