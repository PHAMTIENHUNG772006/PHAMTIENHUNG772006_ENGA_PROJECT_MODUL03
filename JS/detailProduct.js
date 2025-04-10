document.addEventListener("DOMContentLoaded", function () {
  // renderAll();
  handleEditTask();
  addTask();
  sortTask();
  addEmployee();
  setupToggleEvents(); // hàm mới bạn tách ở trên
});

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

function setupToggleEvents() {
  document
    .querySelector("#iconToDo")
    .addEventListener("click", () => toggleList("To do", "#listTodo"));
  document
    .querySelector("#iconProgress")
    .addEventListener("click", () =>
      toggleList("In progress", "#listProgress")
    );
  document
    .querySelector("#iconPending")
    .addEventListener("click", () => toggleList("Pending", "#listPending"));
  document
    .querySelector("#iconDone")
    .addEventListener("click", () => toggleList("Done", "#listDone"));
}

function toggleList(status, listId) {
  let list = document.querySelector(listId);
  if (list.style.display === "table-row-group") {
    list.style.display = "none";
    return;
  }

  list.style.display = "table-row-group";
  list.innerHTML = "";
  const filteredTasks = tasks.filter((t) => t.status === status);

  filteredTasks.forEach((task) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="nameTask">${task.taskName}</td>
      <td>${task.nameAssignee}</td>
      <td><span class="badge ${getPriorityClass(task.priority)}">${
      task.priority
    }</span></td>
      <td class="date">${task.asignDate}</td>
      <td class="date">${task.dueDate}</td>
      <td><span class="badge ${getStatusClass(task.progress)}">${
      task.progress
    }</span></td>
      <td>
        <div class="btnList">
          <button data-id="${task.id}" class="btn-edit">Sửa</button>
          <button onclick="handleDelete(${
            task.id
          }, 'To do')" class="btn-delete btnDeleteTask">Xoá</button>
        </div>
      </td>
    `;
    list.appendChild(tr);
  });
}

// function renderTaskByStatus(statusTask, iconId, listId, taskIdToDelete) {
//   let icon = document.querySelector(iconId);
//   let list = document.querySelector(listId);

//   console.log("icon: ", icon);

//   icon.addEventListener("click", function () {
//     if (list.style.display === "table-row-group") {
//       list.style.display = "none";
//       return;
//     }

//     list.style.display = "table-row-group";
//     list.innerHTML = "";

//     const filteredTasks = tasks.filter((t) => {
//       return t.status === statusTask;
//     });

//     console.log(filteredTasks);

//     filteredTasks.forEach((task) => {
//       const tr = document.createElement("tr");
//       tr.innerHTML = `
//         <td class="nameTask">${task.taskName}</td>
//         <td>${task.nameAssignee}</td>
//         <td><span id="status" class="badge ${getPriorityClass(
//           task.priority
//         )}">${task.priority}</span></td>
//         <td class="date">${task.asignDate}</td>
//         <td class="date">${task.dueDate}</td>
//         <td><span class="badge ${getStatusClass(task.progress)}">${
//         task.progress
//       }</span></td>
//        <td>
//        <div class="btnList">
//          <button data-id="${task.id}" class="btn-edit">Sửa</button>
//          <button onclick="handleDelete(${task.id})" data-id="${
//         task.id
//       }" class="btn-delete btnDeleteTask" id="btnConfirmDelete">Xoá</button>
//        </div>
//        </td>

//       `;
//       list.appendChild(tr);
//     });
//   });
// }

function handleDelete(id, type) {
  const taskLocals = JSON.parse(localStorage.getItem("tasks")) || [];
  console.log(id, type);
  
  if (id) {
    const filterTasks = taskLocals.filter((task) => task.id !== id);

    // Lưu dữ liệu lên local
    localStorage.setItem("tasks", JSON.stringify(filterTasks));

    // Render lại giao diện
    toggleList('Todo', "#listTodo")
  }
}

function getPriorityClass(priority) {
  return priority === "Thấp"
    ? "badge-low"
    : priority === "Trung bình"
    ? "badge-medium"
    : priority === "Cao"
    ? "badge-higth"
    : "";
}

function getStatusClass(progress) {
  return progress === "Đúng tiến độ"
    ? "badge-done"
    : progress === "Có rủi ro"
    ? "badge-medium"
    : progress === "Trễ hạn"
    ? "badge-hight"
    : "";
}

const projectId = parseInt(window.location.search.split("?task=")[1]); //  lấy địa chỉ của danh mục dụ án
let members = projectLocal[projectId].members; // lấy mảng members từ mảng projet

function renderHeader() {
  let nameProject = document.querySelector("#nameProject");
  let describe = document.querySelector("#describe");
  let projectOwner = document.querySelector("#name");
  let logoName = document.querySelector("#logoName");
  let logoEmployee = document.querySelector("#logoEmployee");
  let logoProjectOwner = userLogin.fullname.slice(0, 2).toUpperCase();
  //gán giá trị là tên dự án và cá logo của project owner
  logoName.innerHTML = `<h2 class="avatar">${logoProjectOwner}</h2>`;
  nameProject.textContent = `${projectLocal[projectId].projectName}`; // projectId là id của dự án cũng như là id của chủ dự án
  describe.textContent = `${projectLocal[projectId].describe}`;
  projectOwner.textContent = `${userLogin.fullname}`;
}

