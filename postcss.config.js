module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      viewportWidth: 375,
      viewportHeight: 667,
      selectorBlackList: ['.ignore'], // 指定不需要转换的类，
      minPixelValue: 1, // 小于或等于‘1px’不转换为视窗单位
      // propList:["*","!font-size"]
      // exclude: [/node_modules/],
      mediaQuery: false,
      replace: true,
      landscape: false,
    },
  },
};
