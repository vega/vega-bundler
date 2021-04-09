#!/usr/bin/env node
const { readFileSync, writeFile } = require('fs');
const { bundle } = require('../build/vega-bundler');

function args() {
  const helpText = `Parse one or more Vega(-Lite) specifications into an optimized bundle.
Usage: bundle_vega -o output_file spec_files
  If output option is unspecified, writes generated code to stdout.
  For errors and log messages, writes to stderr.`;

  const args = require('yargs')
    .usage(helpText)
    .demand(0);

  // TODO specify -o output file
  args.string('o')
    .alias('o', 'output')
    .describe('o', 'Output file to write bundled code.');

  return args.help().version().argv;
};

async function run(args) {
  // for each input file, add to bundle
  const specs = {};
  args._.forEach((file, i) => {
    specs['spec' + i] = JSON.parse(readFileSync(file));
  });

  // parse and bundle Vega(-Lite) specifications
  const code = await bundle(specs);

  // write to file or standard output
  args.o
    ? writeFile(args.o, code, err => { if (err) throw err; })
    : process.stdout.write(code);
}

// parse command line arguments and run bundler
run(args());
