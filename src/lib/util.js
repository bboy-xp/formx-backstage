function checkLogin() {
  console.log(localStorage.getItem('admin'));
  if(!localStorage.getItem('admin')) {
    window.location.href = '/admin/login';
  }
}

export default {
  checkLogin
};