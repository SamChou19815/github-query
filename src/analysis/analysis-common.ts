import { Repository } from '../core/processed-types';

export interface AnalysisResult {
  readonly [name: string]: number;
}

export type SingleAnalysisReport = {
  readonly analysisName: string;
  readonly analysisResult: AnalysisResult;
};

export type LocalAnalysis = (
  repository: Repository<Date>,
  afterDate: Date | null
) => AnalysisResult;

export type GlobalAnalysis = (
  repositories: readonly Repository<Date>[],
  afterDate: Date | null
) => AnalysisResult;

// eslint-disable-next-line import/prefer-default-export
export const roundToDaysWith2Digits = (timeIntervalInMilliseconds: number): number => {
  const average = Math.round((timeIntervalInMilliseconds / 1000 / 3600 / 24) * 100) / 100;
  return isNaN(average) ? 0 : average;
};
