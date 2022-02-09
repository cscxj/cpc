import { RollupOptions } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'
import tsConfig from './tsconfig.json'

const config: RollupOptions = {
  input: 'lib/main.ts',
  output: [
    {
      format: 'umd',
      file: `dist/${pkg.name}.umd.js`,
      name: 'cpc'
    },
    {
      format: 'esm',
      file: `dist/${pkg.name}.esm.js`
    }
  ],
  plugins: [typescript(tsConfig.compilerOptions)]
}

export default config
