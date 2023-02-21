module.exports = function (api) {
	const mode = api.env()
	const isEnvTest = mode === 'test'

	const presets = [
		[
			'@babel/preset-env',
			{
				modules: isEnvTest ? 'commonjs' : false,
				corejs: 3,
				useBuiltIns: 'usage',
				shippedProposals: true
			}
		],
		['@babel/preset-react', { runtime: 'automatic' }]
	]
	const plugins = [
		['@babel/plugin-transform-runtime', { corejs: 3, useESModules: !isEnvTest }],
		['@babel/plugin-syntax-dynamic-import'],
		['@babel/plugin-proposal-private-methods'],
		['@babel/plugin-proposal-class-properties'],
		['@babel/plugin-proposal-optional-chaining'],
		['@babel/plugin-proposal-object-rest-spread', { loose: true }],
		['@babel/plugin-proposal-export-default-from'],
		['@babel/plugin-proposal-nullish-coalescing-operator']
	].filter(Boolean)

	return { presets, plugins }
}
