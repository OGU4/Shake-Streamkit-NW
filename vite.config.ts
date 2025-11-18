import { readFileSync } from 'fs'
import { env } from 'node:process'
import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react-swc'
import { config } from 'dotenv'
import sri from 'rollup-plugin-sri'
import { createHtmlPlugin as html } from 'vite-plugin-html'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

import packageJson from './package.json'

config()
config({ path: '.env.local', override: true })

const isDevelopment = env.NODE_ENV === 'development'

export default defineConfig({
	base: '/shake-streamkit/',
	resolve: {
		alias: [
			{ find: '@/voices', replacement: fileURLToPath(new URL('./src/voices', import.meta.url)) },
			{ find: '@', replacement: fileURLToPath(new URL('./src/modules', import.meta.url)) },
		],
	},
	build: {
		target: ['esnext', 'chrome103', 'safari16'],
		assetsDir: 'a',
		cssMinify: 'lightningcss',
		reportCompressedSize: false,
		rollupOptions: {
			output: {
				generatedCode: {
					constBindings: true,
					objectShorthand: true,
				},
			},
		},
	},
	define: {
		'import.meta.env.APP_VERSION': JSON.stringify(packageJson.version),
	},
	plugins: [
		tsconfigPaths(),
		react({
			devTarget: 'esnext',
			jsxImportSource: isDevelopment ? '@welldone-software/why-did-you-render' : undefined,
		}),
		html({
			minify: true,
		}),
		{
			enforce: 'post',
			...sri({
				algorithms: ['sha256'],
				publicPath: '/shake-streamkit/',
			}),
		},
	],
	server: {
		https: env.SERVER_SSLCERT && env.SERVER_SSLKEY && {
			cert: readFileSync(env.SERVER_SSLCERT),
			key: readFileSync(env.SERVER_SSLKEY),
		} as any,
	},
	test: {
		environment: 'jsdom',
		globals: true,
		include: ['src/**/*.test.[jt]s?(x)'],
		setupFiles: [
			'src/setupTests.ts',
		],
	},
})
