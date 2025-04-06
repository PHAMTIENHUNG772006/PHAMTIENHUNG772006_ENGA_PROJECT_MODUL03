let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let user = JSON.parse(localStorage.getItem("user")) || [];
let userLogin = JSON.parse(localStorage.getItem("userLogin")) || [];
let taskLocal = JSON.parse(localStorage.getItem("tasks")) || [];
let projectLocal = JSON.parse(localStorage.getItem("projects")) || [];

/// Xác định người dùng đang đăng nhập
let currentUser = user.find((u) => u.statur === true);

// Kiểm tra nếu không có ai đăng nhập thì chuyển hướng về trang đăng nhập
if (!currentUser) {
  window.location.href = "signIn.html";
}

// Đăng xuất người dùng
document.querySelector("#out").addEventListener("click", function () {
  let index = user.findIndex((u) => u.statur === true);
  if (index !== -1) {
    user[index].statur = false;
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "signIn.html";
  }
});

// gắn sự kiện cho các link
document.querySelectorAll(".link").forEach(link => {
  link.addEventListener("click", function () {
    link.classList.toggle("activeLink");
  });
});


const projectId = parseInt(window.location.search.split("?task=")[1]); // lấy địa chỉ của dự án lấy địa chỉ của danh mục dụ án

// lưu task lên liocal
localStorage.setItem("tasks", JSON.stringify(tasks));
renderHeader();
renderDone();
renderProgress();
renderPending();
renderToDo();

function renderHeader() {
  let nameProject = document.querySelector("#item-contents");
  let describe = document.querySelector("#describe");
  let projectOwner = document.querySelector("#name");
  nameProject.textContent = `${projectLocal[projectId].projectName}`; // projectId là id của dự án cũng như là id của chủ dự án
  describe.textContent = `${projectLocal[projectId].describe}`;
  projectOwner.textContent = `${user[projectId].fullname}`;
}

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
      .filter((element) => element.status === "To do")
      .map(
        (element) => `
               <div class="task-row">
              <div class="cell task-name">${element.taskName}</div>
              <div class="cell person">${user[projectId].fullname}</div>
              <div class="cell priority">
                <span class="${
                  element.priority === "Thấp"
                    ? "priority-badge low"
                    : element.priority === "Trung bình"
                    ? "priority-badge medium"
                    : element.priority === "Cao"
                    ? "priority-badge high"
                    : ""
                }">${element.priority}</span>
              </div>
              <div class="cell start-date date">${element.asignDate}</div>
              <div class="cell deadline date">${element.dueDate}</div>
              <div class="cell progress">
                <span class="progress-badge in-progress">${
                  element.progress
                }</span>
              </div>
              <div class="cell actions">
                <button class="edit-btn  fixTask">Sửa</button>
                <button class="delete-btn btnDelete">Xóa</button>
              </div>
            </div>
            `
      )
      .join("");
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
      .filter((element) => element.status === "Progress")
      .map(
        (element) => `
               <div class="task-row">
              <div class="cell task-name">${element.taskName}</div>
              <div class="cell person">${user[projectId].fullname}</div>
              <div class="cell priority">
                <span  class="${
                  element.priority === "Thấp"
                    ? "priority-badge low"
                    : element.priority === "Trung bình"
                    ? "priority-badge medium"
                    : element.priority === "Cao"
                    ? "priority-badge high"
                    : ""
                }">${element.priority}</span>
              </div>
              <div class="cell start-date">${element.asignDate}</div>
              <div class="cell deadline">${element.dueDate}</div>
              <div class="cell progress">
                <span class="${
                  element.progress === "Đúng tiến độ"
                    ? "progress-badge in-progress"
                    : element.progress === "Có rủi ro"
                    ? "progress-badge on-time"
                    : element.progress === "Trễ hạn"
                    ? "progress-badge late"
                    : ""
                }">${element.progress}</span>
              </div>
              <div class="cell actions">
                <button class="edit-btn fixTask">Sửa</button>
                <button class="delete-btn btnDelete" >Xóa</button>
              </div>
            </div>
            `
      )
      .join("");
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
      .filter((element) => element.status === "Pending")
      .map(
        (element) => `
               <div class="task-row">
              <div class="cell task-name">${element.taskName}</div>
              <div class="cell person">${user[projectId].fullname}</div>
              <div class="cell priority">
                <span  class="${
                  element.priority === "Thấp"
                    ? "priority-badge low"
                    : element.priority === "Trung bình"
                    ? "priority-badge medium"
                    : element.priority === "Cao"
                    ? "priority-badge high"
                    : ""
                }">${element.priority}</span>
              </div>
              <div class="cell start-date">${element.asignDate}</div>
              <div class="cell deadline">${element.dueDate}</div>
              <div class="cell progress">
                <span class="${
                  element.progress === "Đúng tiến độ"
                    ? "progress-badge in-progress"
                    : element.progress === "Có rủi ro"
                    ? "progress-badge on-time"
                    : element.progress === "Trễ hạn"
                    ? "progress-badge late"
                    : ""
                }">${element.progress}</span>
              </div>
              <div class="cell actions">
                <button class="edit-btn fixTask">Sửa</button>
                <button class="delete-btn btnDelete">Xóa</button>
              </div>
            </div>
            `
      )
      .join("");
  });
}

