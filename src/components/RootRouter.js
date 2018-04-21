import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import ChessView from './ChessView';
import PageNotFound from './PageNotFound';

const RootRouter = () => (
  <Router>
    <Switch>
      <Route path="/" exact component={ChessView} />
      <Route component={PageNotFound} />
    </Switch>
  </Router>
);

export default RootRouter;
