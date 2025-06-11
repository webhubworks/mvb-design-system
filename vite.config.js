import tailwindcss from '@tailwindcss/vite'
import {defineConfig, loadEnv} from 'vite'
import viteRestart from 'vite-plugin-restart'
import * as path from 'node:path'

// https://vite.dev/config/
export default defineConfig(({command, mode}) => {
    return {
        base: command === 'serve' ? '' : '/dist/',
        build: {
            manifest: true,
            outDir: '../../../web/dist/',
            rollupOptions: {
                input: {
                    app: './js/app.js',
                },
            },
            sourcemap: true,
        },
        plugins: [
            tailwindcss(),
            viteRestart({
                reload: [
                    './components/**/*',
                    './js/**/*',
                    './css/**/*',
                    '../../theme.css',
                    '../../templates/**/*',
                ],
            }),
        ],
        server: {
            host: '0.0.0.0',
            port: 5173,
            strictPort: true,
            origin: `${getPrimarySiteUrl(mode)}:5173`,
            cors: {
                origin: /^https?:\/\/(?:[a-zA-Z0-9-]+\.)+ddev\.site(?::\d+)?$/,
            },
            allowedHosts: ['.ddev.site'],
        },
        resolve: {
            alias: {
                '@components': path.resolve(__dirname, './components'),
                '@js': path.resolve(__dirname, './js'),
                '@css': path.resolve(__dirname, './css'),
            }
        }
    }
})

const getPrimarySiteUrl = (mode) => {
    const env = loadEnv(mode, process.cwd() + '/../../../', '')

    if (env.PRIMARY_SITE_URL === undefined || env.PRIMARY_SITE_URL === '') {
        throw new Error('PRIMARY_SITE_URL is not set in .env')
    }

    return env.PRIMARY_SITE_URL.charAt(env.PRIMARY_SITE_URL.length - 1) === '/'
        ? env.PRIMARY_SITE_URL.slice(0, env.PRIMARY_SITE_URL.length - 1)
        : env.PRIMARY_SITE_URL
}
