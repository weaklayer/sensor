const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    background: './src/background/background.ts',
    content: './src/content/content.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json'
            }
          }
        ],
        exclude: /node_modules/
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'LICENSE' },
        { from: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js' },
        { from: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js.map' },
        { from: 'icon16.png' },
        { from: 'icon48.png' },
        { from: 'icon128.png' }
      ]
    })
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  }
};
