import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { Repository } from '../core/processed-types';
import { processRepository } from '../core/processor';

const serialize = (repository: Repository<Date>): string => JSON.stringify(repository);
const deserialize = (serializedRepository: string): Repository<Date> =>
  processRepository(JSON.parse(serializedRepository), (date: string) => new Date(date));

export const store = (id: string, repository: Repository<Date>) =>
  writeFileSync(join('local-database', `${id}.json`), serialize(repository));

export const retrive = (id: string): Repository<Date> => {
  const content = readFileSync(join('local-database', `${id}.json`)).toString();
  return deserialize(content);
};
