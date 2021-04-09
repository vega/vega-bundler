import { bundler } from './bundler';
export { bundler } from './bundler';

export function bundle(specs, options) {
  const b = bundler();
  for (const name in specs) {
    b.add(name, specs[name]);
  }
  return b.build(options);
}
