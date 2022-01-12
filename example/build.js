(async () => {
  const fs = require('fs-extra')
  await fs.ensureDir('dist')
  await fs.emptyDir('dist')

  await require('esbuild').build({
    entryPoints: ['src/index.js'],
    platform: 'browser',
    bundle: true,
    outfile: 'dist/index.js',
    target: 'es6',
    inject: ['shim.js'],
    // minify settings
    minify: true,    
    treeShaking: true,
    keepNames: true,
    // sourcemap: 'external',
  }).catch(() => process.exit(1))

  const stats = await fs.stat('dist/index.js')
  console.log(`"dist/index.js" bundle size is ${formatBytes(stats.size)}`)
})()

function formatBytes(bytes, decimals = 4) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}