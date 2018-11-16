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

import { Button, Menu, Breadcrumb, DatePicker, } from 'element-react';

// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入折线图
import 'echarts/lib/chart/line';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

//引入包装好的逻辑
import util from '../../lib/util';
const { checkLogin, gotoHome, gotoShowData } = util;


export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      selectDate: new Date(),
      echartData: [820, 932, 901, 934, 1290, 1330, 1320],
      option: {
        title: {
          text: '七天提交量'
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: {
          name: '提交总量',
          type: 'line',
          stack: '总量',
          symbol: 'roundRect',//节点性状
          itemStyle: {
            normal: {
              color: "#278BDD" //图标颜色
            }
          },
          lineStyle: {
            normal: {
              width: 2,  //连线粗细
              color: "#278BDD"  //连线颜色
            }
          },
          smooth: true,//折线图是趋缓的
          data: []
        }
      }
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
    //获取formToken
    //判断query中是否有formToken，如果没有从localStorage中获取，如果有直接赋值
    let token;
    if (!!this.props.location.query) {
      console.log('query中有值');
      token = this.props.location.query.formToken;
      console.log(token);
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
    // db.formdatas.find({"createdAt" :  {"$gte" : ISODate("2018-11-09")}}).count()

    //时间组件
    setInterval(
      () => this.tick(),
      300
    );
  }
  async componentDidMount() {
    //format xAxis
    const now = this.state.selectDate;
    const time1 = now.toLocaleDateString();
    const time2 = new Date(now.getTime() - 3600 * 1000 * 24).toLocaleDateString();
    const time3 = new Date(now.getTime() - 3600 * 1000 * 24 * 2).toLocaleDateString();
    const time4 = new Date(now.getTime() - 3600 * 1000 * 24 * 3).toLocaleDateString();
    const time5 = new Date(now.getTime() - 3600 * 1000 * 24 * 4).toLocaleDateString();
    const time6 = new Date(now.getTime() - 3600 * 1000 * 24 * 5).toLocaleDateString();
    const time7 = new Date(now.getTime() - 3600 * 1000 * 24 * 6).toLocaleDateString();
    const xAxisData = [time7, time6, time5, time4, time3, time2, time1]

    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('chart'));
    myChart.setOption(this.state.option);

    myChart.setOption({
      xAxis: {
        data: xAxisData
      }
    })

    //请求后端获取echart的data
    const getEchartData = await axios.post('/backstage/getEchartData', {
      selectDate: this.state.selectDate
    });
    // console.log(getEchartData.data);
    myChart.setOption({
      series: [{
        name: '提交总量',
        data: getEchartData.data.message
      }]
    })
  }
  tick() {
    this.setState({
      date: new Date()
    });
  }
  handelClickGotoHome = () => {
    console.log(12312432);
    // this.props.router.push('/');
    gotoHome(this.props);
  }
  handelClickGotoShowData = () => {
    gotoShowData(this.props);
  }
  handelClickGetEchartData = async () => {
    const myChart = echarts.init(document.getElementById('chart'));
    //请求后端获取echart的data
    const getEchartData = await axios.post('/backstage/getEchartData', {
      selectDate: this.state.selectDate
    });
    // console.log(getEchartData.data);
    myChart.setOption({
      series: [{
        name: '提交总量',
        data: getEchartData.data.message
      }]
    })
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
              <Menu.SubMenu index="1" title={<span className="linkText" onClick={this.handelClickGotoHome}><i className="el-icon-document"></i>表单列表</span>}>
                <Menu.Item index="1-1"><span className="linkText" onClick={this.handelClickGotoShowData}>数据预览</span></Menu.Item>
              </Menu.SubMenu>
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
              <div className="echartsBox">
                <div className="echartsBox-bar">
                  <DatePicker
                    value={this.state.selectDate}
                    placeholder="选择日期"
                    onChange={date => {
                      this.setState({ selectDate: date })
                    }}
                    // 3600 * 1000 * 24 是一天的时间
                    disabledDate={time => time.getTime() > Date.now() - 8.64e7 + 3600 * 1000 * 24}
                  />
                  <div className="echartsBox-bar-blank"></div>
                  <Button type="primary" onClick={this.handelClickGetEchartData}>确定</Button>
                </div>
                <div className="echartsBox-body">
                  <div id="chart"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}