import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import { eslint } from 'rollup-plugin-eslint';

const isDev = process.env.NODE_ENV !== 'production';

import pkg from './package.json';

export default [
	{
		input: 'src/index.js',
		output: {
			name: 'timeout',
			file: pkg.browser,
			format: 'umd'
		},
		plugins: [
			resolve(),  // 这样 Rollup 能找到 `ms`
			commonjs(), // 这样 Rollup 能转换 `ms` 为一个ES模块
			eslint({
				throwOnError: true,
				throwOnWarning: true,
				include: ['src/**'],
				exclude: ['node_modules/**']
			}),
			babel({
        exclude: 'node_modules/**', // 防止打包node_modules下的文件
        runtimeHelpers: true,       // 使plugin-transform-runtime生效
      }),
			!isDev && terser()
		]
	},
	{
		input: 'src/index.js',
		external: ['ms'],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		]
	}
];
