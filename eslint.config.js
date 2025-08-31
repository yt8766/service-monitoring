// eslint.config.mjs
import eslint from '@eslint/js';
import eslintPrettier from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintPluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// 前端配置
const frontendConfig = {
  files: ['apps/frontend/monitor/**/*.{js,ts,vue,jsx,tsx}'],
  ignores: ['apps/frontend/monitor/src/components/ui/**/*'],
  extends: [...eslintPluginVue.configs['flat/recommended']],
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    globals: {
      ...globals.browser
    },
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      }
    },
    parser: tseslint.parser
  },
  plugins: {
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    'react-refresh/only-export-components': [
      'warn',
      {
        allowConstantExport: true
      }
    ]
  }
};

// 后端配置
const backendConfig = {
  files: ['apps/backend/**/*.{js,ts}'],
  languageOptions: {
    globals: {
      ...globals.node
    },
    parser: tseslint.parser
  },
  rules: {
    'no-unused-vars': 'off',
    'no-undef': 'error'
  }
};

// const dtsConfig = {
//   files: ['**/*.d.ts'],
//   languageOptions: {
//     parser: tseslint.parser
//   }
// };

const ignores = [
  'dist',
  'node_modules',
  'build',
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/*.d.ts',
  '**/*.js',
  '**/*.mjs',
  'demos/**',
  'eslint.config.js',
  'README.md',
  'logs/**',
  'apps/frontend/monitor/src/components/ui/**/*'
];

export default tseslint.config(
  // 全局忽略，优先级最高
  { ignores },
  // 通用配置
  {
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
    plugins: {
      prettier: eslintPrettier,
      tseslint
      // "simple-import-sort": importSort
    },

    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off'
      // "simple-import-sort/imports": "error",
      // "simple-import-sort/exports": "error"
    },
    languageOptions: {
      parser: tseslint.parser
    }
  },
  // 前端配置
  frontendConfig,
  // 后端配置
  backendConfig
  // dtsConfig
);
