import { Repository } from '../core/processed-types';

export interface AnalysisResult {
  readonly [resultMetricName: string]: number;
}

export type Analysis = (repository: Repository<Date>, afterDate: Date | null) => AnalysisResult;

// eslint-disable-next-line import/prefer-default-export
export const roundToDaysWith2Digits = (timeIntervalInMilliseconds: number): number =>
  Math.round((timeIntervalInMilliseconds / 1000 / 3600 / 24) * 100) / 100;
