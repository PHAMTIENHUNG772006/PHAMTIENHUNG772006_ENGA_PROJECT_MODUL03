let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let user = JSON.parse(localStorage.getItem("user")) || [];
let userLogin = JSON.parse(localStorage.getItem("userLogin")) || [];
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
document.querySelectorAll(".link").forEach((link) => {
  link.addEventListener("click", function () {
    link.classList.toggle("activeLink");
  });
});

const projectId = parseInt(window.location.search.split("?task=")[1]); //  lấy địa chỉ của danh mục dụ án
console.log(projectId);

let members = projectLocal[projectId].members; // láy mẳng members để đẩy giá trị nhân viên mới vào trong project
addTask();
addEmployee();

// lưu task lên local
localStorage.setItem("tasks", JSON.stringify(tasks));
function addEmployee() {
  let btnAddemployee = document.querySelector("#btnAddEmployee");
  let modal = document.querySelector("#modalAddEployee");
  let out = document.querySelector("#closeAddProject");
  let btnCancel = document.querySelector("#btnCancelAdd");
  let save = document.querySelector("#btnSave");
  let error = document.querySelector("#errorEmail");

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
    let emailInput = document.querySelector("#emailEmployee");
    let roleSelect = document.querySelector("#selectRole");

    let email = emailInput.value.trim();
    let role = roleSelect.value;

    let foundUser = user.find((u) => u.email === email);
    let foundMember = members.find((u) => u.email === email);

    if (foundUser) {
      if (foundMember) {
        error.textContent = "Thành viên đã có vai trò này trong dự án!";
        error.style.color = "red";
        emailInput.value = "";
        roleSelect.value = "";
      } else {
        let newEmployee = {
          id: foundUser.id, // sửa đúng id
          email,
          role,
          nameUser: foundUser.fullname,
        };

        members.push(newEmployee);

        // Gán lại vào project hiện tại
        projectLocal[projectId].members = members;

        // Cập nhật localStorage
        localStorage.setItem("projects", JSON.stringify(projectLocal));

        // Thông báo thành công
        error.textContent = "Thêm nhân viên vào dự án thành công";
        error.style.color = "green";

        // Reset input
        emailInput.value = "";
        roleSelect.value = "";
      }
    } else {
      error.textContent = "Thành viên không tồn tại";
      error.style.color = "red";
    }
  });
}

/**
 * // Hàm thêm option trong form thêm task
 * @param {*} members // mảng members trong mảng user được truyền vào
 */
function renderAssigneeOptions(members) {
  const select = document.querySelector("#assignee");
  select.innerHTML = '<option value="">-- Chọn nhân viên --</option>';

  members.forEach((member) => {
    let userfilter = user.find((u) => u.email === member.email);
    let name = userfilter ? userfilter.fullname : member.email;
    let option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });
}

renderAssigneeOptions(members); // hàm đẩy email của các tài khoản khác lên làm nhân viên dự án

function addTask() {
  let btnSave = document.querySelector("#btnSaveTask");
  let closeProject = document.querySelector("#closeProject");
  let btnAddTask = document.querySelector("#btnAddTask");
  let btnCancel = document.querySelector("#btnCancel");
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
    let startdate = document.querySelector("#startDate").value; // Lấy ngày bắt đầu của task
    let progress = document.querySelector("#progressTasks").value; // Lấy tiến độ của task
    let priority = document.querySelector("#priority").value; // Lấy độ ưu tiên của task
    let status = document.querySelector("#status").value; // Lấy trạng thái của task
    let assignee = document.querySelector("#assignee").value; // Lấy tên nhân viên được giao nhiệm vụ

    // Chuyển đổi định dạng ngày (nếu cần lưu định dạng dd/mm/yyyy)
    let convertStartDate = startdate
      ? new Date(startdate).toLocaleDateString("vi-VN")
      : "";
    let convertDueDate = duedate
      ? new Date(duedate).toLocaleDateString("vi-VN")
      : "";
    // Lấy vùng hiển thị lỗi
    let errName = document.querySelector("#error-task-name");
    let errStart = document.querySelector("#error-startdate");
    let errAsignee = document.querySelector("#assignee");
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
      errAsignee.textContent = "Vui lòng chọn nhân viên được giao nhiệm vụ";
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
      id: Math.ceil(Math.random() * 10000),
      taskName: nameTask,
      nameAssignee: assignee,
      assigneeId: userLogin.idUser, // địa chỉ của người chủ project
      projectId: userLogin.idUser,
      asignDate: convertStartDate,
      dueDate: convertDueDate,
      priority,
      progress,
      status,
    };
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Reset lại giá trị input
    nameTask.textContent = "";
    startdate.textContent = "";
    duedate.textContent = "";
    priority.textContent = "";
    assignee.textContent = "";
    status.textContent = "";
    progress.textContent = "";
    modalAddEdit.style.display = "none"; // Đóng modal sau khi thêm task
  });
}

