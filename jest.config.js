module.exports = {
  modulePaths: [
    '<rootDir>/src',
    '<rootDir>/node_modules'
  ],
  transform: {
    '^.+\\.(js)$': 'babel-jest'
  }
};
