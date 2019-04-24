module.exports = {
  "presets": [
    "module:metro-react-native-babel-preset"
  ],
  "plugins": [
    "@babel/plugin-proposal-class-properties"
  ],
  "env": {
    "development": {
      "plugins": [
        "@babel/plugin-transform-react-jsx-source",
        '@babel/plugin-transform-runtime'
      ]
    }
  }
}