function renderDone() {
  let toDo = document.querySelector("#done");
  let toDolist = document.querySelector(".listDone");
  toDo.addEventListener("click", function () {
    toDo.classList.toggle("tranform");

    // Nếu danh sách đang hiển thị -> Ẩn nó
    if (toDolist.innerHTML.trim() !== "") {
      toDolist.innerHTML = "";
      return; // Dừng hàm ngay sau khi ẩn
    }

    // Nếu danh sách đang ẩn -> Hiển thị lại
    toDolist.innerHTML = tasks
      .filter((element) => element.status === "Done")
      .map(
        (element) => `
             <div class="task-row">
                <div class="cell task-name">${element.taskName}</div>
                <div class="cell person">${user[projectId].fullname}</div>
                <div class="cell priority">
                  <span class="${
                    element.priority === "Thấp"
                      ? "priority-badge low"
                      : element.priority === "Trung bình"
                      ? "priority-badge medium"
                      : element.priority === "Cao"
                      ? "priority-badge high"
                      : ""
                  }">
                    ${element.priority}
                  </span>
                </div>
                <div class="cell start-date">${element.asignDate}</div>
                <div class="cell deadline">${element.dueDate}</div>
                <div class="cell progress">
                  <span class="${
                    element.progress === "Đúng tiến độ"
                      ? "progress-badge in-progress"
                      : element.progress === "Có rủi ro"
                      ? "progress-badge on-time"
                      : element.progress === "Trễ hạn"
                      ? "progress-badge late"
                      : ""
                  }">
                    ${element.progress}
                  </span>
                </div>
                <div class="cell actions">
                  <button class="edit-btn fixTask">Sửa</button>
                  <button class="delete-btn btnDelete">Xóa</button>
                </div>
             </div>
          `
      )
      .join("");
  });
}

function renderEmployeee() {
  let menu = document.querySelector("#menuEmployee");
  let out = document.querySelector("#closeRenderEmployee");
  menu.addEventListener("click", function () {
    let bodyModalEmployee = document.querySelector("#modalRenderEployee");
    bodyModalEmployee.style.display = "block"; 
  });
  out.addEventListener("click", function () {
    let bodyModalEmployee = document.querySelector("#modalRenderEployee");
    bodyModalEmployee.style.display = "none"; 
  });
}
renderEmployeee();

function addEmployee() {
  let btnAddemployee = document.querySelector("#btnAddEmployee");
  let modal = document.querySelector("#modalAddEployee");
  let out = document.querySelector("#closeAddProject");
  let btnCancel = document.querySelector("#btnCancelAdd");
  let save = document.querySelector("#btnSave");
  let error = document.querySelector("#error");

  btnAddemployee.addEventListener("click", function () {
    modal.style.display = "block";
  });

  out.addEventListener("click", function () {
    modal.style.display = "none";
  });

  btnCancel.addEventListener("click", function () {
    modal.style.display = "none";
  });
  save.addEventListener("click", function () {
    let email = document.querySelector("#emailEmployee").value.trim();
    let role = document.querySelector("#selectRole").value; // Lấy giá trị của select

    // Tìm user có email khớp
    let foundUser = user.find((u) => u.email === email);

    if (foundUser) {
      if (foundUser.role === role) {
        error.textContent = "Thành viên đã có vai trò này trong dự án!";
        error.style.color = "red";
        email.textContent = ""; // Xóa nội dung của ô nhập email
        role.textContent = ""; // Xóa nội dung của ô nhập vai trò
      } else {
        foundUser.role = role;
        localStorage.setItem("user", JSON.stringify(user));
        error.textContent = "Thêm nhân viên vào dự án thành công";
        email.textContent= ""; // Xóa nội dung của ô nhập email
        role.textContent = ""; // Xóa nội dung của ô nhập vai trò
        error.style.color = "green";
      }
    } else {
      error.textContent = "Thành viên không tồn tại";
      error.style.color = "red";
    }
  });
}

