import { findPackage } from './package';

const hasOwn = Object.prototype.hasOwnProperty;
const has = (obj, prop) => hasOwn.call(obj, prop);

const SKIP = {
  operator: 1
};

/**
 * Analyze a specification to record what transforms are needed.
 * @param {object} spec A Vega dataflow specification.
 * @param {object} pkgs Package name to transform name map.
 */
 export function analyze(spec, pkgs) {
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
  if (has(SKIP, transform)) return;
  const pkg = findPackage(transform);

  if (pkg) {
    const mod = pkgs[pkg] || (pkgs[pkg] = {});
    mod[transform] = 1;
  } else {
    throw `Unrecognized transform: ${transform}`;
  }
}
