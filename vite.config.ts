import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub project pages are served at /<repository-name>/ — keep in sync with repo name.
const repoBase = '/embed-rtcstats/'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'serve' ? '/' : repoBase,
}))
