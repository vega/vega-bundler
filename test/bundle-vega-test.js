const tape = require('tape');
const { bundle } = require('../build/vega-bundler');

const specs = [
  {
    name: 'arc',
    spec: require('./specs/arc.vg.json'),
    size: 303841
  },
  {
    name: 'bar',
    spec: require('./specs/bar.vg.json'),
    size: 313642
  },
  {
    name: 'violin',
    spec: require('./specs/violin.vg.json'),
    size: 319573
  },
];

tape('Bundle Vega test specifications', async t => {
  const bundles = await Promise.all(
    specs.map(({ name, spec }) => bundle({ [name]: spec }))
  );
  t.deepEqual(
    bundles.map(b => b.length),
    specs.map(s => s.size),
    'individual bundle sizes match expectations'
  );

  const combined = specs.reduce(
    (obj, entry) => (obj[entry.name] = entry.spec, obj),
    {}
  );
  bundled = await bundle(combined);
  t.equal(
    bundled.length,
    337370,
    'combined bundle size matches expectation'
  );

  t.end();
});
