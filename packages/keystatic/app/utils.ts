import { fromUint8Array } from 'js-base64';
import { isDefined } from 'emery';

import { Config, GitHubConfig, LocalConfig } from '../config';
import { ComponentSchema, fields, SlugFormField } from '../src';
import {
  getCollectionFormat,
  getCollectionItemPath,
  getCollectionItemSlugSuffix,
  getCollectionPath,
  getDataFileExtension,
  getSlugGlobForCollection,
} from './path-utils';
import { collectDirectoriesUsedInSchema, getTreeKey } from './tree-key';
import { getTreeNodeAtPath, TreeNode } from './trees';
import pkgJson from '../package.json';

export * from './path-utils';

export function pluralize(
  count: number,
  options: { singular: string; plural?: string; inclusive?: boolean }
) {
  const { singular, plural = singular + 's', inclusive = true } = options;
  const variant = count === 1 ? singular : plural;
  return inclusive ? `${count} ${variant}` : variant;
}

export function arrayOf<T>(arr: readonly (T | null)[]): T[] {
  return arr.filter(isDefined);
}
export function keyedEntries<T extends Record<string, any>>(
  obj: T
): ({ key: string } & T[keyof T])[] {
  return Object.entries(obj).map(([key, value]) => ({ key, ...value }));
}

export type MaybePromise<T> = T | Promise<T>;

export async function sha1(content: Uint8Array) {
  const hashBuffer = await crypto.subtle.digest('SHA-1', content);
  let str = '';
  for (const byte of new Uint8Array(hashBuffer)) {
    str += byte.toString(16).padStart(2, '0');
  }
  return str;
}

const textEncoder = new TextEncoder();

export function blobSha(contents: Uint8Array) {
  const blobPrefix = textEncoder.encode('blob ' + contents.length + '\0');
  const array = new Uint8Array(blobPrefix.byteLength + contents.byteLength);
  array.set(blobPrefix, 0);
  array.set(contents, blobPrefix.byteLength);
  return sha1(array);
}

export function isGitHubConfig(config: Config): config is GitHubConfig {
  return config.storage.kind === 'github';
}

export function isLocalConfig(config: Config): config is LocalConfig {
  return config.storage.kind === 'local';
}

export function getRepoPath(config: { mainOwner: string; mainRepo: string }) {
  return `${config.mainOwner}/${config.mainRepo}`;
}
export function getRepoUrl(config: { mainOwner: string; mainRepo: string }) {
  return `https://github.com/${getRepoPath(config)}`;
}

export function isSlugFormField(
  schema: ComponentSchema
): schema is SlugFormField<unknown, unknown> {
  return (
    schema.kind === 'form' &&
    'slug' in schema &&
    typeof schema.slug === 'object'
  );
}

export function getSlugFromState(
  collectionConfig: {
    slugField: string;
    schema: Record<string, ComponentSchema>;
  },
  state: Record<string, unknown>
) {
  const value = state[collectionConfig.slugField];
  const field = collectionConfig.schema[collectionConfig.slugField];
  if (!isSlugFormField(field)) {
    throw new Error(`slugField is not a slug field`);
  }
  return field.slug.serialize(value).slug;
}

export function getEntriesInCollectionWithTreeKey(
  config: Config,
  collection: string,
  rootTree: Map<string, TreeNode>
): { key: string; slug: string }[] {
  const collectionConfig = config.collections![collection];
  const schema = fields.object(collectionConfig.schema);
  const formatInfo = getCollectionFormat(config, collection);
  const extension = getDataFileExtension(formatInfo);
  const glob = getSlugGlobForCollection(config, collection);
  const collectionPath = getCollectionPath(config, collection);
  const directory: Map<string, TreeNode> =
    getTreeNodeAtPath(rootTree, collectionPath)?.children ?? new Map();
  const entries: { key: string; slug: string }[] = [];
  const directoriesUsedInSchema = [...collectDirectoriesUsedInSchema(schema)];
  const suffix = getCollectionItemSlugSuffix(config, collection);
  const possibleEntries = new Map(directory);
  if (glob === '**') {
    const handleDirectory = (dir: Map<string, TreeNode>, prefix: string) => {
      for (const [key, entry] of dir) {
        if (entry.children) {
          possibleEntries.set(`${prefix}${key}`, entry);
          handleDirectory(entry.children, `${prefix}${key}/`);
        } else {
          possibleEntries.set(`${prefix}${key}`, entry);
        }
      }
    };
    handleDirectory(directory, '');
  }
  for (const [key, entry] of possibleEntries) {
    if (formatInfo.dataLocation === 'index') {
      const actualEntry = getTreeNodeAtPath(
        rootTree,
        getCollectionItemPath(config, collection, key)
      );
      if (!actualEntry?.children?.has('index' + extension)) continue;
      entries.push({
        key: getTreeKey(
          [
            actualEntry.entry.path,
            ...directoriesUsedInSchema.map(x => `${x}/${key}`),
          ],
          rootTree
        ),
        slug: key,
      });
    } else {
      if (suffix) {
        const newEntry = getTreeNodeAtPath(
          rootTree,
          getCollectionItemPath(config, collection, key) + extension
        );
        if (!newEntry || newEntry.children) continue;
        entries.push({
          key: getTreeKey(
            [
              entry.entry.path,
              getCollectionItemPath(config, collection, key),
              ...directoriesUsedInSchema.map(x => `${x}/${key}`),
            ],
            rootTree
          ),
          slug: key,
        });
      }
      if (entry.children || !key.endsWith(extension)) continue;
      const slug = key.slice(0, -extension.length);
      entries.push({
        key: getTreeKey(
          [
            entry.entry.path,
            getCollectionItemPath(config, collection, slug),
            ...directoriesUsedInSchema.map(x => `${x}/${slug}`),
          ],
          rootTree
        ),
        slug,
      });
    }
  }
  return entries;
}

export const KEYSTATIC_CLOUD_API_URL = 'https://api.keystatic.cloud';

export const KEYSTATIC_CLOUD_HEADERS = {
  'x-keystatic-version': pkgJson.version,
};

export async function redirectToCloudAuth(from: string, config: Config) {
  if (config.storage.kind !== 'cloud') {
    throw new Error('Not a cloud config');
  }
  const code_verifier = fromUint8Array(
    crypto.getRandomValues(new Uint8Array(32)),
    true
  );
  const code_challenge = fromUint8Array(
    new Uint8Array(
      await crypto.subtle.digest('SHA-256', textEncoder.encode(code_verifier))
    ),
    true
  );
  const state = fromUint8Array(
    crypto.getRandomValues(new Uint8Array(32)),
    true
  );
  localStorage.setItem(
    'keystatic-cloud-state',
    JSON.stringify({ state, from, code_verifier })
  );
  const url = new URL(`${KEYSTATIC_CLOUD_API_URL}/oauth/authorize`);
  url.searchParams.set('state', state);
  url.searchParams.set('client_id', config.storage.project);
  url.searchParams.set(
    'redirect_uri',
    `${window.location.origin}/keystatic/cloud/oauth/callback`
  );
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('code_challenge_method', 'S256');
  url.searchParams.set('code_challenge', code_challenge);
  url.searchParams.set('keystatic_version', pkgJson.version);

  window.location.href = url.toString();
}
