import React, { Component } from 'react';
import './Home.css';
import axios from 'axios';
//引入zent组件
import { Table } from 'zent';
import { Button } from 'element-react';


export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }
  async componentWillMount() {
    document.title = "首页";
    const forms = await axios.get('/backstage/getForms');
    console.log(forms);
  }

  render() {
    return (
      <div className="homeContainer">
      </div>
    )
  }
}