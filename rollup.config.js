import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import builtins from 'rollup-plugin-node-polyfills';
import globals from 'rollup-plugin-node-globals';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/decoder.js',
      format: 'cjs',
      name: 'Decoder'
    },
    {
      file: 'dist/decoder-es.js',
      format: 'es',
      name: 'Decoder'
    }
  ],
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: true,
      extensions: ['.js', '.json']
    }),
    commonjs({
      namedExports: {
        lodash: ['lodash']
      }
    }),
    globals(),
    builtins()
  ]
};
