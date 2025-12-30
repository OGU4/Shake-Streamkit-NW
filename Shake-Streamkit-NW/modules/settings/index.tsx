import './styles.css'

import { memo } from 'react'
import { useIntl } from 'react-intl'

import { XMarkIcon } from '@heroicons/react/16/solid'
import * as Dialog from '@radix-ui/react-dialog'
import * as Tabs from '@radix-ui/react-tabs'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'

import DialogMessages from './messages'
import AboutPage from './pages/AboutPage'
import AdvancedPage from './pages/AdvancedPage'
import DataSourcePage from './pages/DataSourcePage'
import DevelopmentPage from './pages/DevelopmentPage'
import GeneralPage from './pages/GeneralPage'
import LogPage from './pages/LogPage'
import ScriptPage from './pages/ScriptPage'

const SettingsWindow = () => {
	const intl = useIntl()
	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>
				<button type='button' className='Button'>
					{intl.formatMessage(DialogMessages.openSettings)}
				</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className='Dialog-overlay' />
				<Dialog.Content className='Dialog-content'>
					<VisuallyHidden.Root asChild>
						<Dialog.Title>
							{intl.formatMessage(DialogMessages.settings)}
						</Dialog.Title>
					</VisuallyHidden.Root>
					<VisuallyHidden.Root asChild>
						<Dialog.Description>
							{intl.formatMessage(DialogMessages.settingsDescription)}
						</Dialog.Description>
					</VisuallyHidden.Root>

					<Tabs.Root className='Dialog-tab' defaultValue='general'>
						<Tabs.List className='Dialog-tablist'>
							<Tabs.Trigger className='Dialog-tabitem' value='general'>
								{intl.formatMessage(DialogMessages.general)}
							</Tabs.Trigger>
							<Tabs.Trigger className='Dialog-tabitem' value='advanced'>
								{intl.formatMessage(DialogMessages.advanced)}
							</Tabs.Trigger>
							<Tabs.Trigger className='Dialog-tabitem' value='script'>
								{intl.formatMessage(DialogMessages.script)}
							</Tabs.Trigger>
							<Tabs.Trigger className='Dialog-tabitem' value='datasource'>
								{intl.formatMessage(DialogMessages.dataSource)}
							</Tabs.Trigger>
							<Tabs.Trigger className='Dialog-tabitem' value='log'>
								{intl.formatMessage(DialogMessages.log)}
							</Tabs.Trigger>
							<Tabs.Trigger className='Dialog-tabitem' value='development'>
								{intl.formatMessage(DialogMessages.development)}
							</Tabs.Trigger>
							<Tabs.Trigger className='Dialog-tabitem' value='about'>
								{intl.formatMessage(DialogMessages.about)}
							</Tabs.Trigger>
						</Tabs.List>
						<Tabs.Content className='Dialog-tabcontent' value='general'>
							<GeneralPage />
						</Tabs.Content>
						<Tabs.Content className='Dialog-tabcontent' value='advanced'>
							<AdvancedPage />
						</Tabs.Content>
						<Tabs.Content className='Dialog-tabcontent' value='script'>
							<ScriptPage />
						</Tabs.Content>
						<Tabs.Content className='Dialog-tabcontent' value='datasource'>
							<DataSourcePage />
						</Tabs.Content>
						<Tabs.Content className='Dialog-tabcontent' value='log'>
							<LogPage />
						</Tabs.Content>
						<Tabs.Content className='Dialog-tabcontent' value='development'>
							<DevelopmentPage />
						</Tabs.Content>
						<Tabs.Content className='Dialog-tabcontent' value='about'>
							<AboutPage />
						</Tabs.Content>
					</Tabs.Root>

					<Dialog.Close asChild>
						<button
							type='button'
							aria-label='Close'
							className='Button SettingsDialog-close'
							tabIndex={-1}
						>
							<XMarkIcon className='Icon16' />
						</button>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}

export default memo(SettingsWindow)
