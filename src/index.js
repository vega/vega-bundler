import { Bundle } from './bundle';
export { Bundle } from './bundle';

/**
 * Returns bundled source code for browser use for a set of provided
 * Vega and/or Vega-Lite specifications.
 * @param {object} specs An object with specification names for
 *  keys and Vega or Vega-Lite specification as values. Vega-Lite
 *  specifications must have a proper `$schema` property defined.
 * @param {import('./bundle').BuildOptions} options Code generation
 *  and build options.
 * @return {Promise<string>} A Promise to the compiled code.
 */
export function bundle(specs, options) {
  const b = new Bundle();
  for (const name in specs) {
    b.add(name, specs[name]);
  }
  return b.build(options);
}
