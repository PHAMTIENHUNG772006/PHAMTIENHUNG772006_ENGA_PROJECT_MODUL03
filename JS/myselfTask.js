let user = JSON.parse(localStorage.getItem("user")) || [];
let taskLocal = JSON.parse(localStorage.getItem("tasks")) || [];
let projectLocal = JSON.parse(localStorage.getItem("projects")) || [];

// Xác định người dùng đang đăng nhập
let currentUser = user.find(u => u.statur === true);

// Kiểm tra nếu không có ai đăng nhập thì chuyển hướng về trang đăng nhập
if (!currentUser) {
  window.location.href = "signIn.html";
}

// Đăng xuất người dùng
document.querySelector("#out").addEventListener("click", function () {
  let index = user.findIndex(u => u.statur === true);
  if (index !== -1) {
    user[index].statur = false;
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "signIn.html";
  }
});