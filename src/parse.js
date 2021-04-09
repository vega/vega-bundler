import { compile as compileVL } from 'vega-lite';
import { parse as parseVG } from 'vega';

export function parse(spec) {
  const schema = spec.$schema || '';
  return schema.includes('vega-lite')
    ? parseVegaLite(spec)
    : parseVega(spec);
}

export function parseVega(spec) {
  return parseVG(spec);
}

export function parseVegaLite(spec) {
  // TODO: pass in config?
  return parseVega(compileVL(spec).spec);
}