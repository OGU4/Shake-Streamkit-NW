const buildEditorUrl = () => {
	const base = import.meta.env.BASE_URL ?? '/'
	const origin = new URL(base, window.location.origin)
	return new URL('script-editor', origin)
}

export const getScriptEditorUrl = (): string => {
	return buildEditorUrl().toString()
}

export const getScriptEditorPathname = (): string => {
	return buildEditorUrl().pathname.replace(/\/+$/, '')
}

export const isScriptEditorPath = (pathname: string = window.location.pathname): boolean => {
	const current = pathname.replace(/\/+$/, '')
	const editorPath = getScriptEditorPathname()
	return current === editorPath
}
