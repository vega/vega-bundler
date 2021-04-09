const tape = require('tape');
const { bundle } = require('../build/vega-bundler');

const specs = [
  { name: 'arc',    spec: require('./specs/arc.vg.json'),    size: 303831 },
  { name: 'bar',    spec: require('./specs/bar.vg.json'),    size: 313632 },
  { name: 'violin', spec: require('./specs/violin.vg.json'), size: 319563 },
];

tape('Bundle Vega test specifications', async t => {
  const bundles = await Promise.all(
    specs.map(({ name, spec }) => bundle({ [name]: spec }))
  );
  t.deepEqual(
    bundles.map(b => b.length),
    specs.map(s => s.size),
    'bundle sizes match expectations'
  );
  t.end();
});
