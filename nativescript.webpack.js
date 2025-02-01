const path = require('path');
const {
  getPlatformName,
} = require('@nativescript/webpack/dist/helpers/platform');

const solid = (config, env) => {
  const platform = getPlatformName();

  const solidPath = path.resolve(require.resolve("solid-js"), "../..");

  config.resolve.extensions
    .prepend('.js')
    .prepend('.ts')
    .prepend('.tsx')
    .prepend('.jsx')
    .prepend(`.${platform}.js`)
    .prepend(`.${platform}.ts`)
    .prepend(`.${platform}.jsx`)
    .prepend(`.${platform}.tsx`);

  config.resolve.alias
    .set(
      'solid-js/universal',
      path.resolve(solidPath, `universal/dist/${env.production ? 'universal' : 'dev'}.js`)
    )
    .set(
      'solid-js/store',
      path.resolve(solidPath, `store/dist/${env.production ? 'store' : 'dev'}.js`)
    )
    .set(
      'solid-js',
      path.resolve(solidPath, `dist/${env.production ? 'solid' : 'dev'}.js`)
    )
    .set(
      'solid-js/web',
      path.resolve(solidPath, `dist/${env.production ? 'web' : 'dev'}.js`)
    );

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
      env: {
        development: {
          plugins: [['solid-refresh/babel', { bundler: 'webpack5' }]],
        },
      },
    });

  if (!env.production) {
    config.output.devtoolNamespace('app');
    config.devServer.hotOnly(true);
    config.devServer.hot(true);
  }
};

module.exports = webpack => webpack.chainWebpack(solid);

