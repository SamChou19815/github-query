import React, { ReactElement } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import { Commit } from '../../core/processed-types';
import BadgedText from './BadgedText';
import NumbersByAuthor from './NumbersByAuthor';
import { ItemsProps } from './types';
import cardStyles from '../card.module.css';

export default ({ items }: ItemsProps<Commit<Date>>): ReactElement => {
  let noStatusCount = 0;
  let goodCount = 0;
  let badCount = 0;
  let pendingCount = 0;
  let hasValidSignatureCount = 0;
  let fromPullRequestCount = 0;
  items.forEach(({ state, hasValidSignature, isFromPullRequest }) => {
    if (state === null) {
      noStatusCount += 1;
    } else {
      switch (state) {
        case 'SUCCESS':
        case 'EXPECTED':
          goodCount += 1;
          break;
        case 'FAILURE':
        case 'ERROR':
          badCount += 1;
          break;
        case 'PENDING':
          pendingCount += 1;
          break;
        default:
          throw new Error();
      }
    }
    if (hasValidSignature) {
      hasValidSignatureCount += 1;
    }
    if (isFromPullRequest) {
      fromPullRequestCount += 1;
    }
  });
  return (
    <Card className={cardStyles.InformationCard}>
      <CardHeader title="Recent Commits Statistics" />
      <Divider />
      <CardContent className={cardStyles.Centered}>
        <BadgedText title="No Status" count={noStatusCount} />
        <BadgedText title="Passing" count={goodCount} />
        <BadgedText title="Failing" count={badCount} />
        <BadgedText title="Pending" count={pendingCount} />
        <BadgedText title="Verified Signed" count={hasValidSignatureCount} />
        <BadgedText title="From Pull Request" count={fromPullRequestCount} />
      </CardContent>
      <NumbersByAuthor title="Commits" items={items} />
    </Card>
  );
};
