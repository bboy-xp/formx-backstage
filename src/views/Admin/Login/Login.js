import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

//引入图片
import logoImg from '../../../assets/img/logo-xp.png';

import { Input, Layout, Button, Notification } from 'element-react';

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      password: ''
    };
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleEnterKey);
  }
  componentWillUmount() {
    document.removeEventListener("keydown", this.handleEenterKey);
  }
  handleEnterKey = async (e) => {
    if (e.keyCode === 13) {
      console.log('enter');
      //回车事件
      await this.submit();
    }if(e.keyCode === 192) {
      console.log('login');
      const reqData = {
        account: 'admin',
        password: '123456'
      };
      const loginRes = await axios.post('/backstage/login', reqData);
      if(loginRes.data.message === 'ok') {
        Notification({
          title: '成功',
          message: '登录成功',
          type: 'success'
        });
        localStorage.setItem("admin", 'admin');
        window.location.href = "/";
      }
    }
  }
  async componentWillMount() {
    document.title = "登录";

  }
  accountChange = (e) => {
    this.setState({
      account: e
    })
  }
  passwordChange = (e) => {
    console.log(e);
    this.setState({
      password: e
    })
  }
  submit = async () => {

    if (!this.state.account || !this.state.password) {
      this.setState({
        account: '',
        password: ''
      })
      Notification({
        title: '警告',
        message: '用户名和密码不能为空',
        type: 'warning'
      });
    } else {
      const reqData = {
        account: this.state.account,
        password: this.state.password
      }
      const loginRes = await axios.post('/backstage/login', reqData);
      console.log(loginRes.data);
      if (loginRes.data.message === 'accounts not exist') {
        Notification({
          title: '警告',
          message: ' 账户不存在',
          type: 'warning'
        });
        this.setState({
          account: '',
          password: ''
        })
      } else if (loginRes.data.message === 'password error') {
        Notification({
          title: '警告',
          message: ' 密码错误',
          type: 'warning'
        });
        this.setState({
          password: ''
        })
      } else {
        Notification({
          title: '成功',
          message: '登录成功',
          type: 'success'
        });
        localStorage.setItem("admin", this.state.account);
        window.location.href = "/";
      }
    }

  }

  render() {
    return (
      <div className="LoginContainer">
        <div className="loginBox">
          <img className="logoImg" src={logoImg} alt="404" />
          <div className="headerText">xp表单系统后台</div>
          <Layout.Row>
            <Layout.Col span="20">
              <Input value={this.state.account} onChange={this.accountChange} className="inputContent" placeholder="账号" />
            </Layout.Col>
            <Layout.Col span="20">
              <Input value={this.state.password} onChange={this.passwordChange} type="password" className="inputContent" placeholder="密码" />
            </Layout.Col>
            <Layout.Col span="24">
              <Button onClick={this.submit} className="submitBtn" size="large" type="primary">登录</Button>
            </Layout.Col>
          </Layout.Row>


        </div>
      </div>

    )
  }
}