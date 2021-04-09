const hasOwn = Object.prototype.hasOwnProperty;
const has = (obj, prop) => hasOwn.call(obj, prop);

const modules = {};
[
  'vega-crossfilter',
  'vega-encode',
  'vega-force',
  'vega-geo',
  'vega-hierarchy',
  'vega-label',
  'vega-regression',
  'vega-transforms',
  'vega-view-transforms',
  'vega-voronoi',
  'vega-wordcloud'
].forEach(name => modules[name] = require(name));

export function findPackage(transformName) {
  for (const name in modules) {
    const mod = modules[name];
    if (has(mod, transformName)) {
      return name;
    }
  }
}