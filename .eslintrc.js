const ERROR = 2;

const PRETTIER_RULES = {
  'prettier/prettier': ERROR,
};

module.exports = {
  root: true,
  extends: ['@react-native', 'prettier', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    ...PRETTIER_RULES,
  },
};
