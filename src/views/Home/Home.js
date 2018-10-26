import React, { Component } from 'react';
import './Home.css';

import { Button } from 'zent';


export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }
  async componentWillMount() {
    document.title = "首页";
  }

  render() {
    return (
      <div className="homeContainer">
      <Button>34363</Button>
      </div>
    )
  }
}