import * as fsPromises from 'fs/promises';
import copy from 'rollup-plugin-copy';
import scss from 'rollup-plugin-scss';
import {defineConfig, Plugin} from 'vite';
const path = require('path');

const moduleVersion = process.env.MODULE_VERSION;
const githubProject = 'MoonIsFalling/pf2e-display-actions';
const projectName = 'pf2e-display-actions';
// const githubTag = process.env.GH_TAG;

console.log(process.env.VSCODE_INJECTION);

export default defineConfig({
  root: 'src/',
  base: `/modules/${projectName}/`,
  publicDir: path.resolve(__dirname, 'public'),
  server: {
    port: 30001,
    open: true,
    proxy: {
      '^(?!/modules/pf2e-display-actions)': 'http://localhost:30000/',
      '/socket.io': {
        target: 'ws://localhost:30000',
        ws: true,
      },
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    sourcemap: true,
    emptyOutDir: true,
    lib: {
      name: projectName,
      entry: path.resolve(__dirname, 'src/ts/module.ts'),
      formats: ['es'],
      fileName: 'scripts/module',
    },
    rollupOptions: {
      input: '/ts/module.ts',
      output: {
        dir: undefined,
        file: 'dist/scripts/module.js',
        format: 'es',
      },
    },
  },
  plugins: [
    updateModuleManifestPlugin(),
    scss({
      output: 'dist/style.css',
      sourceMap: true,
      watch: ['src/styles/*.scss'],
    }),
    copy({
      targets: [
        {src: 'src/languages', dest: 'dist'},
        {src: 'src/templates', dest: 'dist'},
        {src: 'src/images', dest: 'dist'},
      ],
      hook: 'writeBundle',
    }),
  ],
});

function updateModuleManifestPlugin(): Plugin {
  return {
    name: 'update-module-manifest',
    async writeBundle(): Promise<void> {
      const packageContents = JSON.parse(await fsPromises.readFile('./package.json', 'utf-8')) as Record<
        string,
        unknown
      >;
      const version = moduleVersion || (packageContents.version as string);
      const manifestContents: string = await fsPromises.readFile('src/module.json', 'utf-8');
      const manifestJson = JSON.parse(manifestContents) as Record<string, unknown>;
      manifestJson['version'] = version;
      if (githubProject) {
        const baseUrl = `https://github.com/${githubProject}/releases`;
        manifestJson['manifest'] = `${baseUrl}/download/${version}/module.json`;
        if (version) {
          manifestJson['download'] = `${baseUrl}/download/${version}/module.zip`;
        }
      }
      await fsPromises.writeFile('dist/module.json', JSON.stringify(manifestJson, null, 4));
    },
  };
}
