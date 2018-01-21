import {loadDependency} from '../dependencies/actions';
import {getManifest} from '../asset_manifests/selectors';
import path from 'path';
import fs from 'fs';
import {get, pick} from 'lodash';

import {ASSET_MANIFEST_NAME, MEMOS} from '../constants';



const dir = (...args)=> path.resolve(path.cwd(), args);
const packageJsonPath = dir('package.json');
const nodeModulesFolderPath = dir('node_modules');
const packageLockPath = dir('package-lock.json');
const yarnLockPath = dir('yarn.lock');
const modifiedAt = path => fs.statSync(path).mtime;
const fieldsFromPackageJson = (pjson) => pick(pjson, 'dependencies', 'devDependencies', 'version');



const loadManifestMemo = (name = ASSET_MANIFEST_NAME) => (dispatch, getState) =>
    dispatch(loadDependency({
        name: 'manifest',
        cachedPath: MEMOS.MANIFEST,
        currentValue: get(getManifest(getState(), name), 'value')
    }));

const loadPackageJsonMemo = (path = packageJsonPath()) =>
    loadDependency({
        name: 'packages',
        cachedPath: MEMOS.PACKAGES,
        currentValue: fieldsFromPackageJson(require(path))
    });

const loadConfigMemo = (config = {}) => (dispatch) =>
    dispatch(loadDependency({
        name: 'config',
        currentValue: config,
        cachedPath: MEMOS.CONFIG
    }));

const loadTimestampMemo = (
    nodeModulesFolder = nodeModulesFolderPath(),
    packageJsonFile = packageJsonPath()
) =>
    (dispatch) =>
        dispatch(loadDependency({
            name: 'timestamps',
            cachedPath: MEMOS.TIMESTAMPS,
            currentValue: {
                packageJson: modifiedAt(packageJsonFile),
                nodeModules: modifiedAt(nodeModulesFolder),
                yarnLock: modifiedAt(yarnLockPath),
                packageLock: modifiedAt(packageLockPath)
            }
        }));

export {
    loadTimestampMemo,
    loadConfigMemo,
    loadManifestMemo,
    loadPackageJsonMemo
};
