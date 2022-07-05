import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'
import tsConfig from './tsconfig.json'

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'src/index.ts',
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
  plugins: [typescript(tsConfig)]
}

export default config
