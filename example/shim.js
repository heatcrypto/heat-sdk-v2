// process-shim.js
export let process = {
  cwd: () => '',
  env: () => {}
}

export let global = {}

export let Buffer = require('buffer/').Buffer

// To prevent 
// TypeError: TypedArray.of requires its this argument to subclass a TypedArray constructor
// Caused by node_modules/bitcoinjs-lib/src/taproot.js
Buffer.of = (...items) => Buffer.from(items);