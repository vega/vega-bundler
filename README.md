# vega-bundler

Utilities for pre-parsing [Vega](https://vega.github.io/vega/) and [Vega-Lite](https://vega.github.io/vega-lite/) specifications and producing optimized module bundles.

Both and Vega and Vega-Lite have their own parser and compiler. A Vega-Lite specification compiles to a full Vega specification, which in turn is parsed to an intermediate dataflow specification that serves as input to a Vega View (for more, see [How Vega Works](https://observablehq.com/@vega/how-vega-works)). In addition, Vega provides a number of data and visual encoding transforms, but not all of them may be needed within a given a deployment.

To reduce both file size and loading time, this package pre-parses input specifications and generates optimized code bundles that omit the parsers and include only the underlying transforms that are actually used. This can result in substantial savings, especially when using Vega-Lite.

## API Reference

<a name="bundle" href="#bundle">#</a>
<b>bundle</b>(<i>specs</i>[, <i>options</i>])
[<>](https://github.com/vega/vega-bundler/blob/master/src/index.js "Source")

Returns bundled source code for browser use. The source code includes the [Vega View](https://vega.github.io/vega/docs/api/view/) constructor as an exported method.

By default the bundle also exports a method for each named specification in _specs_. The exported methods take [Vega View constructor options](https://vega.github.io/vega/docs/api/view/#view) as input and return an instantiated View. Set the *specs* to `false` to disable inclusion of runtime specifications in the output bundle.

* _specs_: An object of key-value pairs where the key is a unique name (must be a valid JavaScript identifier) and the value is a Vega or Vega-Lite specification object. The specifications should include the `$schema` property indicating the Vega or Vega-Lite schema.
* _options_: An object containing build options passed to the rollup bundler:
  * _specs_: A boolean flag (default `true`) indicating if parsed runtime dataflow specifications should be included in the bundle. If `false`, all specifications are excluded from the generated output code, in which case clients must directly pass runtime dataflow specifications to the exported View constructor.
  * _transpile_: A boolean flag (default `true`) indicating if the Vega code should be transpiled (using [Babel](https://babeljs.io/)) for greater browser compatibility.
  * _targets_: A string indicating the Babel transpilation target platforms (default `'defaults and not IE 11'`). This option is ignored if the *babel* option is `false`.
  * _name_: The name of the output bundle (default `'vegaBundle'`). This corresponds to the global variable name for the compiled bundle when loaded directly via the browser `<script>` tag.
  * _format_: The output format for the bundle (default `'umd'`). Valid options are `'umd'` (universal module definition), `'iife'` (immediately-invoked function expression), and `es` (EcmaScript module).
  * _minify_: A boolean flag (default `true`) indicating if output code should be minified using [terser](https://github.com/terser/terser).

<a name="Bundle_constructor" href="#Bundle_constructor">#</a>
<b>Bundle</b>()
[<>](https://github.com/vega/vega-bundler/blob/master/src/bundle.js "Source")

A [class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) for generating custom builds. The [bundle](#bundle) method is a convenient shorthand that calls Bundle class methods. Developers can use a Bundle directly to exert more control over the bundling process, including generation of module index code that can then be used in other projects and passed to bundlers other than rollup.

An instantiated Bundle includes the following methods:

<a name="Bundle_add" href="#Bundle_add">#</a>
Bundle.<b>add</b>(<i>name</i>, <i>spec</i>)
[<>](https://github.com/vega/vega-bundler/blob/master/src/bundle.js "Source")

Adds a Vega or Vega-Lite specification to the bundle along with a unique *name*, and returns this Bundle instance. This method is a convenience method that redirects to either [addVegaSpec](#bundler_addVegaSpec) or [addVegaLiteSpec](#bundler_addVegaLiteSpec). The type of the file will be determined by consulting the `$schema` property of the input *spec* object.  If the `$schema` property is not defined or the Vega language variant can not be determined, the input *spec* is parsed as a Vega specification.

<a name="Bundle_addVegaSpec" href="#Bundle_addVegaSpec">#</a>
Bundle.<b>addVegaSpec</b>(<i>name</i>, <i>spec</i>)
[<>](https://github.com/vega/vega-bundler/blob/master/src/bundle.js "Source")

Adds a Vega specification to the bundle along with a unique *name*, and returns this Bundle instance. The input *spec* must be a valid Vega JSON specification.

<a name="Bundle_addVegaLiteSpec" href="#Bundle_addVegaLiteSpec">#</a>
Bundle.<b>addVegaLiteSpec</b>(<i>name</i>, <i>spec</i>)
[<>](https://github.com/vega/vega-bundler/blob/master/src/bundle.js "Source")

Adds a Vega-Lite specification to the bundle along with a unique *name*, and returns this Bundle instance. The input *spec* must be a valid Vega-Lite JSON specification.

<a name="Bundle_addDataflowSpec" href="#Bundle_addDataflowSpec">#</a>
Bundle.<b>addDataflowSpec</b>(<i>name</i>, <i>spec</i>)
[<>](https://github.com/vega/vega-bundler/blob/master/src/bundle.js "Source")

Adds a parsed Vega dataflow specification to the bundle along with a unique *name*, and returns this bundler instance. The input *spec* should be a valid Vega dataflow specification, such as those produced by [vega.parse](https://vega.github.io/vega/docs/api/parser/#parse).

<a name="Bundle_getDataflowSpec" href="#Bundle_getDataflowSpec">#</a>
Bundle.<b>getDataflowSpec</b>(<i>name</i>)
[<>](https://github.com/vega/vega-bundler/blob/master/src/bundle.js "Source")

Get a named Vega dataflow specification in this bundle. This method retrieves a runtime dataflow specification for an added Vega or Vega-Lite specification.

<a name="Bundle_getDataflowSpecs" href="#Bundle_getDataflowSpecs">#</a>
Bundle.<b>getDataflowSpecs</b>()
[<>](https://github.com/vega/vega-bundler/blob/master/src/bundle.js "Source")

Get all Vega runtime dataflow specifications in this bundle. Returns an object with specification names for keys and Vega runtime dataflow specification as values.

<a name="Bundle_codegen" href="#Bundle_codegen">#</a>
Bundle.<b>codegen</b>()
[<>](https://github.com/vega/vega-bundler/blob/master/src/bundle.js "Source")

Returns generated JavaScript module index code for the current bundle, using [ES module syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). The generated code will import only the Vega transforms needed for the current set of specifications, and will export [View](https://vega.github.io/vega/docs/api/view/) constructor functions for each of the named specifications.

For example, a specification named `'barChart'` will result in an exported method `barChart(options) { ... }` that takes [Vega View constructor options](https://vega.github.io/vega/docs/api/view/#view) as input and returns an instantiated View instance.

<a name="Bundle_build" href="#Bundle_build">#</a>
Bundle.<b>build</b>(options)
[<>](https://github.com/vega/vega-bundler/blob/master/src/bundle.js "Source")

Compiles a bundle using [rollup](https://rollupjs.org/) and returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to the resulting JavaScript code. This method accepts the same *options* as [bundle](#bundle).

## Command Line Utility

The `vega_bundler` command line utility generates optimized code bundles for input Vega or Vega-Lite specification files.

### Usage

```
vega_bundler --help
Compile Vega or Vega-Lite specifications into an optimized bundle.
Usage: vega_bundler [options] spec_files
  If the "output" option is unspecified, writes generated code to stdout.
  For errors and log messages, writes to stderr.

Options:
  -o, --output     Output file to write bundled code. If omitted, writes to
                   standard output.                                     [string]
  -m, --manifest   JSON file mapping specification names to files. If omitted,
                   spec1, spec2, ...specN naming is used. If provided, the
                   spec_files input is ignored.                         [string]
      --include    Include Vega runtime dataflow specifications in the bundle.
                   If false, the dataflow specifications are omitted from the
                   bundle and written to individual files.
                                                       [boolean] [default: true]
      --minify     Minify output code using terser.    [boolean] [default: true]
      --format     The output bundle format. One of "umd" (default, universal
                   module definition), "iife" (immediately-invoked function
                   expression), or "es" (EcmaScript module).            [string]
      --name       The output bundle name. This is the global variable name for
                   the bundle when loaded via the <script> tag.         [string]
      --transpile  Transpile code using Babel.         [boolean] [default: true]
      --targets    Transpilation target platforms. Ignored if transpile is
                   false.                                               [string]
      --help       Show help                                           [boolean]
      --version    Show version number                                 [boolean]
```

### Examples

`vega_bundler -o bundle.min.js arc.vg.json bar.vg.json`

Compiles the provided specifications into an optimized bundle.
The bundle includes the methods `spec1(opt)` a `spec2(opt)` for instantiating View instances.

`vega_bundler -m specs.json -o bundle.min.js`

Compiles the specifications included in the manifest file `specs.json` into an optimized bundle. For example, the manifest file

```json
{
  "arc": "specs/arc.vg.json",
  "bar": "specs/bar.vg.json"
}
```

will result in an optimized bundle with the methods `arc(opt)` and `bar(opt)` for instantiating View instances.

`vega_bundler --no-includes -m specs.json -o bundle.min.js`

Compiles an optimized bundle that exports the Vega View constructor but does not include parsed runtime dataflow specifications. Instead, the dataflow specifications are written to the separate files `arc.json` and `bar.json`, which can be loaded separately and passed to the View constructor.
