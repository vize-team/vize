import * as path from 'path';
import * as fs from 'fs-extra';
import { DSL, WorkspacePaths } from '@vize/types';
import { GeneratorPaths } from '../types';

export async function prepareFiles(dsl: DSL, workspacePaths: WorkspacePaths): Promise<GeneratorPaths> {
  const {
    pageKey,
    container: { name, lib },
  } = dsl;

  const paths = await prepareTargetFolder(workspacePaths.buildPath, pageKey);

  const { containerPath, srcPath } = paths;
  const materialsContainerPath = path.resolve(workspacePaths.materialsPath, `./${lib}/src/containers/${name}`);
  await copyContainerTemplate(materialsContainerPath, containerPath);
  const libsPath = await createDepsSoftLink(workspacePaths.materialsPath, srcPath);

  return {
    libsPath,
    ...paths,
  };
}

async function prepareTargetFolder(buildPath: string, pageKey: string): Promise<Omit<GeneratorPaths, 'libsPath'>> {
  if (!fs.existsSync(buildPath)) {
    await fs.mkdir(buildPath);
  }

  const pagePath = path.resolve(buildPath, pageKey);
  if (fs.existsSync(pagePath)) {
    await Promise.all(
      fs
        .readdirSync(pagePath)
        .filter(i => !/preview/.test(i))
        .map(i => fs.rmdirSync(path.resolve(pagePath, i), { recursive: true })),
    );
  }
  await fs.mkdirp(pagePath);

  const [srcPath, distPath, previewPath] = await Promise.all(
    ['src', 'dist', 'preview'].map(async i => {
      const target = path.resolve(pagePath, i);
      await fs.mkdirp(target);
      return target;
    }),
  );

  const [containerPath, globalPath, pagesPath] = await Promise.all(
    ['container', 'global', 'pages'].map(async i => {
      const p = path.resolve(srcPath, i);
      await fs.mkdirp(p);
      return p;
    }),
  );

  return {
    pagePath,
    srcPath,
    distPath,
    previewPath,
    containerPath,
    globalPath,
    pagesPath,
  };
}

const copyIgnoreFiles = ['config.ts', 'config.js', 'config.json'];

async function copyContainerTemplate(containerPath: string, targetPath: string) {
  const files = await fs.readdir(containerPath);
  await Promise.all(
    files.map(fileName => {
      if (copyIgnoreFiles.includes(fileName)) {
        return Promise.resolve();
      }
      const fromFilePath = path.resolve(containerPath, fileName);
      const targetFilePath = path.resolve(targetPath, fileName);
      console.log(`Copying ${fromFilePath}  to ${targetFilePath}`);
      return fs.copy(fromFilePath, targetFilePath);
    }),
  );
}

async function createDepsSoftLink(materialsPath: string, targetPath: string) {
  const libsPath = path.resolve(targetPath, './libs');
  await fs.symlink(materialsPath, libsPath);
  return libsPath;
}
