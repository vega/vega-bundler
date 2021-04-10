import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import virtual from '@rollup/plugin-virtual';
import { rollup } from 'rollup';
import { terser } from 'rollup-plugin-terser';

// internal debug flag
const debug = false;

function onwarn(warning, defaultHandler) {
  if (warning.code !== 'CIRCULAR_DEPENDENCY') {
    defaultHandler(warning);
  }
}

function inputPlugins(code, options) {
  const plugins = [
    virtual({ 'bundle-index.js': code }),
    nodeResolve({
      browser: true,
      modulesOnly: true,
      customResolveOptions: { preserveSymlinks: false }
    }),
    json()
  ]

  // early exit if transpilation is explicitly disabled
  if (options.transpile === false) return plugins;

  // add transpilation via babel
  const targets = options.targets || 'defaults and not IE 11';
  plugins.push(
    babel({
      presets: [[
        '@babel/preset-env',
        { targets, debug }
      ]],
      babelHelpers: 'bundled',
      extensions: ['.js', '.ts']
    })
  );

  return plugins;
}

export async function build(code, options = {}) {
  const inputOptions = {
    input: 'bundle-index.js',
    plugins: inputPlugins(code, options),
    onwarn
  };

  const minify = options.minify === undefined ? true : !!options.minify;
  const outputOptions = {
    name: options.name || 'vegaBundle',
    format: options.format || 'umd',
    plugins: minify ? [ terser({ ecma: 2018 }) ] : undefined
  };

  // create bundle, generate output, then close
  const bundle = await rollup(inputOptions);
  const { output } = await bundle.generate(outputOptions);
  await bundle.close();

  // return output code
  return output[0].code;
}
