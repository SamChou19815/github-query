import { Options } from './types';

type MutableRawOptions = {
  readonly positionals: string[];
  readonly presented: Set<string>;
  readonly keyValuePairs: Map<string, string>;
};

const normalizedArguments: readonly string[] = process.argv.slice(2);

const parseToRawOptions = (zeroIndexedArguments: readonly string[]): MutableRawOptions => {
  const rawOptions: MutableRawOptions = {
    positionals: [],
    presented: new Set(),
    keyValuePairs: new Map()
  };
  let lastOption: string | null = null;
  let finishedParsingNonPositionals = false;
  zeroIndexedArguments.forEach(argument => {
    if (finishedParsingNonPositionals) {
      rawOptions.positionals.push(argument);
      return;
    }
    if (!argument.startsWith('--')) {
      if (lastOption === null) {
        // We are not waiting for an argument.
        rawOptions.positionals.push(argument);
        finishedParsingNonPositionals = true;
      } else {
        rawOptions.keyValuePairs.set(lastOption, argument);
        lastOption = null;
      }
      return;
    }
    const optionName = argument.substring(2);
    if (lastOption === null) {
      lastOption = optionName;
    } else {
      rawOptions.presented.add(lastOption);
      lastOption = optionName;
    }
  });
  if (lastOption !== null) {
    rawOptions.presented.add(lastOption);
  }
  return rawOptions;
};

const parse = (zeroIndexedArguments: readonly string[] = normalizedArguments): Options => {
  const { positionals: repositories, presented, keyValuePairs } = parseToRawOptions(
    zeroIndexedArguments
  );
  const help = presented.has('help');
  const recent = presented.has('recent');
  const fresh = presented.has('fresh');
  const afterString = keyValuePairs.get('after');
  const after = afterString == null ? null : new Date(afterString);
  return { repositories, after, fresh, recent, help };
};

export default parse;
