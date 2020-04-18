const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  plugins: [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ['lib']
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
  ],
  output: {
    path: __dirname + '/lib',
    filename: 'build/[name].[contenthash].js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
}
