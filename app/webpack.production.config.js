var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [__dirname + "/src/index.js", __dirname + "/src/scss/style.scss"],
  output: {
    path: __dirname + "/build",
    filename: "[name].js"
  },

  module: {
    rules: [
      {
        test: /\.json$/,
        use: "json"
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
        use: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader?importLoaders=1',
        }),
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              publicPath: '/wp-content/plugins/wp-posts-table/app/build',
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + "/index-production.tmpl.html"
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin({ // define where to save the file
      filename: '[name].bundle.css',
      allChunks: true,
    })
  ]
}
