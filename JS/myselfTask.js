let user = JSON.parse(localStorage.getItem("user")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let projects = JSON.parse(localStorage.getItem("projects")) || [];

// Xác định người dùng đang đăng nhập
let currentUser = user.find(u => u.statur === true);

// Kiểm tra nếu không có ai đăng nhập thì chuyển hướng về trang đăng nhập
if (!currentUser) {
  window.location.href = "signIn.html";
}
// gắn sự kiện cho các link
document.querySelectorAll(".link").forEach(link => {
  link.addEventListener("click", function () {
    link.classList.toggle("activeLink");
  });
});
console.log(projects[0]);


// Đăng xuất người dùng
document.querySelector("#out").addEventListener("click", function () {
  let index = user.findIndex(u => u.statur === true);
  if (index !== -1) {
    user[index].statur = false;
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "signIn.html";
  }
});

let listApp = document.querySelector("#listApp");
let app = document.querySelector("#app");
let listTask = [];
if (projects.length > 0) {
  listTask = tasks.filter((task) => task.projectId === projects[0].id);
}

console.log("ListTask :",listTask, typeof listTask);


app.addEventListener("click", function () {
  listApp.innerHTML = ""; // clear danh sách cũ
  
  listTask.forEach((task) => {
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="nameTask">${task.taskName}</td>
      <td><span class="badge ${getPriorityClass(task.priority)}">${task.priority}</span></td>
      <td>${task.status}</td>
      <td class="date">${task.asignDate}</td>
      <td class="date">${task.dueDate}</td>
      <td><span class="badge ${getStatusClass(task.progress)}">${task.progress}</span></td>
    `;
    listApp.appendChild(tr);
  });
});
