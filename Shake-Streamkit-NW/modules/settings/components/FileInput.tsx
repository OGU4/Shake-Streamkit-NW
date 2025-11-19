import { ChangeEvent } from 'react'

import { ShakeEvent } from '@/telemetry/models/telemetry'

function onload(
	this: FileReader,
	onFileChange: ((telemetry: Readonly<ShakeEvent>[]) => void),
	_: ProgressEvent<FileReader>,
) {
	const data = this.result as string
	const lineArray = data.split('\n').filter(line => line.trim() !== '')
	const events = lineArray.map(line => JSON.parse(line) as ShakeEvent)
	if (events.length !== 0) {
		onFileChange.call(null, events)
	}
}

interface FileInputProps {
	onFileChange?(telemetry: Readonly<ShakeEvent>[]): void
}

const FileInput = ({ onFileChange }: FileInputProps) => {
	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = onload.bind(reader, onFileChange!)
			reader.readAsText(file)
		}
	}

	return (
		<input
			className='File'
			type='file'
			accept='.json'
			disabled={onFileChange === undefined}
			onChange={handleFileChange}
		/>
	)
}

export default FileInput
