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
        progress: "Trễ hạn",
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
        progress: "Có rủi ro",
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
let userLogin = JSON.parse(localStorage.getItem("userLogin")) || [];
let taskLocal = JSON.parse(localStorage.getItem("tasks")) || [];
let projectLocal = JSON.parse(localStorage.getItem("projects")) || [];
console.log("userLogin :",userLogin);


/// Xác định người dùng đang đăng nhập
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


console.log(projectLocal);

const taskId = window.location.href.split("?task=")[1];// lấy địa chỉ của dự án

console.log(tasks[taskId]);

// lưu task lên liocal
localStorage.setItem("tasks", JSON.stringify(tasks));
renderHeader();
renderDone();
renderProgress();
renderPending();
renderToDo();

function renderHeader(){
  let nameProject = document.querySelector("#item-contents");
  let describe = document.querySelector("#describe");
  let projectOwner = document.querySelector("#name");
  nameProject.textContent = `${projectLocal[taskId].projectName}`
  describe.textContent = `${projectLocal[taskId].describe}`
  projectOwner.textContent = `${user[taskId].fullname}`
  
}  

let links = document.querySelectorAll(".link");

links.forEach(link => {
    link.addEventListener("click", function() {
        link.classList.toggle("active");
    });
});


function renderToDo() {
    let toDo = document.querySelector("#toDo");
    let toDolist = document.querySelector(".listToDo");
    toDolist.innerHTML = "";
    
   
  toDo.addEventListener("click", function () {
    toDo.classList.toggle("tranform");

    // Nếu danh sách đang hiển thị -> Ẩn nó
    if (toDolist.innerHTML.trim() !== "") {
        toDolist.innerHTML = "";
        return; // Dừng hàm ngay sau khi ẩn
    }

    // Nếu danh sách đang ẩn -> Hiển thị lại
        toDolist.innerHTML = tasks
            .filter(element => element.status === "To do")
            .map(element => `
               <div class="task-row">
              <div class="cell task-name">${element.taskName}</div>
              <div class="cell person">${user[taskId].fullname}</div>
              <div class="cell priority">
                <span class="${element.priority === "Thấp" ? "priority-badge low" : element.priority === "Trung bình" ? "priority-badge medium" : element.priority === "Cao" ? "priority-badge high" : ""}">${element.priority}</span>
              </div>
              <div class="cell start-date date">${element.asignDate}</div>
              <div class="cell deadline date">${element.dueDate}</div>
              <div class="cell progress">
                <span class="progress-badge in-progress">${element.progress}</span>
              </div>
              <div class="cell actions">
                <button class="edit-btn">Sửa</button>
                <button class="delete-btn btnDelete">Xóa</button>
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
      toDo.classList.toggle("tranform");

      // Nếu danh sách đang hiển thị -> Ẩn nó
      if (toDolist.innerHTML.trim() !== "") {
          toDolist.innerHTML = "";
          return; // Dừng hàm ngay sau khi ẩn
      }

      // Nếu danh sách đang ẩn -> Hiển thị lại
        toDolist.innerHTML = tasks
            .filter(element => element.status === "Progress")
            .map(element => `
               <div class="task-row">
              <div class="cell task-name">${element.taskName}</div>
              <div class="cell person">${user[taskId].fullname}</div>
              <div class="cell priority">
                <span  class="${element.priority === "Thấp" ? "priority-badge low" : element.priority === "Trung bình" ? "priority-badge medium" : element.priority === "Cao" ? "priority-badge high" : ""}">${element.priority}</span>
              </div>
              <div class="cell start-date">${element.asignDate}</div>
              <div class="cell deadline">${element.dueDate}</div>
              <div class="cell progress">
                <span class="${element.progress === "Đúng tiến độ" ? "progress-badge in-progress" : element.progress === "Có rủi ro" ? "progress-badge on-time" : element.progress === "Trễ hạn" ? "progress-badge late" : ""}">${element.progress}</span>
              </div>
              <div class="cell actions">
                <button class="edit-btn">Sửa</button>
                <button class="delete-btn btnDelete" >Xóa</button>
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
    toDo.classList.toggle("tranform");

    // Nếu danh sách đang hiển thị -> Ẩn nó
    if (toDolist.innerHTML.trim() !== "") {
        toDolist.innerHTML = "";
        return; // Dừng hàm ngay sau khi ẩn
    }

    // Nếu danh sách đang ẩn -> Hiển thị lại
        toDolist.innerHTML = tasks
            .filter(element => element.status === "Pending")
            .map(element => `
               <div class="task-row">
              <div class="cell task-name">${element.taskName}</div>
              <div class="cell person">${user[taskId].fullname}</div>
              <div class="cell priority">
                <span  class="${element.priority === "Thấp" ? "priority-badge low" : element.priority === "Trung bình" ? "priority-badge medium" : element.priority === "Cao" ? "priority-badge high" : ""}">${element.priority}</span>
              </div>
              <div class="cell start-date">${element.asignDate}</div>
              <div class="cell deadline">${element.dueDate}</div>
              <div class="cell progress">
                <span class="${element.progress === "Đúng tiến độ" ? "progress-badge in-progress" : element.progress=== "Có rủi ro" ? "progress-badge on-time" : element.progress === "Trễ hạn" ? "progress-badge late" : ""}">${element.progress}</span>
              </div>
              <div class="cell actions">
                <button class="edit-btn">Sửa</button>
                <button class="delete-btn btnDelete">Xóa</button>
              </div>
            </div>
            `).join("");
    });
}

function renderDone() {
  let toDo = document.querySelector("#done");
  let toDolist = document.querySelector(".listDone");
function renderEmployeee(){
  let menu = document.querySelector("#menuEmployee");
  menu.addEventListener("click",function(){
    let bodyModalEmployee = document.querySelector("#bodyModalEmployee");

  })
}
  toDo.addEventListener("click", function () {
      toDo.classList.toggle("tranform");

      // Nếu danh sách đang hiển thị -> Ẩn nó
      if (toDolist.innerHTML.trim() !== "") {
          toDolist.innerHTML = "";
          return; // Dừng hàm ngay sau khi ẩn
      }

      // Nếu danh sách đang ẩn -> Hiển thị lại
      toDolist.innerHTML = tasks
          .filter(element => element.status === "Done")
          .map(element => `
             <div class="task-row">
                <div class="cell task-name">${element.taskName}</div>
                <div class="cell person">${user[element.taskId]?.fullname || "N/A"}</div>
                <div class="cell priority">
                  <span class="${element.priority === "Thấp" ? "priority-badge low" : element.priority === "Trung bình" ? "priority-badge medium" : element.priority === "Cao" ? "priority-badge high" : ""}">
                    ${element.priority}
                  </span>
                </div>
                <div class="cell start-date">${element.asignDate}</div>
                <div class="cell deadline">${element.dueDate}</div>
                <div class="cell progress">
                  <span class="${element.progress === "Đúng tiến độ" ? "progress-badge in-progress" : element.progress === "Có rủi ro" ? "progress-badge on-time" : element.progress === "Trễ hạn" ? "progress-badge late" : ""}">
                    ${element.progress}
                  </span>
                </div>
                <div class="cell actions">
                  <button class="edit-btn">Sửa</button>
                  <button class="delete-btn btnDelete">Xóa</button>
                </div>
             </div>
          `).join("");
  });
}

function addEmployee(){
  let btnAddemployee = document.querySelector("#btnAddEmployee");
  let modal = document.querySelector("#modalAddEployee");
  let out = document.querySelector("#closeAddProject");
  let btnCancel = document.querySelector("#btnCancel");
  let save = document.querySelector("#btnSave");
  let error = document.querySelector("#error");

  btnAddemployee.addEventListener("click",function(){
    modal.style.display = "block";
  });
  
  out.addEventListener("click",function(){
    modal.style.display = "none";
  });

  btnCancel.addEventListener("click",function(){
    modal.style.display = "none";
  });
  save.addEventListener("click", function () {
    let email = document.querySelector("#emailEmployee").value.trim();
    let role = document.querySelector("#selectRole").value; // Lấy giá trị của select

    // Tìm user có email khớp
    let foundUser = user.find(u => u.email === email);

    if (foundUser) {
        foundUser.role = role; // Cập nhật role cho user
        localStorage.setItem("user", JSON.stringify(user)); // Lưu lại vào localStorage
        error.textContent = "Thêm nhân viên vào dự án thành công";
        error.style.color = "green";

        setTimeout(() => {
            modal.style.display = "none"; // Đóng modal sau khi cập nhật thành công
        }, 1000);
    } else {
        error.textContent = "Thành viên không tồn tại";
        error.style.color = "red";
    }
});




}

function addTask(){
  let btnSave = document.querySelector("#save");
  let closeProject = document.querySelector("#closeProject");
  let btnAddTask = document.querySelector("#btnAddTask");
  let modalAddEdit = document.querySelector("#modalAddTask");
  let btnCancel = document.querySelector("#btnCancel")


  btnAddTask.addEventListener("click", function(){
    modalAddEdit.style.display = "block";
  })

  closeProject.addEventListener("click",function(){
    modalAddEdit.style.display = "none";
  });

  btnCancel.addEventListener("click",function(){
    modalAddEdit.style.display = "none";
  });

  btnSave.addEventListener("click", function(){
    let nameProject = document.querySelector("#task-name").value.trim();
  })
}


function deleteTask(){
  let btnDelete = document.querySelectorAll(".btnDelete");
  let modalDelete = document.querySelector(".modalDelete");
  btnDelete.addEventListener("click",function(){
    modalDelete.style.display = "block";
  })
}
addTask();
addEmployee();
deleteTask();