function addTask() {
  let btnSave = document.querySelector("#save");
  let closeProject = document.querySelector("#closeProject");
  let btnAddTask = document.querySelector("#btnAddTask");
  let modalAddEdit = document.querySelector("#modalAddTask");
  let btnCancel = document.querySelector("#btnCancel");
  let selectRole = document.querySelector("#assignee");
  btnAddTask.addEventListener("click", function () {
    modalAddEdit.style.display = "block";
  });

  closeProject.addEventListener("click", function () {
    modalAddEdit.style.display = "none";
  });

  btnCancel.addEventListener("click", function () {
    modalAddEdit.style.display = "none";
  });

  btnSave.addEventListener("click", function () {
    // Lấy input từ form
    let nameTask = document.querySelector("#task-name").value.trim(); // Lấy tên task
    let duedate = document.querySelector("#duedate").value; // Lấy ngày kết thúc của task
    let startdate = document.querySelector("#startdate").value; // Lấy ngày bắt đầu của task
    let progress = document.querySelector("#progressTask").value; // Lấy tiến độ của task
    let priority = document.querySelector("#priority").value; // Lấy độ ưu tiên của task
    let status = document.querySelector("#status").value; // Lấy trạng thái của task
    let assignee = document.querySelector("#assignee").value; // Lấy tên nhân viên được giao nhiệm vụ

   // Chuyển đổi định dạng ngày (nếu cần lưu định dạng dd/mm/yyyy)
   let convertStartDate = startdate ? new Date(startdate).toLocaleDateString('vi-VN') : "";
   let convertDueDate = duedate ? new Date(duedate).toLocaleDateString('vi-VN') : "";
    // Lấy vùng hiển thị lỗi
    let errName = document.querySelector("#error-task-name");
    let errStart = document.querySelector("#error-startdate");
    let errDue = document.querySelector("#error-duedate");
    let errPriority = document.querySelector("#error-priority");
    let errProgress = document.querySelector("#error-progress");
    let errStatus = document.querySelector("#error-status"); // Thêm phần tử hiển thị lỗi (nếu chưa có)
    [errName, errStart, errDue, errPriority, errProgress, errStatus].forEach(
      (e) => (e.textContent = "") // Xóa nội dung lỗi trước khi kiểm tra
    );

    let isValid = true;

    if (!nameTask) {
      errName.textContent = "Vui lòng nhập tên task";
      isValid = false;
    }

    if (!assignee) {
      errName.textContent = "Vui lòng chọn nhân viên được giao nhiệm vụ";
      isValid = false;
    }

    if (!startdate) {
      errStart.textContent = "Vui lòng chọn ngày bắt đầu";
      isValid = false;
    }

    if (!duedate) {
      errDue.textContent = "Vui lòng chọn ngày kết thúc";
      isValid = false;
    }

    if (startdate && duedate) {
      let start = new Date(startdate);
      let end = new Date(duedate);
      if (start > end) {
        errStart.textContent = "Ngày bắt đầu phải trước ngày kết thúc";
        isValid = false;
      }
    }

    if (!priority) {
      errPriority.textContent = "Vui lòng chọn độ ưu tiên";
      isValid = false;
    }

    if (!progress) {
      errProgress.textContent = "Vui lòng chọn tiến độ";
      isValid = false;
    }

    if (!status) {
      errStatus.textContent = "Vui lòng chọn trạng thái";
      isValid = false;
    }

    if (!isValid) return;
    // Nếu hợp lệ thì tiếp tục thêm task
    let newTask = {
      id: userLogin.userid,
      taskName: nameTask,
      assigneeId: userLogin.idUser,
      projectId: 1,
      asignDate: convertStartDate,
      dueDate: convertDueDate,
      priority,
      progress,
      status,
    };
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    // Reset input
    nameTask.textContent = "";
    startdate.textContent  = "";
    duedate.textContent = "";
    priority.textContent  = "";
    progress.textContent  = "";
    status.textContent = "";
    progress.textContent = "";
    modalAddEdit.style.display = "none"; // Đóng modal sau khi thêm task
  });
}

// function deleteTask(){
//   let btnDelete = document.querySelectorAll(".btnDelete");
//   let modalDelete = document.querySelector(".modalDelete");
//   btnDelete.addEventListener("click",function(){
//     modalDelete.style.display = "block";
//   })
// }
function editTask() {
  let modalAddEdit = document.querySelector("#modalAddTask");
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("fixTask")) {// contains giúp kiểm tra xem key truyền vào có phải class hay không và trả về giá trị true / false
      modalAddEdit.style.display = "block";
      // Tại đây bạn có thể lấy dữ liệu của task cần sửa để hiển thị vào form
    }
  });
}
editTask();
addTask();
addEmployee();
