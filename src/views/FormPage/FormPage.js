import React, { Component } from 'react';
import './FormPage.css';
import axios from 'axios';

//引入图片
import userImg from '../../assets/img/user.png';
import quitImg from '../../assets/img/quit.png';
import logoImg from '../../assets/img/logo-xp.png';
import positionImg from '../../assets/img/position.png';

import { Button, Menu, Breadcrumb, Table } from 'element-react';
import { isThisWeek } from 'date-fns';


export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      formToken: '',
      form: {},
      formDatas: [],
      columns: [],
      choiceObj: {},
    };
  }
  async componentWillMount() {
    document.title = "表单后台";
    const that = this;
    //发送请求

    //时间组件
    setInterval(
      () => this.tick(),
      300
    );

    //获取formToken
    // console.log(this.props.location.query.formToken);
    // this.setState({
    //   formToken: this.props.location.query.formToken
    // });
    // const token = this.props.location.query.formToken;
    const token = "OGd0EOjyTv";
    this.setState({
      formToken: token
    });

    //获取目标表单数据，和表单提交的数据
    const getFormPageData = await axios.post('/backstage/getFormPageData', {
      formToken: token
    });
    this.setState({
      form: getFormPageData.data.targetForm
    })
    console.log(getFormPageData.data);
    const targetForm = getFormPageData.data.targetForm;
    console.log(targetForm);
    const newColumns = [{
      type: 'index'
    }];
    targetForm.fields.map((field, index) => {
      if (field.type === 'text') {
        newColumns.push({
          label: field.title,
          prop: `${field.token}`
        })
      } else if (field.type === 'choice') {
        const newChoiceObj = this.state.choiceObj;
        //将choice的token和value全部存入this.state.choiceObj，key是token
        field.choices.map((choice, index) => {
          newChoiceObj[choice.token] = choice.value;
        });
        console.log(newChoiceObj);
        this.setState({
          choiceObj: newChoiceObj
        }, () => {
          newColumns.push({
            label: field.title,
            prop: `${field.token}`,
            render: function (data) {
              return (
                <span>{that.state.choiceObj[data[field.token]]}</span>
              )
            }
          })
        });

      }
    })
    newColumns.push({
      label: "操作",
      render: (row, column, index) => {
        return <span><Button type="text" size="small" onClick={this.deleteRow.bind(this, index)}>移除</Button></span>
      }
    })
    console.log(newColumns,getFormPageData.data.targetFormDatas);
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
                  <Breadcrumb.Item>{this.state.form.name}</Breadcrumb.Item>
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
              />
            </div>
          </div>
        </div>
      </div>

    )
  }
}