function handleEditTask() {
  let taskTable = document.querySelector(".tableTask");
  let modalAddEdit = document.querySelector("#modalAddTask");
  let btnSave = document.querySelector("#btnSave"); // đảm bảo đã lấy đúng nút Save

  let currentEditIndex = null;

  taskTable.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-edit")) {
      let taskEditId = parseInt(e.target.dataset.id);
      let findIndex = tasks.findIndex((element) => element.id === taskEditId);

      if (findIndex !== -1) {
        let task = tasks[findIndex];
        currentEditIndex = findIndex;

        // Hiển thị modal và đổ dữ liệu vào form
        modalAddEdit.style.display = "block";
        document.querySelector("#task-name").value = task.taskName;
        document.querySelector("#assignee").value = task.nameAssignee;
        document.querySelector("#status").value = task.status;
        document.querySelector("#startDate").value = convertToInputDate(
          task.asignDate
        );
        document.querySelector("#duedate").value = convertToInputDate(
          task.dueDate
        );
        document.querySelector("#priority").value = task.priority;
        document.querySelector("#progressTasks").value = task.progress;
      }
    }
  });

  // Gắn 1 lần sự kiện cho btnSave
  btnSave.addEventListener("click", function () {
    if (currentEditIndex !== null) {
      let task = tasks[currentEditIndex];

      task.taskName = document.querySelector("#task-name").value.trim();
      task.nameAssignee = document.querySelector("#assignee").value;
      task.status = document.querySelector("#status").value;
      task.asignDate = new Date(
        document.querySelector("#startDate").value
      ).toLocaleDateString("vi-VN");
      task.dueDate = new Date(
        document.querySelector("#duedate").value
      ).toLocaleDateString("vi-VN");
      task.priority = document.querySelector("#priority").value;
      task.progress = document.querySelector("#progressTasks").value;

      localStorage.setItem("tasks", JSON.stringify(tasks));
      modalAddEdit.style.display = "none";
      currentEditIndex = null;
      renderAll();
    }
  });
}

function convertToInputDate(dateStr) {
  let [day, month, year] = dateStr.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function addTask() {
  let modalAddEdit = document.querySelector("#modalAddTask");
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

    console.log(status.value);

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
      errName.classList = "red";
      isValid = false;
    }

    if (!assignee) {
      errAsignee.textContent = "Vui lòng chọn nhân viên được giao nhiệm vụ";
      errAsignee.classList = "red";
      isValid = false;
    }

    if (!startdate) {
      errStart.textContent = "Vui lòng chọn ngày bắt đầu";
      errStart.classList = "red";
      isValid = false;
    }

    if (!duedate) {
      errDue.textContent = "Vui lòng chọn ngày kết thúc";
      errDue.classList = "red";
      isValid = false;
    }

    if (startdate && duedate) {
      let start = new Date(startdate);
      let end = new Date(duedate);
      if (start > end) {
        errStart.textContent = "Ngày bắt đầu phải trước ngày kết thúc";
        errStart.classList = "red";
        isValid = false;
      }
    }

    if (!priority) {
      errPriority.textContent = "Vui lòng chọn độ ưu tiên";
      errPriority.classList = "red";
      isValid = false;
    }

    if (!progress) {
      errProgress.textContent = "Vui lòng chọn tiến độ";
      errProgress.classList = "red";
      isValid = false;
    }

    if (!status) {
      errStatus.textContent = "Vui lòng chọn trạng thái";
      errStatus.classList = "red";
      isValid = false;
    }

    let numbersTask =
      priority === "Thấp"
        ? 1
        : priority === "Trung bình"
        ? 2
        : priority === "Cao"
        ? 3
        : "";
    console.log(numbersTask);

    if (!isValid) return;
    // Nếu hợp lệ thì tiếp tục thêm task
    let newTask = {
      id: Math.ceil(Math.random() * 10000),
      taskName: nameTask,
      nameAssignee: assignee,
      assigneeId: userLogin.idUser, // địa chỉ của người chủ project
      projectId: projectLocal[projectId].id,
      asignDate: convertStartDate,
      dueDate: convertDueDate,
      priority,
      progress,
      numbersTask,
      status,
    };
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Reset lại giá trị input
    document.querySelector("#task-name").value = "";
    document.querySelector("#startDate").value = "";
    document.querySelector("#duedate").value = "";
    document.querySelector("#priority").value = "";
    document.querySelector("#assignee").value = "";
    document.querySelector("#status").value = "";
    document.querySelector("#progressTasks").value = "";
    modalAddEdit.style.display = "none"; // Đóng modal sau khi thêm task
  });
}

// render toàn bộ mảng dữ theo điều kiện
// function renderAll(taskIdToDelete) {
//   renderTaskByStatus("To do", "#iconToDo", "#listTodo", taskIdToDelete);
//   renderTaskByStatus(
//     "In progress",
//     "#iconProgress",
//     "#listProgress",
//     taskIdToDelete
//   );
//   renderTaskByStatus("Pending", "#iconPending", "#listPending", taskIdToDelete);
//   renderTaskByStatus("Done", "#iconDone", "#listDone", taskIdToDelete);
//   renderAssigneeOptions(members); // hàm đẩy email của các tài khoản khác lên làm nhân viên dự án
//   renderEmployee();
//   renderHeader();
// }

// lưu task lên local
localStorage.setItem("tasks", JSON.stringify(tasks));

function sortTask() {
  let sortFilterId = document.querySelector("#sortFilter");
  sortFilterId.addEventListener("click", function () {
    let sortFilterValue = document.querySelector("#sortFilter").value;
    console.log(sortFilterValue);

    if (sortFilterValue === "priority") {
      tasks.sort((a, b) => a.numbersTask - b.numbersTask);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderAll();
    }
    if (sortFilterValue === "date") {
      tasks.sort((a, b) => {
        let dateA = new Date(convertToInputDate(a.dueDate));
        let dateB = new Date(convertToInputDate(b.dueDate));
        return dateA - dateB;
      });
      renderAll();
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  });
}

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

// sortTask();
// handleEditTask();
// addEmployee();
// addTask();
// renderAll();
