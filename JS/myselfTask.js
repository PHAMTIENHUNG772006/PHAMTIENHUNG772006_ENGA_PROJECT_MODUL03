let user = JSON.parse(localStorage.getItem("user")) || [];
let taskLocal = JSON.parse(localStorage.getItem("tasks")) || [];
let projectLocal = JSON.parse(localStorage.getItem("projects")) || [];

let out = document.querySelector("#out").addEventListener("click",function(){
  user[0].statur = false;
  localStorage.setItem("user",JSON.stringify(user));
})
// Tìm kiếm xem có đang ở trạng thái đăng nhập hay không
if (!user || user[0].statur == false) {
  window.location.href = "signIn.html";
}
