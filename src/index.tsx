import { createMuiTheme } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Main } from './main';

createMuiTheme();
ReactDOM.render(<BrowserRouter><Main /></BrowserRouter>, document.getElementById('root'));
