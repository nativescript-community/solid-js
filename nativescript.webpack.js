const path = require('path');
const {
  getPlatformName,
} = require('@nativescript/webpack/dist/helpers/platform');

// Solid 2 publishes an exports map whose `node` condition points at the SSR
// build. Resolving through it leaves the app with a renderer that never applies
// updates, so every entry point is pinned to an explicit browser bundle. `$`
// keeps each alias exact so subpaths still resolve normally.
const solidAliases = (production) => {
  const solidDist = path.join(
    path.dirname(require.resolve('solid-js/package.json')),
    'dist'
  );
  const signalsDist = path.join(
    path.dirname(require.resolve('@solidjs/signals/package.json')),
    'dist'
  );
  const universalDist = path.dirname(require.resolve('@solidjs/universal'));

  return {
    'solid-js$': path.join(solidDist, production ? 'solid.js' : 'dev.js'),
    '@solidjs/signals$': path.join(
      signalsDist,
      production ? 'prod/index.js' : 'dev.js'
    ),
    '@solidjs/universal$': path.join(
      universalDist,
      production ? 'universal.js' : 'dev.js'
    ),
  };
};

const solid = (config, env) => {
  const platform = getPlatformName();

  config.resolve.extensions
    .prepend('.js')
    .prepend('.ts')
    .prepend('.tsx')
    .prepend('.jsx')
    .prepend(`.${platform}.js`)
    .prepend(`.${platform}.ts`)
    .prepend(`.${platform}.jsx`)
    .prepend(`.${platform}.tsx`);

  const aliases = solidAliases(env.production);
  for (const [key, value] of Object.entries(aliases)) {
    config.resolve.alias.set(key, value);
  }

  config.module
    .rule('bundle-source')
    .test(/\.(|t|j)sx?$/)
    .exclude.add(/node_modules/)
    .end()
    .use('babel-loader')
    .loader('babel-loader')
    .before('ts-loader')
    .options({
      babelrc: false,
      configFile: false,
      presets: [
        [
          'babel-preset-solid',
          {
            moduleName: '@nativescript-community/solid-js',
            generate: 'universal',
          },
        ],
        "@babel/typescript"
      ],
      plugins: [
        path.resolve(__dirname, 'babel-plugin-native-class.js'),
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }]
      ],
    });

  if (!env.production) {
    config.output.devtoolNamespace('app');
    config.devServer.hotOnly(true);
    config.devServer.hot(true);
  }
};

module.exports = webpack => webpack.chainWebpack(solid);
