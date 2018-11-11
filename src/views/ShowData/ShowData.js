import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './ShowData.css';
import axios from 'axios';

//引入图片
import userImg from '../../assets/img/user.png';
import quitImg from '../../assets/img/quit.png';
import logoImg from '../../assets/img/logo-xp.png';
import positionImg from '../../assets/img/position.png';
import heartImg from '../../assets/img/heart.png';
import githubImg from '../../assets/img/github.png';
import headImg from '../../assets/img/head.jpg';

import { Button, Menu, Breadcrumb } from 'element-react';

//引入包装好的逻辑
import util from '../../lib/util';
const { checkLogin } = util;

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
    };
  }
  async componentWillMount() {
    document.title = "表单后台";
    //判断是否登录
    checkLogin();
    //从localStorage中获取admin
    const account = localStorage.getItem('admin');
    this.setState({
      admin: account,
    });
    // db.formdatas.find({"createdAt" :  {"$gte" : ISODate("2018-11-09")}}).count()

    //时间组件
    setInterval(
      () => this.tick(),
      300
    );
  }
  tick() {
    this.setState({
      date: new Date()
    });
  }
  render() {
    return (
      <div className="homeContainer">
        <div className="header">
          <img className="header-logo" src={logoImg} alt="404" />
          <div className="logoText">XP后台管理系统</div>
          <div className="header-nav">
            <img className="quit-icon" src={quitImg} alt="404" />
            <span className="header-nav-quit-text">退出</span>
          </div>
        </div>
        <div className="content">

          <div className="navContent">
            <div className="user-msg">
              <img className="headImg" src={headImg} alt="404" />
              <div className="user-msg-text">欢迎您</div>
              <div className="user-msg-text">{this.state.admin}</div>
            </div>
            <Menu defaultActive="1" theme="dark" className="el-menu-vertical-demo nav" >
              <Menu.Item index="1"><i className="el-icon-document"></i><Link className="linkText" to="/">表单列表</Link></Menu.Item>
              <Menu.Item index="2"><i className="el-icon-document"></i><Link className="linkText" to="/">数据预览</Link></Menu.Item>
            </Menu>
            <div className="nav-ad">
              <a href='#' className="ad-text"><img className="ad-img-heart" src={heartImg} alt="" />Support me</a>
              <span className="ad-divide">·</span>
              <a href='https://github.com/bboy-xp/formx-backstage' className="ad-text"><img className="ad-img-heart" src={githubImg} alt="" />Feedback?</a>
            </div>
          </div>
          <div className="bodyContent">
            <div className="bodyContent-header">
              <img className="bodyContent-header-position-icon" src={positionImg} alt="404" />
              <span className="bodyContent-header-text1">您当前的位置：</span>
              <div className="bodyContent-header-Breadcrumb">
                <Breadcrumb separator="/">
                  <Breadcrumb.Item>首页</Breadcrumb.Item>
                  <Breadcrumb.Item>表单列表</Breadcrumb.Item>
                  {/* <Breadcrumb.Item>{this.state.formName}</Breadcrumb.Item> */}
                  <Breadcrumb.Item>数据预览</Breadcrumb.Item>
                </Breadcrumb>
              </div>
              <div className="bodyContent-header-date">
                <div className="dateContent">
                  <span>{this.state.date.getFullYear()}</span>
                  <span>年</span>
                  <span>{this.state.date.getMonth()}</span>
                  <span>月</span>
                  <span>{this.state.date.getDate()}</span>
                  <span>日</span>

                  <span className="date-time">{this.state.date.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            <div className="bodyContent-body">
            </div>
          </div>
        </div>
      </div>

    )
  }
}