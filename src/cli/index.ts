import { Options } from './types';
import parse from './parser';
import validate from './validator';

export default (): Options => validate(parse());
