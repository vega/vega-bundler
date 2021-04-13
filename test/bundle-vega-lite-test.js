const tape = require('tape');
const { bundle } = require('../build/vega-bundler');

const specs = [
  {
    name: 'bar',
    spec: require('./specs/bar.vl.json'),
    size: 320749
  },
  {
    name: 'hist2d',
    spec: require('./specs/hist-2d.vl.json'),
    size: 328135
  },
  {
    name: 'index',
    spec: require('./specs/index-chart.vl.json'),
    size: 353396
  },
  {
    name: 'seattle',
    spec: require('./specs/seattle-weather.vl.json'),
    size: 382609
  },
];

tape('Bundle Vega-Lite test specifications', async t => {
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
    485068,
    'combined bundle size matches expectation'
  );

  t.end();
});