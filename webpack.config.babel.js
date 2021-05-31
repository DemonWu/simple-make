import path from 'path';
import ShebangPlugin from "webpack-shebang-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import {CleanWebpackPlugin} from "clean-webpack-plugin";

export default  {
    target: "node",
    entry: './index.js',
    mode: 'development',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/, /template/],
                use: [
                    {
                        loader: 'babel-loader',
                    }
                ]
            }
        ]
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './dist/'),
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new ShebangPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: __dirname + "/template",
                    to: __dirname + "/dist/template",
                    force: true,
                    info: { minimized: true },
                },
                {
                    from: __dirname + "/json",
                    to: __dirname + "/dist/json",
                    force: true,
                    info: { minimized: true },
                }
            ]
        }),
    ]
};
