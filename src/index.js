import React from 'react';
import { render } from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import RootRouter from './components/RootRouter';

import './index.scss';

injectTapEventPlugin();

function App() {
  return (<RootRouter />);
}

render(<App />, document.getElementById('app'));
