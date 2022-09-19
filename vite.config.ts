import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import lessToJS from 'less-vars-to-js';
import * as fs from 'fs';
import * as path from 'path';
import {MetaMaskInpageProvider} from '@metamask/providers';
import {NodeGlobalsPolyfillPlugin} from '@esbuild-plugins/node-globals-polyfill'

const themeVariables = lessToJS(
    fs.readFileSync(path.resolve(__dirname, './src/config/variables.less'), 'utf8')
);

// https://vitejs.dev/config/
export default defineConfig({
    alias: {},
    css: {
        preprocessorOptions: {
            less: {
                modifyVars: themeVariables,
                javascriptEnabled: true
            }
        }
    },
    plugins: [react()],
    server: {
        port: 5000
    },
    define: {
        'process.env': {}
    },
    resolve: {
        alias: [{find: '@', replacement: path.resolve(__dirname, 'src')}],
    },
    optimizeDeps: {
        esbuildOptions: {
            // Node.js global to browser globalThis
            define: {
                global: 'globalThis'
            },
            // Enable esbuild polyfill plugins
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    buffer: true
                })
            ]
        }
    }

})
