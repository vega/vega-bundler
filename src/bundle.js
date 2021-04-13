import { analyze } from './analyze';
import { build } from './build';
import { codegen } from './codegen';
import { parse, parseVega, parseVegaLite } from './parse';

export class Bundle {
  /**
   * Create a new Bundle instance.
   */
  constructor() {
    this.specs = {};
    this.pkgs = {};
  }

  /**
   * Add a Vega runtime dataflow specification to the bundle.
   * @param {string} name A unique name for the input specification.
   * @param {object} spec The Vega runtime dataflow specification.
   * @return {this} This bundler instance.
   */
  addDataflowSpec(name, spec) {
    this.specs[name] = spec;
    analyze(spec, this.pkgs);
    return this;
  }

  /**
   * Get a named Vega dataflow specification in this bundle.
   * This method can be used to retrieve a runtime dataflow
   * specification for an added Vega or Vega-Lite specification.
   * @param {string} name The name of the input specification.
   * @return {object} The Vega dataflow specification or undefined.
   */
   getDataflowSpec(name) {
    return this.specs[name];
  }

  /**
   * Get all Vega runtime dataflow specifications in this bundle.
   * @return {object} An object with specification names for keys
   *  and Vega runtime dataflow specification as values.
   */
   getDataflowSpecs() {
    return { ...this.specs };
  }

  /**
   * Add a Vega or Vega-Lite specification to the bundle.
   * The type of the file will be determined by consulting the
   * $schema property of the input spec object. If that property
   * is not defined this method parse as a Vega specification.
   * @param {string} name A unique name for the input specification.
   * @param {object} spec The unparsed Vega or Vega-Lite specification.
   * @return {this} This bundler instance.
   */
  add(name, spec) {
    return this.addDataflowSpec(name, parse(spec));
  }

  /**
   * Add a Vega specification to the bundle.
   * @param {string} name A unique name for the input specification.
   * @param {object} spec The unparsed Vega specification.
   * @return {this} This bundler instance.
   */
  addVegaSpec(name, spec) {
    return this.addDataflowSpec(name, parseVega(spec));
  }

  /**
   * Add a Vega-Lite specification to the bundle.
   * @param {string} name A unique name for the input specification.
   * @param {object} spec The unparsed Vega-Lite specification.
   * @return {this} This bundler instance.
   */
  addVegaLiteSpec(name, spec) {
    return this.addDataflowSpec(name, parseVegaLite(spec));
  }

  /**
   * Generate module index code for the bundle. By default all runtime
   * dataflow specs are included in the bundle, along with instantiation
   * methods for each. Use the `specs: false` option to exlude the specs
   * and export the Vega View constructor only, to which case clients must
   * then pass their own runtime dataflow specs.
   * @param {CodegenOptions} [options] Code generation options.
   * @return {string} JavaScript code for the bundle index.
   */
  codegen(options = {}) {
    const specs = options.specs === false ? null : this.specs;
    return codegen(this.pkgs, specs);
  }

  /**
   * Compile the bundle to minified JavaScript code.
   * @param {BuildOptions} [options] Code generation and build options.
   * @return {Promise<string>} A Promise to the compiled code.
   */
  build(options) {
    return build(this.codegen(options), options);
  }
}

/**
 * Options for bundle code generation.
 * @typedef {object} CodegenOptions
 * @property {boolean} [specs=true] A flag indicating if runtime
 *  dataflow specifications should be included in the bundle.
 *  If `false`, all specifications are excluded from the generated
 *  output code, in which case clients must directly pass runtime
 *  dataflow specifications to the exported View constructor.
 */

/**
 * Options for bundle build compilation.
 * @typedef {object} BuildOptions
 * @property {boolean} [specs=true] A flag indicating if runtime
 *  dataflow specifications should be included in the bundle.
 *  If `false`, all specifications are excluded from the generated
 *  output code, in which case clients must directly pass runtime
 *  dataflow specifications to the exported View constructor.
 * @property {boolean} [transpile=true] A flag indicating if the
 *  Vega code should be transpiled (using [Babel](https://babeljs.io/))
 *  for greater browser compatibility.
 * @property {string} [targets='defaults and not IE 11'] A string
 *  indicating the Babel transpilation target platforms. This option is
 *  ignored if the *babel* option is `false`.
 * @property {string} [name='vegaBundle'] The name of the output bundle.
 *  This corresponds to the global variable name for the compiled bundle
 *  when loaded directly via the browser `<script>` tag.
 * @property {string} [format='umd'] The output format for the bundle.
 *  Valid options are `'umd'` (universal module definition),
 *  `'iife'` (immediately-invoked function expression), and
 *  `'es'` (EcmaScript module).
 * @property {boolean} [minify=true] A flag indicating if output code
 *  should be minified using [terser](https://github.com/terser/terser).
 */
