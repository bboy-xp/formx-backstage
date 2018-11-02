import React, { Component } from 'react';
import './Home.css';
import axios from 'axios';

//引入图片
import userImg from '../../assets/img/user.png';
import quitImg from '../../assets/img/quit.png';
import logoImg from '../../assets/img/logo-xp.png';
import positionImg from '../../assets/img/position.png';

import { Button, Menu, Breadcrumb, Icon, Tag, Table } from 'element-react';


export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      allForms: [],
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
      ]
    };
  }
  async componentWillMount() {
    document.title = "首页";
    const forms = await axios.get('/backstage/getForms');
    this.setState({
      allForms: forms.data
    })
    console.log(forms.data);

    //时间组件
    setInterval(
      () => this.tick(),
      60000
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

  render() {
    return (
      <div className="homeContainer">
        <div className="header">
          <img className="header-logo" src={logoImg} alt="404" />
          <div className="logoText">XP后台管理系统</div>
          <div className="header-nav">
            <img className="header-nav-icon" src={userImg} alt="404" />
            <span className="header-nav-user-text">用户：admin</span>
          </div>
          <div className="header-nav">
            <img className="header-nav-icon quit-icon" src={quitImg} alt="404" />
            <span className="header-nav-quit-text">退出</span>
          </div>
        </div>
        <div className="content">
          <div className="navContent">
            <Menu defaultActive="1" theme="dark" className="el-menu-vertical-demo" >
              <Menu.Item index="1"><i className="el-icon-document"></i>表单列表</Menu.Item>
            </Menu>
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
              <Table
                style={{ width: '100%' }}
                columns={this.state.columns}
                data={this.state.allForms}
                border={true}
                height={700}
                highlightCurrentRow={true}
              />
            </div>
          </div>
        </div>
      </div>

    )
  }
}