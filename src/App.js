import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Home from './views/Home/Home';
import FormPage from './views/FormPage/FormPage';
import Login from './views/Admin/Login/Login';
import ShowData from './views/ShowData/ShowData';


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
          <Route path="/formPage" component={FormPage} />
          <Route path="/showData" component={ShowData} />
          <Route path="/admin/login" component={Login} />
          </div>
        </BrowserRouter>
    );
  }
}

export default App;
