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

import { Form, Select, Input, Button, Menu, Icon, MessageBox, Message, Upload, Breadcrumb, DatePicker, Layout } from 'element-react';

//引入包装好的逻辑
import util from '../../../lib/util';
const { checkLogin } = util;

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      admin: '',
      date: new Date(),
      // imageUrl: 'http://pdjslih4r.bkt.clouddn.com/FhJmQZxvD9OHM5dW5yKueCV-X8it',
      postData: {},
      labelPosition: 'top',
      form: {
        imageUrl: '',
        account: '',
        email: '',
        birthday: {},
        area: '',
        describe: '',

      },
      rules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
        ]
      },
      areaOptions: [{
        value: '哈尔滨'
      }, {
        value: '鸡西'
      }, {
        value: '佳木斯'
      }, {
        value: '七台河'
      }, {
        value: '绥化'
      }, {
        value: '大庆'
      }, {
        value: '绥芬河'
      }, {
        value: '齐齐哈尔'
      }, {
        value: '牡丹江'
      },]
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
    // 获取管理员数据
    const getTargetAdmin = await axios.post("/backstage/getTargetAdmin", { account: account });
    const newForm = {
      imageUrl: getTargetAdmin.data.message.imageUrl,
      account: getTargetAdmin.data.message.account,
      email: getTargetAdmin.data.message.email,
      birthday: new Date(getTargetAdmin.data.message.birthday),
      area: getTargetAdmin.data.message.area,
      describe: getTargetAdmin.data.message.describe
    }
    console.log(newForm);
    this.setState({
      form: newForm
    }, () => {
      console.log(this.state);
    })
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
    this.setState({
      imageUrl: newImageUrl,
      form: Object.assign({}, this.state.form, { ['imageUrl']: newImageUrl })

    });
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
  onEmailChange(value) {
    this.setState({
      form: Object.assign({}, this.state.form, { email: value })
    });
  }
  onChange(key, value) {
    // console.log(typeof(value));
    console.log(this.state.form);
    this.setState({
      form: Object.assign({}, this.state.form, { [key]: value })
    });
  }
  handleSubmit = async () => {
    console.log(this.state.form);
    const reqData = {
      account: this.state.admin,
      adminMsg: this.state.form
    }
    const updateAdmin = await axios.post('/backstage/updateAdmin', reqData);
    //消息提示
    Message({
      type: 'success',
      message: '保存成功'
    });
    if (updateAdmin.data.message.account !== this.state.admin) {
      localStorage.admin = '';
      this.props.history.push({
        pathname: '/admin/login',
      })
    }
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

                <Form ref="form" labelPosition={this.state.labelPosition} labelWidth="100" model={this.state.form} rules={this.state.rules} className="demo-form-stacked">
                  <Form.Item label="头像">
                    <Upload
                      className="avatar-uploader"
                      action="https://upload-z1.qiniup.com"
                      showFileList={false}
                      onSuccess={(res, file) => this.handleAvatarScucess(res, file)}
                      beforeUpload={file => this.beforeAvatarUpload(file)}
                      data={this.state.postData}
                    >
                      {this.state.form.imageUrl ? <img src={this.state.form.imageUrl} className="avatarImg" /> : <i className="el-icon-plus avatar-uploader-icon"></i>}
                    </Upload>
                  </Form.Item>
                  <Form.Item label="管理员名称">
                    <Input value={this.state.form.account} onChange={this.onChange.bind(this, 'account')}></Input>
                  </Form.Item>
                  <Form.Item required={false} prop="email" label="邮箱">
                    <Input value={this.state.form.email} onChange={this.onEmailChange.bind(this)}></Input>
                  </Form.Item>
                  <Form.Item label="生日" required={false}>
                    <DatePicker
                      value={this.state.form.birthday}
                      placeholder="选择日期"

                      onChange={this.onChange.bind(this, 'birthday')}
                    />
                  </Form.Item>
                  <Form.Item label="地区">
                    <Select onChange={this.onChange.bind(this, 'area')} value={this.state.form.area}>
                      {
                        this.state.areaOptions.map(el => {
                          return <Select.Option key={el.value} label={el.value} value={el.value} />
                        })
                      }
                    </Select>
                  </Form.Item>
                  <Form.Item label="自我说明">
                    <Input type="textarea"
                      rows='4' resize='none' value={this.state.form.describe} onChange={this.onChange.bind(this, 'describe')}></Input>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" onClick={this.handleSubmit}>保存</Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}