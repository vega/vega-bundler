import { findPackage } from './package';
import { build } from './build';
import { parse, parseVega, parseVegaLite } from './parse';

const hasOwn = Object.prototype.hasOwnProperty;
const has = (obj, prop) => hasOwn.call(obj, prop);

const RESERVED = {
  operator: 1
};

export function bundler() {
  const specs = {};
  const pkgs = {};

  return {
    /**
     * Add a Vega dataflow specification to the bundle.
     * @param {string} name A unique name for the input specification.
     * @param {object} spec The parsed Vega dataflow specification.
     */
    addDataflowSpec(name, spec) {
      specs[name] = spec;
      analyze(spec, pkgs);
      return this;
    },

    /**
     * Add a Vega or Vega-Lite specification to the bundle.
     * The type of the file will be determined by consulting the
     * $schema property of the input spec object. If that property
     * is not defined this method parse as a Vega specification.
     * @param {string} name A unique name for the input specification.
     * @param {object} spec The unparsed Vega or Vega-Lite specification.
     */
    add(name, spec) {
      return this.addDataflowSpec(name, parse(spec));
    },

    /**
     * Add a Vega specification to the bundle.
     * @param {string} name A unique name for the input specification.
     * @param {object} spec The unparsed Vega specification.
     */
    addVegaSpec(name, spec) {
      return this.addDataflowSpec(name, parseVega(spec));
    },

    /**
     * Add a Vega-Lite specification to the bundle.
     * @param {string} name A unique name for the input specification.
     * @param {object} spec The unparsed Vega-Lite specification.
     */
    addVegaLiteSpec(name, spec) {
      return this.addDataflowSpec(name, parseVegaLite(spec));
    },

    /**
     * Generate module index code for the bundle.
     * @return {string} JavaScript code for the bundle index.
     */
    codegen() {
      return codegen(specs, pkgs);
    },

    /**
     * Compile the bundle to minified JavaScript code.
     * @param {object} [options] Build options passed to rollup.
     * @return {Promise<string>} A Promise to the compiled code.
     */
    build(options) {
      return build(codegen(specs, pkgs), options);
    }
  };
}

/**
 * Analyze a specification to record what transforms are needed.
 * @param {object} spec A Vega dataflow specification.
 * @param {object} pkgs Package name to transform name map.
 */
function analyze(spec, pkgs) {
  if (!spec) return;
  const ops = spec.operators || [];
  ops.forEach(op => {
    uses(op.type, pkgs);
    if (op.params && op.params.subflow) {
      analyze(op.params.subflow.$subflow, pkgs);
    }
  });
}

/**
 * Record that this bundle requires a transform.
 * @param {string} transform The transform name.
 * @param {object} pkgs Package name to transform name map.
 */
function uses(transform, pkgs) {
  if (has(RESERVED, transform)) return;
  const pkg = findPackage(transform);

  if (pkg) {
    const mod = pkgs[pkg] || (pkgs[pkg] = {});
    mod[transform] = 1;
  } else {
    throw `Unrecognized transform: ${transform}`;
  }
}

/**
 * Generate a JavaScript module index file for a bundle.
 * @param {object} specs Name to specification map.
 * @param {object} pkgs Package name to transform name map.
 * @return {string} JavaScript code for the bundle index.
 */
function codegen(specs, pkgs) {
  let code = '';
  code += 'import { View } from "vega-view";\n';

  code += 'import { transforms } from "vega-dataflow";\n';
  for (const name in pkgs) {
    const transforms = Object.keys(pkgs[name]).join(', ');
    code += `import { ${transforms} } from "${name}";\n`;
  }
  code += '\n';
  code += 'Object.assign(transforms, {\n';
  for (const name in pkgs) {
    Object.keys(pkgs[name])
      .forEach(tx => code += `  ${tx},\n`);
  }
  code += '});\n';

  for (const name in specs) {
    code += '\n';
    code += `export function ${name}(opt) {\n`;
    code += `  return new View(spec_${name}, opt);\n`;
    code += `}\n`;
  }

  for (const name in specs) {
    code += '\n';
    const spec = JSON.stringify(specs[name]);
    code += `const spec_${name} = ${spec};\n`;
  }

  return code;
}
