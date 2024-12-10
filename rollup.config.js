import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';

export default {
	input: 'src/index.ts',
	output: [
		{
			file: 'dist/index.cjs.js',
			format: 'cjs',
			sourcemap: true,
			exports: 'named',
			name: 'reactMaterialOverlay'
		},
		{
			file: 'dist/index.esm.js',
			format: 'esm',
			sourcemap: true,
			exports: 'named',
			name: 'reactMaterialOverlay'
		}
	],
	plugins: [
		external(),
		resolve(),
		commonjs(),
		postcss({
			modules: false,
			inject: false,
			extract: false
		}),
		typescript({ tsconfig: './tsconfig.json' }),
		terser({
			output: { comments: false },
			compress: {
				drop_console: false
			}
		})
	],
	external: ['react', 'react-dom', '@mui/material', '@emotion/styled', '@emotion/react']
};
