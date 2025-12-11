const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    })
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|mp4)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.html$/i,
        type: 'asset/resource',
        exclude: path.resolve(__dirname, 'index.html')
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devServer: {
    port: 3000,
    open: true
  }
}