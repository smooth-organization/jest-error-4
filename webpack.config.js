const path = require('path')
const webpack = require('webpack')
require('dotenv').config()

const HtmlWebpackPlugin = require('html-webpack-plugin')

const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin')

const paths = {
	root: path.resolve(__dirname, '.'),
	source: path.resolve(__dirname, '.', 'src'),
	html: path.resolve(__dirname, '.', 'src', 'index.html'),
	index: path.resolve(__dirname, '.', 'src', 'index.js'),
	favicon: path.resolve(__dirname, '.', 'favicon'),
	build: path.resolve(__dirname, '.', 'build'),
	package: path.resolve(__dirname, '.', 'package.json'),
	modules: path.resolve(__dirname, '.', 'node_modules')
}

const supportedFileExtensions = ['js', 'jsx', 'mjs', 'cjs']
const supportedFileExtensionsRegex = new RegExp(`\\.(${supportedFileExtensions.join('|')})$`)

module.exports = (wenv, argv) => {
	const isEnvProduction = argv.mode === 'production'
	const isEnvDevelopment = !isEnvProduction

	return {
		bail: isEnvProduction,

		mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',

		devtool: isEnvProduction ? 'source-map' : isEnvDevelopment && 'cheap-module-source-map',

		devServer: {
			port: 8080
		},

		entry: [paths.index].filter(Boolean),

		output: {
			path: paths.build,
			pathinfo: isEnvDevelopment,
			clean: true,
			filename: isEnvProduction
				? 'static/js/[name].[contenthash:8].js'
				: isEnvDevelopment && 'static/js/[name].js',
			chunkFilename: isEnvProduction
				? 'static/js/[name].[contenthash:8].chunk.js'
				: isEnvDevelopment && 'static/js/[name].chunk.js',
			publicPath: '/',
			devtoolModuleFilenameTemplate: isEnvProduction
				? (info) =>
						path.relative(paths.source, info.absoluteResourcePath).replace(/\\/g, '/')
				: isEnvDevelopment &&
				  ((info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'))
		},

		performance: {
			hints: isEnvProduction ? 'warning' : isEnvDevelopment && false
		},

		stats: 'errors-warnings',

		optimization: {
			splitChunks: {
				chunks: 'all',
				cacheGroups: {
					common: {
						name: 'common',
						minChunks: 7,
						chunks: 'async',
						priority: 10,
						reuseExistingChunk: true,
						enforce: true
					}
				}
			},
			runtimeChunk: true
		},

		resolve: {
			modules: [paths.source, 'node_modules'],
			extensions: supportedFileExtensions.map((ext) => `.${ext}`)
		},

		module: {
			strictExportPresence: true,
			rules: [
				{
					oneOf: [
						{
							test: supportedFileExtensionsRegex,
							include: paths.source,
							use: [
								{
									loader: 'babel-loader',
									options: {
										compact: isEnvProduction,
										cacheDirectory: isEnvProduction
											? false
											: '.yarn/.cache/babel-loader',
										cacheCompression: false,
										envName: argv.mode,
										plugins: [
											isEnvDevelopment &&
												require.resolve('react-refresh/babel')
										].filter(Boolean)
									}
								}
							]
						}
					]
				}
			]
		},

		plugins: [
			new webpack.DefinePlugin({ APP_ENVIRONMENT: JSON.stringify({}) }),
			new HtmlWebpackPlugin({ template: paths.html }),
			new ModuleNotFoundPlugin(paths.root),
			isEnvDevelopment && new ReactRefreshWebpackPlugin({ overlay: false }),
			isEnvDevelopment && new CaseSensitivePathsPlugin(),
			isEnvDevelopment && new WatchMissingNodeModulesPlugin(paths.modules)
		].filter(Boolean)
	}
}
