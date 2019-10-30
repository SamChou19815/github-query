import React, { ReactElement } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import { Repository } from '../../core/processed-types';
import BadgedText from './BadgedText';
import ChippedText from './ChippedText';
import cardStyles from '../card.module.css';

export default ({
  hasIssuesEnabled,
  licenseKey,
  updatedAt,
  pushedAt,
  issuesCount,
  pullRequestsCount,
  commitsCount
}: Repository<Date>): ReactElement => (
  <Card className={cardStyles.InformationCard}>
    <CardHeader title="Basic Information" />
    <Divider />
    <CardContent className={cardStyles.Centered}>
      <ChippedText text={`Issues are ${hasIssuesEnabled ? 'enabled' : 'disabled'}.`} />
      <ChippedText text={licenseKey == null ? 'No license' : licenseKey} />
      <ChippedText text={`Updated: ${updatedAt.toLocaleDateString()}`} />
      <ChippedText text={`Pushed: ${pushedAt.toLocaleDateString()}`} />
    </CardContent>
    <Divider />
    <CardContent className={cardStyles.Centered}>
      <BadgedText title="Issues" count={issuesCount} />
      <BadgedText title="Pull Requests" count={pullRequestsCount} />
      <BadgedText title="Commits" count={commitsCount} />
    </CardContent>
  </Card>
);
