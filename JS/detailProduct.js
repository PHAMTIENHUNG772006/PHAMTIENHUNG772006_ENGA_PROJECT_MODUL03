let tasks = [
    {
        id: 1,
        taskName: "Soạn thảo đề cương dự án",
        assigneeId: 1,
        projectId: 1,
        asignDate: "2025-03-24", 
        dueDate: "2025-03-26",
        priority: "Thấp",
        progress: "Đúng tiến độ",
        status: "To do"
    }, 
    {
        id: 2,
        taskName: "Soạn thảo đề cương dự án",
        assigneeId: 1,
        projectId: 1,
        asignDate: "2025-03-24", 
        dueDate: "2025-03-26",
        priority: "Cao",
        progress: "Đúng tiến độ",
        status: "Pending"
    }, 
    {
        id: 3,
        taskName: "Soạn thảo đề cương dự án",
        assigneeId: 1,
        projectId: 1,
        asignDate: "2025-03-24", 
        dueDate: "2025-03-26",
        priority: "Thấp",
        progress: "Đúng tiến độ",
        status: "Progress"
    }, 
    {
        id: 4,
        taskName: "Soạn thảo đề cương dự án",
        assigneeId: 1,
        projectId: 1,
        asignDate: "2025-03-24", 
        dueDate: "2025-03-26",
        priority: "Trung bình",
        progress: "Đúng tiến độ",
        status: "Pending"
    }, 
    {
        id: 5,
        taskName: "Soạn thảo đề cương dự án",
        assigneeId: 1,
        projectId: 1,
        asignDate: "2025-03-24", 
        dueDate: "2025-03-26",
        priority: "Thấp",
        progress: "Đúng tiến độ",
        status: "Done"
    }, 
]
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

console.log(projectLocal);

const taskId = window.location.href.split("?task=")[1];// lấy địa chỉ của dự án

console.log(tasks[taskId]);


localStorage.setItem("tasks", JSON.stringify(tasks));
renderHeader();

function renderHeader(){
    let nameProject = document.querySelector("#item-contents");
    let describe = document.querySelector("#describe");
    let projectOwner = document.querySelector("#name");
   nameProject.textContent = `${projectLocal[taskId].projectName}`
   describe.textContent = `${projectLocal[taskId].describe}`
   projectOwner.textContent = `${user[taskId].fullname}`
}  

let links = document.querySelectorAll(".link");
console.log(links);

links.forEach(link => {
    link.addEventListener("click", function() {
        link.classList.toggle("active");
    });
});

renderDone();
renderProgress();
renderPending();
renderToDo();
function renderToDo() {
    let toDo = document.querySelector("#toDo");
    let toDolist = document.querySelector(".listToDo");
    toDolist.innerHTML = "";
    
    toDo.addEventListener("click", function () {
        
        toDolist.innerHTML = tasks
            .filter(element => element.status === "To do")
            .map(element => `
               <div class="task-row">
              <div class="cell task-name">${element.taskName}</div>
              <div class="cell person">${users[taskId].fullname}</div>
              <div class="cell priority">
                <span class="${element.priority === "Thấp" ? ".priority-badge.low" : element.priority === "Trung bình" ? ".priority-badge.medium" : element.priority === "Cao" ? ".priority-badge.high" : ""}">${element.priority}</span>
              </div>
              <div class="cell start-date">${element.asignDate}</div>
              <div class="cell deadline">${element.dueDate}</div>
              <div class="cell progress">
                <span class="progress-badge in-progress">${element.progress}</span>
              </div>
              <div class="cell actions">
                <button class="edit-btn">Sửa</button>
                <button class="delete-btn">Xóa</button>
              </div>
            </div>
            `).join("");
    });
}
function renderProgress() {
    let toDo = document.querySelector("#progress");
    let toDolist = document.querySelector(".listProgress");
    toDolist.innerHTML = "";
    
    toDo.addEventListener("click", function () {
        
        toDolist.innerHTML = tasks
            .filter(element => element.status === "Progress")
            .map(element => `
               <div class="task-row">
              <div class="cell task-name">${element.taskName}</div>
              <div class="cell person">${users[taskId].fullname}</div>
              <div class="cell priority">
                <span  class="${element.priority === "Thấp" ? ".priority-badge.low" : element.priority === "Trung bình" ? ".priority-badge.medium" : element.priority === "Cao" ? ".priority-badge.high" : ""}">${element.priority}</span>
              </div>
              <div class="cell start-date">${element.asignDate}</div>
              <div class="cell deadline">${element.dueDate}</div>
              <div class="cell progress">
                <span class="progress-badge in-progress">${element.progress}</span>
              </div>
              <div class="cell actions">
                <button class="edit-btn">Sửa</button>
                <button class="delete-btn">Xóa</button>
              </div>
            </div>
            `).join("");
    });
}

function renderPending() {
    let toDo = document.querySelector("#pending");
    let toDolist = document.querySelector(".listPending");
    toDolist.innerHTML = "";
    
    toDo.addEventListener("click", function () {
        
        toDolist.innerHTML = tasks
            .filter(element => element.status === "Pending")
            .map(element => `
               <div class="task-row">
              <div class="cell task-name">${element.taskName}</div>
              <div class="cell person">${users[taskId].fullname}</div>
              <div class="cell priority">
                <span  class="${element.priority === "Thấp" ? ".priority-badge.low" : element.priority === "Trung bình" ? ".priority-badge.medium" : element.priority === "Cao" ? ".priority-badge.high" : ""}">${element.priority}</span>
              </div>
              <div class="cell start-date">${element.asignDate}</div>
              <div class="cell deadline">${element.dueDate}</div>
              <div class="cell progress">
                <span class="progress-badge in-progress">${element.progress}</span>
              </div>
              <div class="cell actions">
                <button class="edit-btn">Sửa</button>
                <button class="delete-btn">Xóa</button>
              </div>
            </div>
            `).join("");
    });
}
function renderDone() {
    let toDo = document.querySelector("#done");
    let toDolist = document.querySelector(".listDone");
    toDolist.innerHTML = "";
    
    toDo.addEventListener("click", function () {
        
        toDolist.innerHTML = tasks
            .filter(element => element.status === "Done")
            .map(element => `
               <div class="task-row">
              <div class="cell task-name">${element.taskName}</div>
              <div class="cell person">${users[taskId].fullname}</div>
              <div class="cell priority">
                <span  class="${element.priority === "Thấp" ? ".priority-badge.low" : element.priority === "Trung bình" ? ".priority-badge.medium" : element.priority === "Cao" ? ".priority-badge.high" : ""}">${element.priority}</span>
              </div>
              <div class="cell start-date">${element.asignDate}</div>
              <div class="cell deadline">${element.dueDate}</div>
              <div class="cell progress">
                <span class="progress-badge in-progress">${element.progress}</span>
              </div>
              <div class="cell actions">
                <button class="edit-btn">Sửa</button>
                <button class="delete-btn">Xóa</button>
              </div>
            </div>
            `).join("");
    });
}