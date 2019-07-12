import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from "rollup-plugin-terser";
import pkg from './package.json';
import { basename } from 'path';
const isDev = process.env.NODE_ENV === 'development';

export default {
  input: pkg['source'],
  output: [
  	{ 
  		file: pkg['main'],
  		format: 'cjs',
  		sourcemap: isDev ? true : false
  	},
  	{ 
  		file: pkg['module'],
  		format: 'esm',
  		sourcemap: isDev ? true : false
  	},
  	{ 
  		file: pkg['umd:main'],
  		format: 'umd',
  		name: basename(pkg['umd:main']).replace(/\.umd\.js$/, ''),
  		sourcemap: isDev ? true : false
  	}
  ],
  plugins: [
    resolve(),
    babel({
      include: 'src/**'
    }),
    terser()
  ],
  watch: {
  	exclude: 'node_modules/**'
  }
};
