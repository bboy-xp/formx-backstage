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

export default {
  checkLogin,
  gotoSetting
};