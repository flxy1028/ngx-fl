import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
type PackageType = 'dependencies' | 'devDependencies';
const devDependencies = [
  '@angular-eslint/builder@~15.2.0',
  '@angular-eslint/eslint-plugin@~15.2.0',
  '@angular-eslint/eslint-plugin-template@~15.2.0',
  '@angular-eslint/schematics@~15.2.0',
  '@angular-eslint/template-parser@~15.2.0',
  '@typescript-eslint/eslint-plugin@~5.49.0',
  '@typescript-eslint/parser@~5.49.0',
  '@commitlint/config-conventional@^17.6.3',
  'commitizen@^4.3.0',
  'commitlint-config-cz@^0.13.3',
  'cz-customizable@^7.0.0',
  'cz-git@^1.6.1',
  'eslint@^8.33.0',
  'eslint-config-prettier@~8.6.0',
  'eslint-plugin-deprecation@~1.3.3',
  'eslint-plugin-import@~2.26.0',
  'eslint-plugin-jsdoc@~39.7.4',
  'eslint-plugin-prefer-arrow@~1.2.3',
  'eslint-plugin-prettier@~4.2.1',
  'eslint-plugin-unused-imports@^2.0.0',
  'husky@^7.0.4',
  'prettier@^2.8.3',
  'prettier-stylelint@0.4.2',
  'stylelint@^13.3.1',
  'stylelint-config-prettier@^8.0.1',
  'stylelint-config-rational-order@0.1.2',
  'stylelint-config-standard@^20.0.0',
  'stylelint-declaration-block-no-ignored-properties@^2.3.0',
  'stylelint-order@^4.0.0',
];
// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ngAdd(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (!options.skipPackageJson) {
      addPackage(tree, devDependencies, 'devDependencies');
    }
    context.addTask(new NodePackageInstallTask())
    return tree;
  };
}

function addPackage(
  host: Tree,
  packages: string | string[],
  type: PackageType = 'dependencies'
): Tree {
  const sourceText = host.read('package.json')!.toString('utf-8')!;
  const json = JSON.parse(sourceText);

  if (!json.dependencies) {
    json.dependencies = {};
  }

  if (!Array.isArray(packages)) {
    packages = [packages];
  }
  packages.forEach(pck => {
    const splitPosition = pck.lastIndexOf('@');
    json[type][pck.slice(0, splitPosition - 1)] = pck.slice(splitPosition + 1);
  });
  host.overwrite('package.json', JSON.stringify(json, null, 2));
  return host;
}
