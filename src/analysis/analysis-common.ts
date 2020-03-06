import { Repository } from '../core/processed-types';

export interface AnalysisResult {
  readonly [resultMetricName: string]: number;
}

export type Analysis = ({ pullRequests }: Repository<Date>) => AnalysisResult;

// eslint-disable-next-line import/prefer-default-export
export const roundToDaysWith2Digits = (timeIntervalInMilliseconds: number): number =>
  Math.round((timeIntervalInMilliseconds / 1000 / 3600 / 24) * 100) / 100;
