import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Home from './views/Home/Home';

import './App.css';

//引入zent组件库样式
import 'zent/css/index.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
          <div>
            <Route exact path="/" component={Home} />
          </div>
        </BrowserRouter>
    );
  }
}

export default App;
