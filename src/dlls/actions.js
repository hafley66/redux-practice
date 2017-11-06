import {loadDependency} from '../dependencies/actions';
import {loadAssetManifest} from '../asset_manifests/actions';
import {getManifest} from '../asset_manifests/selectors';
import path from 'path';
import fs from 'fs';
import {get, pick} from 'lodash';

const packageJsonPath = path.resolve(path.cwd(), 'package.json');
const nodeModulesFolderPath = path.resolve(path.cwd(), 'node_modules');
const modifiedAt = path => fs.statSync(path).mtime;
const fieldsFromPackageJson = (pjson) => pick(pjson, 'dependencies', 'devDependencies', 'version');

const
    ASSET_MANIFEST_FILE = 'dll-assets.json',
    ASSET_MANIFEST_NAME = 'dll-assets',
    MEMOS = {
        MANIFEST: 'lock.dll-assets.json',
        PACKAGES: 'lock.packages.json',
        CONFIG: 'lock.config.json',
        TIMESTAMPS: 'lock.timestamps.json'
    };

const loadManifest = (path = ASSET_MANIFEST_FILE) => (dispatch) =>
    dispatch(loadAssetManifest({
        name: ASSET_MANIFEST_NAME,
        path
    }));

const loadManifestMemo = (name = ASSET_MANIFEST_NAME) => (dispatch, getState) =>
    dispatch(loadDependency({
        name: 'manifest',
        cachedPath: MEMOS.MANIFEST,
        currentValue: get(getManifest(getState(), name), 'value')
    }));

const loadPackageJsonMemo = (path = packageJsonPath()) => (dispatch) =>
    dispatch(loadDependency({
        name: 'packages',
        cachedPath: MEMOS.PACKAGES,
        currentValue: fieldsFromPackageJson(require(path))
    }));

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
                nodeModules: modifiedAt(nodeModulesFolder)
            }
        }));

export {
    loadManifest,
    loadTimestampMemo,
    loadConfigMemo,
    loadManifestMemo,
    loadPackageJsonMemo
};
