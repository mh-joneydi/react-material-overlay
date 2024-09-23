import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';

export default {
	input: 'src/index.ts',
	output: [
		{
			file: 'dist/index.cjs.js',
			format: 'cjs',
			sourcemap: false,
			exports: 'named',
			name: 'ReactOverlayComponents'
		},
		{
			file: 'dist/index.esm.js',
			format: 'esm',
			sourcemap: false,
			exports: 'named',
			name: 'ReactOverlayComponents'
		}
	],
	plugins: [
		external(),
		resolve(),
		commonjs(),
		typescript({ tsconfig: './tsconfig.json' }),
		terser({
			output: { comments: false },
			compress: {
				drop_console: true
			}
		})
	],
	external: ['react', 'react-dom']
};
