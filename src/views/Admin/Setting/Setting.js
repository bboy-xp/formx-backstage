import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './Setting.css';
import axios from 'axios';

//引入图片
// import userImg from '../../assets/img/user.png';
import quitImg from '../../../assets/img/quit.png';
import logoImg from '../../../assets/img/logo-xp.png';
import positionImg from '../../../assets/img/position.png';
import heartImg from '../../../assets/img/heart.png';
import githubImg from '../../../assets/img/github.png';
import headImg from '../../../assets/img/head.jpg';

import { Input, Button, Menu, Icon, MessageBox, Message, Upload, Breadcrumb } from 'element-react';

//引入包装好的逻辑
import util from '../../../lib/util';
const { checkLogin } = util;

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      admin: '',
      date: new Date(),
      imageUrl: '',
      postData: {},

    };
  }
  async componentWillMount() {
    document.title = "设置";
    //判断是否登录
    checkLogin();
    //从localStorage中获取admin
    const account = localStorage.getItem('admin');
    this.setState({
      admin: account,
    })

    //时间组件
    setInterval(
      () => this.tick(),
      300
    );

    //获取上传图片的upToken
    const getUpToken = await axios.get("/backstage/getUpToken");
    console.log(getUpToken.data);
    this.setState({
      postData: {
        token: getUpToken.data
      }
    })
  }
  tick() {
    this.setState({
      date: new Date()
    });
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
  handleAvatarScucess(res, file) {
    const newImageUrl = 'http://pdjslih4r.bkt.clouddn.com/' + res.key;
    console.log(newImageUrl);
    this.setState({ imageUrl: newImageUrl });
  }
  beforeAvatarUpload(file) {
    console.log(file.type);
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 2;
    const isJPGAndPNG = isJPG || isPNG;

    if (!isJPGAndPNG) {
      Message('上传头像图片只能是 JPG/PNG 格式!');
    }
    if (!isLt2M) {
      Message('上传头像图片大小不能超过 2MB!');
    }
    return isJPGAndPNG && isLt2M;
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
            <div className="user-msg">
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
                  <Breadcrumb.Item>个人中心</Breadcrumb.Item>
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

              <div className="admin-msg">
                <div className="headImgContent">
                  <div>头像</div>
                  <Upload
                className="avatar-uploader"
                action="https://upload-z1.qiniup.com"
                showFileList={true}
                onSuccess={(res, file) => this.handleAvatarScucess(res, file)}
                beforeUpload={file => this.beforeAvatarUpload(file)}
                data={this.state.postData}
              >
                {this.state.imageUrl ? <img src={this.state.imageUrl} className="avatar" /> : <i className="el-icon-plus avatar-uploader-icon"></i>}
              </Upload>
                </div>
                <div className="accountContent">
                  <div>用户名</div>
                  <Input placeholder="请输入内容" />
                </div>
                <div className="passwordContent"></div>
                <div className="positionContent"></div>
                <div className="describeContent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}