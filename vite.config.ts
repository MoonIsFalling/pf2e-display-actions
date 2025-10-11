import * as fsPromises from 'fs/promises';
import {defineConfig, Plugin} from 'vite';
import {resolve as pathResolve} from 'path';

// const path = require('path');

const moduleVersion = process.env.MODULE_VERSION;
const githubProject = 'MoonIsFalling/pf2e-display-actions';
const projectName = 'pf2e-display-actions';
// const githubTag = process.env.GH_TAG;

console.log(process.env.VSCODE_INJECTION);

const config = defineConfig({
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
  resolve: {
    alias: [
      {
        find: './runtimeConfig',
        replacement: './runtimeConfig.browser',
      },
    ],
  },
  build: {
    sourcemap: true,
    lib: {
      name: projectName,
      entry: pathResolve(__dirname, 'src/ts/module.ts'),
      formats: ['es'],
    },
    // rollupOptions: {
    //   input: {
    //     index: pathResolve(__dirname, 'src/ts/module.ts'),
    //   },
    //   treeshake: true,
    //   preserveEntrySignatures: 'strict',
    //   // output: {
    //   //   entryFileNames: 'main.ts',
    //   //   format: 'es',
    //   // },
    // },
  },
  plugins: [updateModuleManifestPlugin()],
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

export default config;
