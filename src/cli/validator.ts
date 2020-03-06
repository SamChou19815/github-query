/* eslint-disable no-console */
import { Options } from './types';

const helpMessage = `$ github-query-cli <options> [repo...]
[repo]     Path to the repository. e.g. facebook/react [string list] [required]
--after    Only consider objects after this specified time. e.g. 2020-02-02
                                                                       [string]
--recent   Only get recent information.              [boolean] [default: false]
--fresh    Force fetching new data.                  [boolean] [default: false]
--help     Show help                                                  [boolean]
`;

export default (options: Options): Options => {
  const { repositories, after, help } = options;
  if (help) {
    console.log(helpMessage);
    process.exit(0);
  }
  if (after !== null && isNaN(after.getTime())) {
    console.error('Invalid date string for after argument!');
    console.log('');
    console.log(helpMessage);
    process.exit(2);
  }
  if (repositories.length === 0) {
    console.error('Repository list should not be empty!');
    console.log('');
    console.log(helpMessage);
    process.exit(2);
  }
  return options;
};
