module.exports = {
    type: 'react-app',
    babel: {
      stage: 0,
      runtime: true
    },
  
    karma: false,
  
    devServer: {
      hot: false
    },
  
    webpack: {
      rules: {
        babel: {
          test: /\.jsx?$/
        }
      },
      html: {
        mountId: "root",
      },
      extra: {
        resolve: {
          extensions: ['.js', '.jsx']
        }
      }
    }
  }
  