import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './FormPage.css';
import axios from 'axios';

//引入图片
import userImg from '../../assets/img/user.png';
import quitImg from '../../assets/img/quit.png';
import logoImg from '../../assets/img/logo-xp.png';
import positionImg from '../../assets/img/position.png';
import heartImg from '../../assets/img/heart.png';
import githubImg from '../../assets/img/github.png';

import { Button, Menu, Breadcrumb, Table, Pagination } from 'element-react';

//引入包装好的逻辑
import util from '../../lib/util';
const { checkLogin } = util;

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      formToken: '',
      form: {},
      formName: '',
      formDatas: [],
      columns: [],
      choiceObj: {},
      pageSize: 15,
      currentPage: 1,
      targetFormDatasLength: 0
    };
  }
  async componentWillMount() {
    document.title = "表单后台";
    //判断是否登录
    checkLogin();


    const that = this;

    //时间组件
    setInterval(
      () => this.tick(),
      300
    );

    //获取formToken
    //判断query中是否有formToken，如果没有从localStorage中获取，如果有直接赋值
    let token;
    if (!!this.props.location.query) {
      console.log('query中有值');
      token = this.props.location.query.formToken;
      //存入localStorage
      localStorage.setItem('formToken', token);
      this.setState({
        formToken: token
      });
    } else {
      console.log('query中没有值');
      token = localStorage.getItem('formToken');
      this.setState({
        formToken: token
      });
    }

    //临时测试用token
    // const token = "OGd0EOjyTv";
    // this.setState({
    //   formToken: token
    // });

    //获取目标表单数据，和表单提交的数据
    const getFormPageData = await axios.post('/backstage/getFormPageData', {
      formToken: token
    });
    this.setState({
      form: getFormPageData.data.targetForm,
      formName: getFormPageData.data.targetFormName,
      targetFormDatasLength: getFormPageData.data.targetFormDatasLength
    })
    const targetForm = getFormPageData.data.targetForm;
    const newColumns = [{
      type: 'index',
    }];
    // 循环fields，并重构复制到newColumns中
    targetForm.fields.map((field, index) => {
      if (field.type === 'text') {
        newColumns.push({
          label: field.title,
          prop: `${field.token}`,
        })
      } else if (field.type === 'choice') {
        const newChoiceObj = this.state.choiceObj;
        //将choice的token和value全部存入this.state.choiceObj，key是token
        field.choices.map((choice, index) => {
          newChoiceObj[choice.token] = choice.value;
        });
        console.log(newChoiceObj);
        //用回调保证setState是同步的
        this.setState({
          choiceObj: newChoiceObj
        }, () => {
          //在columns中添加type为choice的field渲染方式
          newColumns.push({
            label: field.title,
            prop: `${field.token}`,
            render: function (data) {
              //判断是单选还是多选，根据情况渲染data
              if (data[field.token] instanceof Array) {
                const tokenArr = [];
                data[field.token].map((item, index) => {
                  tokenArr.push(that.state.choiceObj[item]);
                })
                return (
                  <span>{tokenArr.join('、')}</span>
                )
              } else {
                return (
                  <span>{that.state.choiceObj[data[field.token]]}</span>
                )
              }

            }
          })
        });

      }
    });
    //在columns中添加操作栏
    newColumns.push({
      label: "操作",
      render: (row, column, index) => {
        return <span><Button type="text" size="small" onClick={this.deleteRow.bind(this, index)}>移除</Button></span>
      }
    })
    console.log(newColumns, getFormPageData.data.targetFormDatas);
    this.setState({
      columns: newColumns,
      formDatas: getFormPageData.data.targetFormDatas
    })
    console.log(this.state);
  }
  tick() {
    this.setState({
      date: new Date()
    });
  }
  deleteRow() {
    console.log(123);
  }
  handelClickGotoHome = () => {
    console.log(12312432);
    // this.props.router.push('/');
  }
  CurrentPageChange = async (e) => {
    console.log(e);
    //参数即是页码
    const reqData = {
      currentPage: e,
      pageSize: this.state.pageSize,
      formToken: this.state.formToken
    }
    const getCurrentPageData = await axios.post('/backstage/getCurrentPageData',reqData);
    console.log(getCurrentPageData);
    this.setState({
      formDatas: getCurrentPageData.data.formDatas
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
            <img className="quit-icon" src={quitImg} alt="404" />
            <span className="header-nav-quit-text">退出</span>
          </div>
        </div>
        <div className="content">
          <div className="navContent">
            <Menu defaultActive="1" theme="dark" className="el-menu-vertical-demo nav" >
              <Menu.Item index="1"><i className="el-icon-document"></i><Link className="linkText" to="/">表单列表</Link></Menu.Item>
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
                  <Breadcrumb.Item>{this.state.formName}</Breadcrumb.Item>
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
                data={this.state.formDatas}
                border={true}
                height={700}
                highlightCurrentRow={true}
                stripe={true}
              />
              <div className="block">
              <Pagination layout="prev, pager, next, jumper" total={this.state.targetFormDatasLength} pageSize={this.state.pageSize} currentPage={this.state.currentPage} onCurrentChange={this.CurrentPageChange} />
              {/* <Pagination layout="prev, pager, next, jumper" total={100} pageSize={15} currentPage={this.state.currentPage} onCurrentChange={this.CurrentPageChange} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}