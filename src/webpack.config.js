const path = require('path');

module.exports = {
  // ...votre configuration existante...
    entry: './src/index.tsx',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },  
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        fallback: {
            "util": require.resolve("util/"),
        },
    },
    module: {
        rules: [
        // ...vos autres règles de chargement...
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        },
        {
            test: /pdf\.worker\.js$/,
            use: { loader: 'file-loader' }
        }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
    },
};
