import * as path from 'path';
import * as fs from 'fs-extra';
import { DSL, PageMode, WorkspacePaths } from '@vize/types';
import { GeneratorPaths } from '../types';
import { getTpl } from '../template';
import { stringify } from './utils';

export async function generateEntryFile(dsl: DSL, workspacePaths: WorkspacePaths, { srcPath }: GeneratorPaths) {
  const tpl = await getTpl('entry');

  if (dsl.editInfo.pageMode === PageMode.SINGLE) {
    const params = generateEntryTplParams(dsl);
    const result = tpl(params);
    const target = path.resolve(srcPath, 'index.tsx');
    await fs.writeFile(target, result, { encoding: 'utf-8' });
    return [target];
  }

  return Promise.all(
    dsl.pageInstances.map(async ({ key }, index) => {
      const params = generateEntryTplParams(dsl, index);
      const result = tpl(params);
      const target = path.resolve(srcPath, `pages/${key}/entry.tsx`);
      await fs.writeFile(target, result, { encoding: 'utf-8' });
      return target;
    }),
  );
}

interface EntryTplParams {
  imports: string;
  pages: string;
  pageImports: string;
  entry: string;
  pageMode: PageMode;
}

function generateEntryTplParams({ pageInstances, editInfo: { pageMode } }: DSL, pageIndex?: number): EntryTplParams {
  const isSingle = pageMode === PageMode.SINGLE;

  let imports: string;
  let pageImports: string;
  if (isSingle) {
    imports = '';
    pageImports = stringify(
      pageInstances.reduce<{ [key: number]: string }>((imports, { key }) => {
        imports[key] = `() => import('./pages/${key}')`;
        return imports;
      }, {}),
    );
    pageInstances.forEach(({ key }) => {
      pageImports = pageImports.replace(`"() => import('./pages/${key}')"`, `() => import('./pages/${key}')`);
    });
  } else {
    const { key } = pageInstances[pageIndex!];
    imports = "import { pageInstance } from './index';\n";
    pageImports = `{ ${key}: () => Promise.resolve(pageInstance) }`;
  }

  return {
    imports,
    pages: stringify(
      pageInstances.map(({ key, name, path, isHome }) => ({
        key,
        name,
        path,
        isHome,
      })),
    ),
    pageImports,
    entry: '#vize-main-entry',
    pageMode: PageMode.SINGLE,
  };
}