let taskTable = document.getElementById("task-table");
let modalDelete = document.querySelector("#modalDelete");
let btnConfirmEmploye = document.querySelector("#btnConfirmEmploye");
let btnCancelTask = document.querySelector("#btnCancelTask");
let closeModalDelete = document.querySelector("#closeModalDelete");
let modalAddEdit = document.querySelector("#modalAddTask");
let btnSave = document.querySelector("#btnSaveTask");
let editIndex = null;

let nameTask = document.querySelector("#task-name").value.trim(); // Lấy tên task
let duedate = document.querySelector("#duedate").value; // Lấy ngày kết thúc của task
let startdate = document.querySelector("#startDate").value; // Lấy ngày bắt đầu của task
let progress = document.querySelector("#progressTasks").value; // Lấy tiến độ của task
let priority = document.querySelector("#priority").value; // Lấy độ ưu tiên của task
let status = document.querySelector("#status").value; // Lấy trạng thái của task
let assignee = document.querySelector("#assignee").value; // Lấy tên nhân viên được giao nhiệm vụ

taskTable.addEventListener("click", function (e) {
  if (!e.target.classList.contains("group-header")) {
    if (e.target.classList.contains("btnDelete")) {
      modalDelete.style.display = "block";
      btnConfirmEmploye.addEventListener("click", function () {
        let taskDeleteId = e.target.dataset.id;
        let findIndex = tasks.findIndex((e) => e.id == taskDeleteId);
        tasks.splice(findIndex, 1);
        modalDelete.style.display = "none";
        localStorage.setItem("tasks", JSON.stringify(tasks));
        // Chỉ render lại nếu danh sách đang mở
        if (document.querySelector("#toDo").classList.contains("rote-90")) {
          renderToDo();
        }
      });
      btnCancelTask.addEventListener("click", function () {
        modalDelete.style.display = "none";
      });
      closeModalDelete.addEventListener("click", function () {
        nameTask.textContent = "";
        startdate.textContent = "";
        duedate.textContent = "";
        priority.textContent = "";
        assignee.textContent = "";
        status.textContent = "";
        progress.textContent = "";
        modalDelete.style.display = "none";
      });
    }
    if (e.target.classList.contains("btnEdit")) {
      let taskEditId = e.target.dataset.id;
      let findIndex = tasks.findIndex((element) => element.id == taskEditId);
      let task = tasks[findIndex];

      modalAddEdit.style.display = "block";
      document.querySelector("#task-name").value = task.taskName;
      document.querySelector("#assignee").value = task.nameAssignee;
      document.querySelector("#status").value = task.status;
      // Chuyển đổi định dạng ngày
      document.querySelector("#startDate").value = convertDateFormat(
        task.asignDate
      );
      document.querySelector("#duedate").value = convertDateFormat(
        task.dueDate
      );
      document.querySelector("#priority").value = task.priority;
      document.querySelector("#progressTasks").value = task.progress;
      localStorage.setItem("tasks", JSON.stringify(tasks));

      btnSave.addEventListener("click", function () {
        let nameTask = document.querySelector("#task-name").value.trim(); // Lấy tên task
        let duedate = document.querySelector("#duedate").value; // Lấy ngày kết thúc của task
        let startdate = document.querySelector("#startDate").value; // Lấy ngày bắt đầu của task
        let progress = document.querySelector("#progressTasks").value; // Lấy tiến độ của task
        let priority = document.querySelector("#priority").value; // Lấy độ ưu tiên của task
        let status = document.querySelector("#status").value; // Lấy trạng thái của task
        let assignee = document.querySelector("#assignee").value; // Lấy tên nhân viên được giao nhiệm vụ
      });
      // Chỉ render lại nếu danh sách đang mở
      if (document.querySelector("#toDo").classList.contains("rote-90")) {
        renderToDo();
      } else if (
        document.querySelector("#inProgress").classList.contains("rote-90")
      ) {
        renderProgress();
      } else if (
        document.querySelector("#pending").classList.contains("rote-90")
      ) {
        renderPending();
      } else if (
        document.querySelector("#done").classList.contains("rote-90")
      ) {
        renderDone();
      }
    }
  }
});

