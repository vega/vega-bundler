# vega-bundler

Utilities for pre-parsing [Vega](https://vega.github.io/vega/) and [Vega-Lite](https://vega.github.io/vega-lite/) specifications and producing optimized module bundles.

Both and Vega and Vega-Lite have their own parser and compiler. A Vega-Lite specification compiles to a full Vega specification, which in turn is parsed to an intermediate dataflow specification that serves as input to a Vega View (for more, see [How Vega Works](https://observablehq.com/@vega/how-vega-works)). In addition, Vega provides a number of data and visual encoding transforms, but not all of them may be needed within a given a deployment.

To reduce both file size and loading time, this package pre-parses input specifications and generates optimized code bundles that omit the parsers and include only the underlying transforms that are actually used. This can result in substantial savings, especially when using Vega-Lite.

## API Reference

<a name="bundle" href="#bundle">#</a>
<b>bundle</b>(<i>specs</i>[, <i>options</i>])
[<>](https://github.com/vega/vega-bundler/blob/master/src/index.js "Source")

Returns bundled source code for browser use. For each named specification in _specs_, exports a method with the same name that creates a [Vega View](https://vega.github.io/vega/docs/api/view/) for that specification. The exported methods take a [Vega View constructor options](https://vega.github.io/vega/docs/api/view/#view) object as input.

* _specs_: An object of key-value pairs where the key is a unique name (must be a valid JavaScript identifier) and the value is a Vega or Vega-Lite specification object. The specifications should include the `$schema` property indicating the Vega or Vega-Lite schema.
* _options_: An object containing build options passed to the rollup bundler:
  * _transpile_: A boolean flag (default `true`) indicating if the Vega code should be transpiled (using [Babel](https://babeljs.io/)) for greater browser compatibility.
  * _targets_: A string indicating the Babel transpilation target platforms (default `'defaults and not IE 11'`). This option is ignored if the *babel* option is `false`.
  * _name_: The name of the output bundle (default `'vegaBundle'`). This corresponds to the global variable name for the compiled bundle when loaded directly via the browser `<script>` tag.
  * _format_: The output format for the bundle (default `'umd'`). Valid options are `'umd'` (universal module definition), `'iife'` (immediately-invoked function expression), and `es` (EcmaScript module).
  * _minify_: A boolean flag (default `true`) indicating if output code should be minified using [terser](https://github.com/terser/terser).

<a name="bundler" href="#bundler">#</a>
<b>bundler</b>()
[<>](https://github.com/vega/vega-bundler/blob/master/src/bundler.js "Source")

Create a new bundler instance for generating custom builds. The [bundle](#bundle) method is a convenient shorthand for using bundler methods. Developers can use a bundler directly to exert more control over the bundling process, including generation of module index code that might then be used in other projects and passed to bundlers other than rollup.

A bundler instance includes the following methods:

<a name="bundler_add" href="#bundler_add">#</a>
bundler.<b>add</b>(<i>name</i>, <i>spec</i>)
[<>](https://github.com/vega/vega-bundler/blob/master/src/bundler.js "Source")

Adds a Vega or Vega-Lite specification to the bundle along with a unique *name*, and returns this bundler instance. This method is a convenience method that redirects to either [addVegaSpec](#bundler_addVegaSpec) or [addVegaLiteSpec](#bundler_addVegaLiteSpec). The type of the file will be determined by consulting the `$schema` property of the input *spec* object.  If the `$schema` property is not defined or the Vega language variant can not be determined, the input *spec* is parsed as a Vega specification.

<a name="bundler_addVegaSpec" href="#bundler_addVegaSpec">#</a>
bundler.<b>addVegaSpec</b>(<i>name</i>, <i>spec</i>)
[<>](https://github.com/vega/vega-bundler/blob/master/src/bundler.js "Source")

Adds a Vega specification to the bundle along with a unique *name*, and returns this bundler instance. The input *spec* must be a valid Vega JSON specification.

<a name="bundler_addVegaLiteSpec" href="#bundler_addVegaLiteSpec">#</a>
bundler.<b>addVegaLiteSpec</b>(<i>name</i>, <i>spec</i>)
[<>](https://github.com/vega/vega-bundler/blob/master/src/bundler.js "Source")

Adds a Vega-Lite specification to the bundle along with a unique *name*, and returns this bundler instance. The input *spec* must be a valid Vega-Lite JSON specification.

<a name="bundler_addDataflowSpec" href="#bundler_addDataflowSpec">#</a>
bundler.<b>addDataflowSpec</b>(<i>name</i>, <i>spec</i>)
[<>](https://github.com/vega/vega-bundler/blob/master/src/bundler.js "Source")

Adds a parsed Vega dataflow specification to the bundle along with a unique *name*, and returns this bundler instance. The input *spec* should be a valid Vega dataflow specification, such as those produced by [vega.parse](https://vega.github.io/vega/docs/api/parser/#parse).

<a name="bundler_codegen" href="#bundler_codegen">#</a>
bundler.<b>codegen</b>()
[<>](https://github.com/vega/vega-bundler/blob/master/src/bundler.js "Source")

Returns generated JavaScript module index code for the current bundle, using [ES module syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). The generated code will import only the Vega transforms needed for the current set of specifications, and will export [View](https://vega.github.io/vega/docs/api/view/) constructor functions for each of the named specifications.

For example, a specification named `'barChart'` will result in an exported method `barChart(options) { ... }` that takes [Vega View constructor options](https://vega.github.io/vega/docs/api/view/#view) as input and returns an instantiated View instance.

<a name="bundler_build" href="#bundler_build">#</a>
bundler.<b>build</b>(options)
[<>](https://github.com/vega/vega-bundler/blob/master/src/bundler.js "Source")

Compiles a bundle using [rollup](https://rollupjs.org/) and returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to the resulting JavaScript code. This method accepts the same *options* as [bundle](#bundle).

## Command Line Utility

`vega_bundle [-o output_file] specification_list`
