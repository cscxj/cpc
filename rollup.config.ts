import { RollupOptions } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'
import tsConfig from './tsconfig.json'

const config: RollupOptions = {
  input: 'lib/main.ts',
  output: [
    {
      format: 'umd',
      file: pkg.browser,
      name: 'cpc'
    },
    {
      format: 'esm',
      file: pkg.module
    },
    {
      format: 'cjs',
      file: pkg.main
    }
  ],
  plugins: [typescript(tsConfig.compilerOptions)]
}

export default config
