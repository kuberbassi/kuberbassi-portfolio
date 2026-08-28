import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'dump', 'legacy_backup', 'archive', 'public']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', {
        varsIgnorePattern: '^[A-Z_]|motion',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true
      }],
    },
  },
  ...tseslint.config(
    ...tseslint.configs.recommended,
    {
      files: ['src/**/*.{ts,tsx}'],
      extends: [
        reactHooks.configs.flat.recommended,
        reactRefresh.configs.vite,
      ],
      languageOptions: {
        globals: globals.browser,
      },
      rules: {
        // These effects intentionally synchronize React with observers, media
        // queries, and async browser data. The generic compiler rule treats
        // those valid transitions as errors.
        'react-hooks/set-state-in-effect': 'off',
      },
    },
  ),
  {
    files: ['api/**/*.js', 'vite.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
])
