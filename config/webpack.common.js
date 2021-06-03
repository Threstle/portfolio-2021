const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const path = require('path');

const SRC = path.resolve(__dirname, 'node_modules');

module.exports = {
    entry: path.resolve(__dirname, '../src/index.tsx'),

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js"]
    },

    output:
    {
        filename: 'bundle.[contenthash].js',
        path: path.resolve(__dirname, '../dist')
    },

    module: {
        rules: [

            // TS
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ],
            },
            // LESS
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ],
            },
            // AUDIO
            {
                test: /\.(ogg|mp3|wav|mpe?g)$/i,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]'
                }
            },
            {
                test: /\.mp4$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: "video"
                        }
                    }
                ]
            },
            // Images
            {
                test: /\.(jpg|png|gif|svg)$/,
                use:
                    [
                        {
                            loader: 'file-loader',
                            options:
                            {
                                outputPath: 'assets/images/',
                                esModule: false
                            }
                        }
                    ]
            },
            // Fonts
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/fonts/'
                        }
                    }
                ]
            },

            // Shaders
            {
                test: /\.(glsl|vs|fs|vert|frag|txt)$/,
                exclude: /node_modules/,
                use: [
                    'raw-loader',
                    'glslify-loader'
                ]
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },

    watch: false,

    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            minify:false,
            template: path.resolve(__dirname, '../src/index.html'),
            favicon: path.resolve(__dirname, '../src/static/images/favicon-32x32.png'),
            url:"http://etienne-chaumont.fr/",
            title: "Etienne Chaumont - Creative Dev",
            description:"Based in Lyon, France and currently available for freelance jobs, I am a Gobelins Paris graduate with a 5 year experience as a creative developer for Cher Ami. I like NodeJs, ThreeJs, Pixi, Phaser Unity, Gsap, React, GLSL and free jazz."
        })
    ]
};