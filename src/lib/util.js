function checkLogin() {
  console.log(localStorage.getItem('admin'));
  if(!localStorage.getItem('admin')) {
    window.location.href = '/admin/login';
  }
}
function gotoSetting(props) {
  props.history.push({
    pathname: '/admin/setting',
  })
}
function gotoHome(props) {
  props.history.push({
    pathname: '/',
  })
}
function gotoShowData(props, formToken) {
  const queryData = {
    formToken: formToken
  }
  props.history.push({
    pathname: '/showData',
    query: queryData
  })
}

export default {
  checkLogin,
  gotoSetting,
  gotoHome,
  gotoShowData
};