import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { dirname, join } from 'path';

import { Repository } from '../core/processed-types';
import { processRepository } from '../core/processor';

const getPath = (id: string): string => join('local-database', `${id}.json`);

const serialize = (repository: Repository<Date>): string =>
  JSON.stringify(repository, undefined, 2);

const deserialize = (serializedRepository: string): Repository<Date> =>
  processRepository(JSON.parse(serializedRepository), (date: string) => new Date(date));

export const exists = (id: string): boolean => existsSync(getPath(id));

export const store = (id: string, repository: Repository<Date>) => {
  const path = getPath(id);
  const directory = dirname(path);
  if (!existsSync(directory)) {
    mkdirSync(directory);
  }
  writeFileSync(path, serialize(repository));
};

export const retrive = (id: string): Repository<Date> => {
  const content = readFileSync(getPath(id)).toString();
  return deserialize(content);
};
