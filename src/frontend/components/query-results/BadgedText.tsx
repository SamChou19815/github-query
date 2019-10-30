import React, { ReactElement } from 'react';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';
import styles from './BadgedText.module.css';

type Props = { readonly title: string; readonly count: number };

export default ({ title, count }: Props): ReactElement => (
  <Badge color="secondary" badgeContent={count} className={styles.Badge} max={100000} showZero>
    <Typography className={styles.Typography}>{title}</Typography>
  </Badge>
);
