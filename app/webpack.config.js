var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'eval-source-map',

  entry: __dirname + "/src/index.js",
  output: {
    path: __dirname + "/build",
    filename: "./bundle.js",
    publicPath: '/'
  },

  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: "json"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets:[ 'es2015', 'react', 'stage-2' ]
        }
      },
      {
        test: /\.scss$/,
        loaders: 'sass-loader'
      },
      {
        test: /\.css$/,
        loaders: 'css-loader'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + "/index.tmpl.html"
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],

  devServer: {
    contentBase: "./build",
    historyApiFallback: true,
    port: process.env.PORT||8080,
    inline: true,
    hot: true,
    proxy: {
      "*": {
        target: "http://plugins.dev.cc",
        ignorePath: false,
        changeOrigin: true,
        secure: false
      }
    }
  }
}
