/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly APP_VERSION: string

	readonly VITE_WS_SERVER: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}

declare module '*.wav'
