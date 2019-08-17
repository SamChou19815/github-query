import React, { ReactElement } from 'react';
import { Route, Switch } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { createMuiTheme } from '@material-ui/core/styles';
import About from './components/About';
import Help from './components/Help';
import RepositoryQueryResult from './components/query-results';
import styles from './App.module.css'
import { State } from './data/store';
import { useSelector } from 'react-redux';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#3E7AE2',
    },
    secondary: {
      main: '#D52262'
    }
  }
});

export default (): ReactElement => {
  const repositoryName = useSelector(({ repositoryName }: State) => repositoryName);
  return (
    <MuiThemeProvider theme={theme}>
      <>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={styles.Title}>
              {repositoryName === null ? 'GitHub Query' : repositoryName}
            </Typography>
          </Toolbar>
        </AppBar>
        <Switch>
          <Route path="/repository/:owner/:name" component={RepositoryQueryResult} />
          <Route path="/" component={Help} />
        </Switch>
        <About />
      </>
    </MuiThemeProvider>
  );
};
