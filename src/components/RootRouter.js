import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import Home from './Home';
import PageNotFound from './PageNotFound';

const RootRouter = () => (
  <Router>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route component={PageNotFound} />
    </Switch>
  </Router>
);

export default RootRouter;
