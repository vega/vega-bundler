# vega-bundler

Utilities for pre-parsing Vega and Vega-Lite specifications and producing optimized output bundles via [rollup](https://rollupjs.org/).

Both and Vega and Vega-Lite have their own parser and compiler. Vega-Lite specifications compile to full Vega specifications, which in turn are parsed to an intermediate dataflow specification that serves as input to an instantiated Vega view. In addition, Vega provides a number of data and visual encoding transforms, but not all of them may be needed within a given a deployment.

To reduce both file size and loading time, this package pre-parses input specifications and generate optimized code bundles that include only the underlying transforms that are actually used.

## API Reference

<a name="bundle" href="#bundle">#</a>
<b>bundle</b>(<i>specs</i>[, <i>options</i>])
[<>](https://github.com/vega/vega-bundler/blob/master/src/index.js "Source")

Returns bundled source code for browser use. For each named specification in _specs_, exports a method with the same name that creates a Vega View for that specification. The exported methods take a [Vega View constructor](https://vega.github.io/vega/docs/api/view/#view) options object as input.

* _specs_: An object of key-value pairs where the key is a unique name (must be a valid JavaScript identifier) and the value is a Vega or Vega-Lite specification object. The specifications should include the `$schema` property indicating the Vega or Vega-Lite schema.
* _options_: An object containing build options passed to the rollup bundler:
  * _babel_: A boolean flag (default `true`) indicating if the Vega code should be transpiled by Babel for greater browser compatibility.
  * _targets_: A string indicating the Babel transpilation target platforms (default `'defaults and not IE 11'`). This option is ignored if the *babel* option is `false`.
  * _name_: The name of the output bundle (default `'vegaBundle'`). This corresponds to the global variable name for the compiled bundle when loaded directly via the browser `<script>` tag.
  * _format_: The output format for the bundle (default `'umd'`). Valid options are `'umd'` (universal module definition), `'iife'` (immediately-invoked function expression), and `es` (EcmaScript module).
  * _minify_: A boolean flag (default `true`) indicating if output code should be minified using [terser](https://github.com/terser/terser).

## Command Line Utility

`vega_bundle [-o output_file] specification_list`
