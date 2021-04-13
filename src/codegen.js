/**
 * Generate a JavaScript module index file for a bundle.
 * If runtime dataflow specs are provided, an instantiation
 * method for each is exported. If not, only the Vega View
 * constructor is exported.
 * @param {object} pkgs Package name to transform name map.
 * @param {object} [specs] Name to specification map.
 * @return {string} JavaScript code for the bundle index.
 */
 export function codegen(pkgs, specs) {
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

  code += '\nexport { View } from "vega-view";\n';

  if (specs) {
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
  }

  return code;
}
