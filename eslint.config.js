import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';
import eslintPluginReactRefresh from 'eslint-plugin-react-refresh';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslint from '@eslint/js';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';

export default tseslint.config({
	name: 'Remate',
	files: ['./src/**/*.{ts,tsx,js,jsx}'],
	linterOptions: { reportUnusedDisableDirectives: 'warn' },
	languageOptions: {
		parser: tseslint.parser,
		parserOptions: {
			project: true
		}
	},
	plugins: {
		'@typescript-eslint': tseslint.plugin,
		'unused-imports': eslintPluginUnusedImports,
		react: eslintPluginReact,
		'react-hooks': eslintPluginReactHooks,
		'react-refresh': eslintPluginReactRefresh,
		prettier: eslintPluginPrettier,
		'simple-import-sort': eslintPluginSimpleImportSort
	},
	extends: [
		// Eslint
		eslint.configs.recommended,
		// TypeScript
		...tseslint.configs.recommended,
		...tseslint.configs.stylistic,
		// React
		eslintPluginReact.configs.flat.recommended,
		eslintPluginReact.configs.flat['jsx-runtime'],
		// Prettier
		eslintPluginPrettierRecommended
	],
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.ts', '.tsx', '.json']
			}
		},
		react: {
			version: 'detect'
		}
	},
	rules: {
		...eslintPluginReactHooks.configs.recommended.rules,
		'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
		'prettier/prettier': 'warn',
		quotes: [
			'warn',
			'single',
			{
				allowTemplateLiterals: true,
				avoidEscape: true
			}
		],
		'padding-line-between-statements': [
			'warn',
			{ blankLine: 'always', prev: 'function', next: '*' },
			{ blankLine: 'always', prev: '*', next: 'if' },
			{ blankLine: 'always', prev: 'if', next: '*' },
			{ blankLine: 'always', prev: '*', next: 'function' }
		],
		'no-console': ['error', { allow: ['error', 'warn'] }],

		//  React
		'react/prop-types': 'off',

		// Unused imports
		'unused-imports/no-unused-imports': 'error',

		// TypeScript
		'@typescript-eslint/prefer-for-of': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-unsafe-function-type': 'off',
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				caughtErrorsIgnorePattern: '^_'
			}
		],

		// import/export sorting
		'simple-import-sort/imports': [
			'error',
			{
				groups: [
					// Side effect imports.
					['^\\u0000'],
					// Packages. `react` related packages come first.
					['^react', '^@?\\w'],
					// Parent imports. Put `..` last.
					['^\\.\\.(?!/?$)', '^\\.\\./?$'],
					// Other relative imports. Put same-folder imports and `.` last.
					['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$']
				]
			}
		],
		'simple-import-sort/exports': 'error'
	}
});
