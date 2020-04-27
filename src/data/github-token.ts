/* eslint-disable no-console */
import chalk from 'chalk';
import dotEnv from 'dotenv';

dotEnv.config();

const logError = (line: string): void => console.error(chalk.red(line));

const throwFatalError = (): never => {
  logError('Fatal error. Unable to find your github token.');
  logError('Make sure you put your github token in the .env file where this program is run.');
  logError('e.g. `GITHUB_TOKEN=octocat1234567`');
  process.exit(3);
};

const githubToken: string = process.env.GITHUB_TOKEN || throwFatalError();
export default githubToken;
