import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Home from './views/Home/Home';
import FormPage from './views/FormPage/FormPage';

import './App.css';
//引入element-react
import 'element-theme-default';
//引入zent组件库样式
import 'zent/css/index.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
          <div>
          <Route exact path="/" component={Home} />
          <Route exact path="/formPage" component={FormPage} />
          </div>
        </BrowserRouter>
    );
  }
}

export default App;
