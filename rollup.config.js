/* eslint-disable no-console */
import nodeResolve from '@rollup/plugin-node-resolve';

const pkg = require('./package.json');

function onwarn(warning, defaultHandler) {
  if (warning.code !== 'CIRCULAR_DEPENDENCY') {
    defaultHandler(warning);
  }
}

/**
 * Command line arguments:
 *  `config-debug`: print debug information about the build
 */
export default function(commandLineArgs) {
  const debug = !!commandLineArgs['config-debug'];

  if (debug) {
    console.info(pkg);
    console.info(commandLineArgs);
  }

  const outputs = [{
    input: './src/index.js',
    external: Object.keys(pkg.dependencies),
    onwarn,
    output: {
      file: pkg.main,
      format: 'cjs'
    },
    plugins: [ nodeResolve() ]
  }];

  if (debug) {
    console.info(outputs);
  }

  return outputs;
}
