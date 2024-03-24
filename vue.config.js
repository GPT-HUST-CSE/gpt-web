const AutoImport = require('unplugin-auto-import/webpack').default;
const Components = require('unplugin-vue-components/webpack').default;
const ElementPlus = require('unplugin-element-plus/webpack')

const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      AutoImport(),
      Components(),
      ElementPlus()
    ]
  }
});
