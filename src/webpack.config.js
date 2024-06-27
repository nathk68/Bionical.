const path = require('path');

module.exports = {
  // ...votre configuration existante...
  module: {
    rules: [
      // ...vos autres règles de chargement...
      {
        test: /pdf\.worker\.js$/,
        use: { loader: 'file-loader' }
      }
    ]
  }
};
