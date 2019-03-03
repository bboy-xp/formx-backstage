import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './Home.css';
import axios from 'axios';

//引入图片
// import userImg from '../../assets/img/user.png';
import quitImg from '../../assets/img/quit.png';
import logoImg from '../../assets/img/logo-xp.png';
import positionImg from '../../assets/img/position.png';
import heartImg from '../../assets/img/heart.png';
import githubImg from '../../assets/img/github.png';
import headImg from '../../assets/img/head.jpg';

import { Button, Menu, Breadcrumb, Icon, Tag, Table, MessageBox, Message, Pagination, Carousel } from 'element-react';

//引入包装好的逻辑
import util from '../../lib/util';
const { checkLogin, gotoSetting } = util;

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      admin: '',
      date: new Date(),
      allForms: [],
      pageSize: 16,
      currentPage: 1,
      columns: [
        {
          type: 'index'
        },
        {
          label: "日期",
          prop: "createdAt",
          width: 250,
          render: function (data) {
            return (
              <span>
                <Icon name="time" />
                <span style={{ marginLeft: '10px' }}>{data.createdAt}</span>
              </span>)
          }
        },
        {
          label: "标题",
          prop: "name",
          render: function (data) {
            return <Tag type="primary">{data.name}</Tag>
          }
        },
        {
          label: "操作",
          prop: "address",
          width: 250,
          render: (row, column, index) => {
            return (
              <span>
                <Button onClick={this.test.bind(this, row)} plain={true} type="info" size="small">查看</Button>
                <Button type="danger" size="small">删除</Button>
              </span>
            )
          }
        }
      ],
      carouselImgSrc: [
        'http://pns17yito.bkt.clouddn.com/54c9cd51d0947.jpg',
        'http://pns17yito.bkt.clouddn.com/5487b1db4e0a5.png',
        'http://pns17yito.bkt.clouddn.com/53fee2665ba55.jpg',
        'http://pns17yito.bkt.clouddn.com/23e0c41f2bce19a33c18cfcec1b8a7d.jpg',
        'http://pns17yito.bkt.clouddn.com/logo2.png',
      ]
    };
  }
  async componentWillMount() {
    document.title = "首页";
    //判断是否登录
    checkLogin();
    //从localStorage中获取admin
    const account = localStorage.getItem('admin');
    const forms = await axios.get('/backstage/getForms');
    this.setState({
      admin: account,
      allForms: forms.data
    })
    console.log(forms.data);

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

  test(row) {
    console.log(row);
    const queryData = {
      formToken: row.token
    }
    this.props.history.push({
      pathname: '/formPage',
      query: queryData
    })
  }
  handelQuit = () => {

    MessageBox.confirm('此操作将退出系统, 是否继续?', '提示', {
      type: 'warning'
    }).then(() => {
      localStorage.admin = '';
      this.props.history.push({
        pathname: '/admin/login',
      })
    }).catch(() => {
      Message({
        type: 'info',
        message: '已取消退出'
      });
    });
  }
  handelGotoSetting = () => {
    gotoSetting(this.props);
  }

  render() {
    return (
      <div className="homeContainer">
        <div className="header">
          <img className="header-logo" src={logoImg} alt="404" />
          <div className="logoText">XP后台管理系统</div>
          <div className="header-nav" onClick={this.handelQuit}>
            <img className="quit-icon" src={quitImg} alt="404" />
            <span className="header-nav-quit-text">退出</span>
          </div>
        </div>
        <div className="content">
          <div className="navContent">
            <div className="user-msg" onClick={this.handelGotoSetting}>
              <img className="headImg" src={headImg} alt="404" />
              <div className="user-msg-text">欢迎您</div>
              <div className="user-msg-text">{this.state.admin}</div>
            </div>
            <Menu defaultActive="1" theme="dark" className="el-menu-vertical-demo nav" >
              <Menu.Item index="1"><i className="el-icon-document"></i ><span className="linkText">表单列表</span></Menu.Item>
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
              <div className="carouselContent">
                <Carousel interval="4000" type="card" height="155px">
                  {
                    this.state.carouselImgSrc.map((item, index) => {
                      return (
                        <Carousel.Item key={index}>
                          <img className="carouselImg" src={item} alt="404"/>
                        </Carousel.Item>
                      )
                    })
                  }
                </Carousel>
              </div>
              <Table
                style={{ width: '100%' }}
                columns={this.state.columns}
                data={this.state.allForms}
                border={true}
                height={500}
                highlightCurrentRow={true}
                stripe={true}
              />
              <div className="block">
                <Pagination layout="prev, pager, next, jumper" total={this.state.allForms.length} pageSize={this.state.pageSize} currentPage={this.state.currentPage} onCurrentChange={this.CurrentPageChange} />
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}