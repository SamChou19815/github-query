import React, { ReactElement } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Help from '@material-ui/icons/Help';
import styles from './card.module.css';

export default (): ReactElement => (
  <div id="help">
    <Card className={styles.InformationCard}>
      <CardHeader avatar={<Help />} title="Help" />
      <CardContent>
        {'To query a specific project, go to '}
        <code>repository/owner/name</code>
        {'.'}
      </CardContent>
      <CardContent>
        {'For example, if you want to track '}
        <code>github.com/facebook/react</code>
        {', the URL should be '}
        <code>repository/facebook/react</code>
        {'.'}
      </CardContent>
    </Card>
  </div>
);
