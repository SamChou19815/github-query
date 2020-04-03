import parse from './parser';
import { Options } from './types';
import validate from './validator';

export default (): Options => validate(parse());
