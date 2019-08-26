import React, { ReactElement } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import { Issue } from 'github-query-core';
import BadgedText from './BadgedText';
import NumbersByAuthor from './NumbersByAuthor';
import AverageDayToClose from './AverageDayToClose';
import { ItemsProps } from './types';
import cardStyles from '../card.module.css';

export default ({ items }: ItemsProps<Issue<Date>>): ReactElement => {
  let openCount = 0;
  let closedCount = 0;
  items.forEach(({ state }) => {
    switch (state) {
      case 'OPEN':
        openCount += 1;
        break;
      case 'CLOSED':
        closedCount += 1;
        break;
      default:
        throw new Error();
    }
  });
  return (
    <Card className={cardStyles.InformationCard}>
      <CardHeader title="Recent Issues Statistics" />
      <Divider />
      <CardContent className={cardStyles.Centered}>
        <BadgedText title="Open" count={openCount} />
        <BadgedText title="Closed" count={closedCount} />
        <AverageDayToClose totalCount={closedCount} items={items} />
      </CardContent>
      <NumbersByAuthor title="Issues" items={items} />
    </Card>
  );
};