// Hàm chuyển đổi ngày từ "DD/MM/YYYY" → "YYYY-MM-DD"
function convertDateFormat(dateString) {
  // Nếu đã đúng định dạng YYYY-MM-DD rồi thì trả lại luôn
  if (dateString.includes("-")) return dateString;

  const [day, month, year] = dateString.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function renderHeader() {
  let nameProject = document.querySelector("#item-contents");
  let describe = document.querySelector("#describe");
  let projectOwner = document.querySelector("#name");
  let logoName = document.querySelector("#logoName");
  let logoEmployee = document.querySelector("#logoEmployee");
  let logoProjectOwner = userLogin.fullname.slice(0, 2).toUpperCase();

  let filteredMembers = members.filter(
    (member) =>
      member.email &&
      member.email.trim() !== "" &&
      member.role &&
      member.role !== "undefined"
  );

  logoEmployee = filteredMembers[0].nameUser.slice(0, 2);

  logoName.innerHTML = `<h2 class="avatar">${logoProjectOwner}</h2>`;
  logoEmployee.innerHTML = `<h2 class="avatar">${logoEmployee}</h2>`;
  nameProject.textContent = `${projectLocal[projectId].projectName}`; // projectId là id của dự án cũng như là id của chủ dự án
  describe.textContent = `${projectLocal[projectId].describe}`;
  projectOwner.textContent = `${userLogin.fullname}`;
}

function initToDoToggle() {
  let statusTodo = document.querySelector("#statusTodo");
  let todoIcon = document.querySelector("#toDo");
  let toDolist = document.querySelector(".listToDo");

  statusTodo.addEventListener("click", function () {
    const isExpanded = todoIcon.classList.contains("rote-90");

    if (isExpanded) {
      todoIcon.classList.remove("rote-90");
      todoIcon.classList.add("rote-0");
      toDolist.innerHTML = "";
    } else {
      todoIcon.classList.remove("rote-0");
      todoIcon.classList.add("rote-90");
      renderToDo(); // Gọi lại khi mở
    }
  });
}

function setupToggleToDo() {
  const statusTodo = document.querySelector("#statusTodo");
  const todoIcon = document.querySelector("#toDo");
  const toDolist = document.querySelector(".listToDo");

  let isOpen = false; // Mặc định ẩn

  statusTodo.addEventListener("click", () => {
    isOpen = !isOpen;

    if (isOpen) {
      todoIcon.classList.remove("rote-0");
      todoIcon.classList.add("rote-90");
      renderToDo();
    } else {
      todoIcon.classList.remove("rote-90");
      todoIcon.classList.add("rote-0");
      toDolist.innerHTML = ""; // Ẩn danh sách
    }
  });
}

function renderToDo() {
  let toDolist = document.querySelector(".listToDo");
  toDolist.innerHTML = tasks
    .filter(
      (element) =>
        element.status === "To do" && element.projectId === userLogin.idUser
    )
    .map(
      (element, index) => `
        <div class="task-row">
          <div class="cell task-name">${element.taskName}</div>
          <div class="cell person">${element.nameAssignee}</div>
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
            <button class="edit-btn btnEdit" data-id=${element.id}>Sửa</button>
            <button data-id=${
              element.id
            } class="delete-btn btnDelete" data-index="${index}">Xóa</button>
          </div>
        </div>
      `
    )
    .join("");
}

function initProgressToggle() {
  let statusProgress = document.querySelector("#statusProgress");
  let progressIcon = document.querySelector("#progress");
  let listProgress = document.querySelector(".listProgress");

  statusProgress.addEventListener("click", function () {
    const isExpanded = progressIcon.classList.contains("rote-90");

    if (isExpanded) {
      progressIcon.classList.remove("rote-0");
      progressIcon.classList.add("rote-90");
      listProgress.innerHTML = "";
    } else {
      progressIcon.classList.remove("rote-90");
      progressIcon.classList.add("rote-0");
      renderProgress() // Gọi lại khi mở
    }
  });
}

function setupToggleProgress() {
  let statusProgress = document.querySelector("#statusProgress");
  let progressIcon = document.querySelector("#progress");
  let listProgress = document.querySelector(".listProgress");

  let isOpen = false; // Mặc định ẩn

  statusProgress.addEventListener("click", () => {
    isOpen = !isOpen;

    if (isOpen) {
      progressIcon.classList.remove("rote-0");
      progressIcon.classList.add("rote-90");
      renderProgress();
    } else {
      progressIcon.classList.remove("rote-90");
      progressIcon.classList.add("rote-0");
      listProgress.innerHTML = ""; // Ẩn danh sách
    }
  });
}

window.onload = function () {
  setupToggleToDo();
  setupToggleProgress();
  setupTogglePending();
};


function renderProgress() {
  let listProgress = document.querySelector(".listProgress");
  listProgress.innerHTML = tasks
    .filter(
      (element) =>
        element.status === "In progress" && element.projectId === userLogin.idUser
    )
    .map(
      (element, index) => `
        <div class="task-row">
          <div class="cell task-name">${element.taskName}</div>
          <div class="cell person">${element.nameAssignee}</div>
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
            <button class="edit-btn btnEdit" data-id=${element.id}>Sửa</button>
            <button data-id=${
              element.id
            } class="delete-btn btnDelete" data-index="${index}">Xóa</button>
          </div>
        </div>
      `
    )
    .join("");
}

function renderPending() {
  let listPending = document.querySelector(".listPending");
    listPending.innerHTML = tasks
      .filter((element) => element.status === "Pending"
     && element.projectId === userLogin.idUser
    )
      .map(
        (element) => `
               <div class="task-row">
              <div class="cell task-name">${element.taskName}</div>
              <div class="cell person">${element.nameAssignee}</div>
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
              <div class="cell start-date date">${element.asignDate}</div>
              <div class="cell deadline date">${element.dueDate}</div>
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
                <button class="edit-btn btnEdit" data-id=${
                  element.id
                }>Sửa</button>
                <button data-id=${
                  element.id
                } class="delete-btn btnDelete">Xóa</button>
              </div>
            </div>
            `
      )
      .join("");
}

function initPendingToggle() {
  let statusPending = document.querySelector("#statusPending");
  let pendingIcon = document.querySelector("#pending");
  let pendinglist = document.querySelector(".listPending");

  statusPending.addEventListener("click", function () {
    const isExpanded = todoIcon.classList.contains("rote-90");

    if (isExpanded) {
      pendingIcon.classList.remove("rote-90");
      pendingIcon.classList.add("rote-0");
      pendinglist.innerHTML = "";
    } else {
      pendingIcon.classList.remove("rote-0");
      pendingIcon.classList.add("rote-90");
      renderPending(); // Gọi lại khi mở
    }
  });
}

function setupTogglePending() {
  let statusPending = document.querySelector("#statusPending");
  let pendingIcon = document.querySelector("#pending");
  let pendinglist = document.querySelector(".listPending");

  let isOpen = false; // Mặc định ẩn

  statusPending.addEventListener("click", () => {
    isOpen = !isOpen;

    if (isOpen) {
      pendingIcon.classList.remove("rote-0");
      pendingIcon.classList.add("rote-90");
      renderPending(); 
    } else {
      pendingIcon.classList.remove("rote-90");
      pendingIcon.classList.add("rote-0");
      pendinglist.innerHTML = ""; // Ẩn danh sách
    }
  });
}

function renderDone() {
  let Done = document.querySelector("#done");
  let listPending = document.querySelector(".listDone");
  Done.addEventListener("click", function () {
    Done.classList.toggle("tranform");

    // Nếu danh sách đang hiển thị -> Ẩn nó
    if (listPending.innerHTML.trim() !== "") {
      listPending.innerHTML = "";
      return; // Dừng hàm ngay sau khi ẩn
    }

    // Nếu danh sách đang ẩn -> Hiển thị lại
    listPending.innerHTML = tasks
      .filter((element) => element.status === "Done")
      .map(
        (element) => `
             <div class="task-row">
                <div class="cell task-name">${element.taskName}</div>
                <div class="cell person">${element.nameAssignee}</div>
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
                <div class="cell start-date date">${element.asignDate}</div>
                <div class="cell deadline date">${element.dueDate}</div>
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
                  <button class="edit-btnbtnEdit" data-id=${
                    element.id
                  }>Sửa</button>
                  <button data-id=${
                    element.id
                  } class="delete-btn btnDelete">Xóa</button>
                </div>
             </div>
          `
      )
      .join("");
  });
}

function renderEmployee() {
  let menu = document.querySelector("#menuEmployee");
  let out = document.querySelector("#closeRenderEmployee");
  let btnCloseModalEmployee = document.querySelector("#btnCloseModalEmployee");
  let modalEmployee = document.querySelector("#modalRenderEployee");

  // Mở modal
  menu.addEventListener("click", function () {
    modalEmployee.style.display = "block";
    renderEmployeeList(); // Gọi hàm hiển thị danh sách nhân viên
  });

  // Đóng modal
  out.addEventListener("click", function () {
    modalEmployee.style.display = "none";
  });
  btnCloseModalEmployee.addEventListener("click", function () {
    modalEmployee.style.display = "none";
  });

  // Hàm render danh sách nhân viên
  function renderEmployeeList() {
    let bodyModalEmployee = document.querySelector("#bodyModalEmployee");
    bodyModalEmployee.innerHTML = "";

    console.log("Tất cả thành viên:", members);

    // Lọc ra chỉ những nhân viên có email
    let filteredMembers = members.filter(
      (member) =>
        member.email &&
        member.email.trim() !== "" &&
        member.role &&
        member.role !== "undefined"
    );

    let filteredUser = user.filter(
      (u) => u.fullname && u.fullname.trim() !== ""
    );
    console.log(filteredUser);
    console.log(filteredMembers);

    filteredMembers.forEach((member) => {
      let initials = member.email.slice(0, 2).toUpperCase();
      let bgColor = getRandomRgbColor(); // Gọi màu random 1 lần

      bodyModalEmployee.innerHTML += `
       <div class="containerShowEmployee">
        <div class="listEmployee" id="listEmployeeLeft">
          <div class="avatar" style="background-color: ${bgColor}; color: white;">
            ${initials}
          </div>
          <div style="margin-left: 10px;">
            <p class="nameMembers">${member.nameUser}</p>
            <p class="emailMembers">${member.email}</p>
          </div>
        </div>
        <div id="listEmployeeRigth">
        <input class="inputRole" id="inputRole" value="${member.role}">
        <img class="iconTrash" src="../assets/icons/Trash.png"></img>
        </div>
       </div>
      `;
    });
  }
}
function getRandomRgbColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

renderEmployee();
renderHeader();
renderDone();
renderProgress();
renderPending();
