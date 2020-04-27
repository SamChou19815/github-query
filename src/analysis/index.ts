/* eslint-disable no-console */

import { Repository } from '../core/processed-types';
import { SingleAnalysisReport, LocalAnalysis, GlobalAnalysis } from './analysis-common';
import IssueHealthAnalysis from './analysis-issue-health';
import PullRequestHealthAnalysis from './analysis-pr-health';
import PullRequestMemberStatisticsAnalysis from './analysis-pr-member-statistics';

const localAnalysis: { readonly [analysisName: string]: LocalAnalysis } = {
  IssueHealthAnalysis,
  PullRequestHealthAnalysis,
};

const globalAnalysis: { readonly [analysisName: string]: GlobalAnalysis } = {
  PullRequestMemberStatisticsAnalysis,
};

export const aggregatedAnalyzeLocal = (
  repositories: readonly (readonly [string, Repository<Date>])[],
  afterDate: Date | null
): readonly SingleAnalysisReport[] => {
  if (repositories.length === 0) {
    return [];
  }
  return Object.entries(localAnalysis).flatMap(([analysisName, analysisFunction]) => {
    const results = repositories.map(
      ([name, repository]) => [name, analysisFunction(repository, afterDate)] as const
    );
    const sampleResult = results[0][1];
    return Object.keys(sampleResult).map((metricName) => ({
      analysisName: `${analysisName}/${metricName}`,
      analysisResult: Object.fromEntries(
        results.map(([repositoryName, result]) => [repositoryName, result[metricName]] as const)
      ),
    }));
  });
};

export const analyzeGlobal = (
  repositories: readonly Repository<Date>[],
  afterDate: Date | null
): readonly SingleAnalysisReport[] =>
  Object.entries(globalAnalysis).map(([analysisName, analysisFunction]) => ({
    analysisName,
    analysisResult: analysisFunction(repositories, afterDate),
  }));
