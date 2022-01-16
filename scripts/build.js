const path = require('path')
const fs = require('fs')
const { build } = require('esbuild')

const ROOT = path.resolve(__dirname, '..')
const packageJSON = JSON.parse(fs.readFileSync(path.resolve(ROOT, process.cwd(), 'package.json'), 'utf8'))

const config = {
  entryPoints: ['src/index.tsx'],
  outdir: path.resolve(ROOT, './build/static/js'),
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx'
  },
  bundle: true,
  minify: true,
  sourcemap: true,
  external: [
    ...Object.keys(packageJSON.peerDependencies ?? {}),
    ...Object.keys(packageJSON.peerDependenciesMeta ?? {}),
  ],
}

Promise.all([
  build({
    ...config,
    format: 'esm',
    outdir: 'dist',
  }),
]).then(() => {
  fs.copyFile(path.resolve(ROOT, './public/index.html'), path.resolve(ROOT, './dist/index.html'), (err) => {
    if (err) return console.error(err);
      console.log("success!");
      return null;
    }
  );
}).catch(() => process.exit(1))
