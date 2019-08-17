import React, { ReactElement, useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Timer from '@material-ui/icons/Timer';
import Error from '@material-ui/icons/Error';
import QueryResultDisplay from './QueryResultDisplay';
import { processRepository, Repository } from 'github-query-core';
import { RouteComponentProps } from "react-router";
import { RepositoryId } from './types'
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from '../../data/store';
import styles from './index.module.css';
import cardStyles from '../card.module.css';

interface RouteParameters {
  readonly owner: string;
  readonly name: string;
}

const getRepositoryId = ({ match }: RouteComponentProps): RepositoryId => {
  const { owner, name }: RouteParameters = match.params as any;
  return { owner, name };
};

export default (props: RouteComponentProps): ReactElement => {
  const [repository, setRepository] = useState<Repository<Date> | null | 'LOADING'>('LOADING');
  const dispatch: Dispatch<Action> = useDispatch();
  const { owner, name } = getRepositoryId(props);
  useEffect(() => {
    dispatch({ type: 'UPDATE_REPOSITORY_NAME', repositoryName: `${owner}/${name}` });
  });
  useEffect(() => {
    if (repository !== 'LOADING') {
      return;
    }
    fetch(`/api/query?owner=${owner}&name=${name}`).then(response => response.json()).then(json => {
      if (json === null) {
        setRepository(null);
        return;
      }
      const repository = processRepository(
        json as Repository<string>,
        stringDate => new Date(stringDate),
      );
      setRepository(repository);
    });
  }, [name, owner, repository]);
  if (repository === 'LOADING') {
    return (
      <div id="query-result">
        <Card className={cardStyles.InformationCard}>
          <CardHeader avatar={<Timer />} title="Loading" />
          <CardContent className={styles.LoadingContainer}>
            <CircularProgress />
          </CardContent>
        </Card>
      </div>
    );
  }
  if (repository === null) {
    return (
      <div id="query-result">
        <Card className={cardStyles.InformationCard}>
          <CardHeader avatar={<Error />} title="NOT_TRACKED" />
          <CardContent>
            {`${owner}/${name} is not tracked by this tool.`}
          </CardContent>
        </Card>
      </div>
    );
  }
  return <QueryResultDisplay {...repository} />;
};
