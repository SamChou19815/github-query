import React, { ReactElement } from 'react';
import { Repository } from 'github-query-core';
import BasicInformationCard from './BasicInformationCard';
import IssueStatisticsCard from './IssueStatisticsCard';
import PullRequestStatisticsCard from './PullRequestStatisticsCard';
import CommitStatisticsCard from './CommitStatisticsCard';

export default (repository: Repository<Date>): ReactElement => {
  const { issues, pullRequests, commits } = repository;
  return (
    <>
      <BasicInformationCard {...repository} />
      <IssueStatisticsCard items={issues} />
      <PullRequestStatisticsCard items={pullRequests} />
      <CommitStatisticsCard items={commits} />
    </>
  );
};
