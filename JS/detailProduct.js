document.addEventListener("DOMContentLoaded", function () {
  renderAll();
  renderAssigneeOptions(members);
  handleEditTask();
  sortTask();
  addEmployee();
  setupToggleEvents(); // hàm mới bạn tách ở trên
});
// Đăng xuất
let out = document.querySelector("#out");
out.addEventListener("click", function () {
  userLogin.statur = false;// cập nhật trạng thái nếu như đăng xuất
  if (userLogin.statur === false) {
    window.location.href = "signIn.html";
  }
  localStorage.setItem("userLogin", JSON.stringify(userLogin));
});

// Trang thái hiển thị danh sách các task trong dự án
let sectionState = {
  "To do": false,
  "In progress": false,
  Pending: false,
  Done: false,
};

let projectLocal = JSON.parse(localStorage.getItem("projects")) || [];
let projectId = parseInt(window.location.search.split("?task=")[1]); //  lấy địa chỉ của danh mục dụ án
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let users = JSON.parse(localStorage.getItem("user")) || [];
let userLogin = JSON.parse(localStorage.getItem("userLogin")) || [];
// Kiểm tra người dùng đang đăng nhập
let currentUser = userLogin;
if (currentUser.statur === false) {
  window.location.href = "signIn.html";
}


let members = projectLocal[projectId].members; // lấy mảng members từ mảng projet

// gắn sự kiện cho các link
document.querySelectorAll(".link").forEach((link) => {
  link.addEventListener("click", function () {
    link.classList.toggle("active");
  });
});
let icon = document.querySelectorAll(".icon");
icon.forEach((icon) => {
  icon.addEventListener("click", function () {
    icon.classList.toggle("tranform");
  });
});

// Gán sự kiện cho các icon để mở/đóng danh sách task
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
console.log(projectLocal[projectId].id);

// Hàm render danh sách task theo trạng thái
function renderTaskList(status, listElement) {
  listElement.innerHTML = "";
  let filteredTasks = tasks.filter(
    (t) => t.status === status && t.projectId === projectLocal[projectId].id
  );
  filteredTasks.forEach((task) => {
    let tr = document.createElement("tr");
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
          <button onclick="handleEditTask(${
            task.id
          })" class="btn-edit">Sửa</button>
          <button onclick="handleDelete(${
            task.id
          })" class="btn-delete btnDeleteTask">Xoá</button>
        </div>
      </td>
    `;
    listElement.appendChild(tr);
  });
}

// Hàm hiển thị tên dự án, mô tả và tên người chủ dự án
function renderHeader() {
  let nameProject = document.querySelector("#nameProject");
  let describe = document.querySelector("#describe");
  let projectOwner = document.querySelector("#name");
  let logoName = document.querySelector("#logoName");
  let logoProjectOwner = userLogin.fullname.slice(0, 2).toUpperCase();
  logoName.innerHTML = `<h2 class="avatar">${logoProjectOwner}</h2>`;
  nameProject.textContent = `${projectLocal[projectId].projectName}`; // projectId là id của dự án cũng như là id của chủ dự án
  describe.textContent = `${projectLocal[projectId].describe}`;
  projectOwner.textContent = `${userLogin.fullname}`;
}

//  THÊM TASK VÀO TRONG BẢNG
let btnAddTask = document.querySelector("#btnAddTask");
let modalAddEdit = document.querySelector("#modalAddEditTask");
let btnSave = document.querySelector("#btnSaveTask");
let btnCancel = document.querySelector("#btnCancel");
let closeProject = document.querySelector("#closeProject");

btnAddTask.addEventListener("click", function () {
  modalAddEdit.style.display = "block";
  // XÓA TOÀN BỘ GIÁ TRỊ INPUT KHI MỞ LẠI FORM
  resetForm();

  // XÓA TOÀN BỘ LỖI
  document.querySelectorAll(".red").forEach((e) => (e.textContent = ""));

  btnSave.addEventListener("click", function () {
    let nameTask = document.querySelector("#task-name").value.trim();
    let assignee = document.querySelector("#assignee").value;
    let status = document.querySelector("#status").value;
    let startdate = document.querySelector("#startDate").value;
    let duedate = document.querySelector("#duedate").value;
    let priority = document.querySelector("#priority").value;
    let progress = document.querySelector("#progressTasks").value;

    let convertStartDate = startdate
      ? new Date(startdate).toLocaleDateString("vi-VN") // Chuyển đổi ngày tháng về dd/mm/yy
      : "";
    let convertDueDate = duedate
      ? new Date(duedate).toLocaleDateString("vi-VN") // Chuyển đổi ngày tháng về dd/mm/yy
      : "";
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
    } else if (nameTask.length < 5 || nameTask.length > 50) {
      errName.textContent = "Số lượng kí tự của bạn không đủ hoặc quá lớn";
      errName.classList.add("red");
    }
    let isDuplicate = tasks.some(
      (task) => task.taskName.toLowerCase() === nameTask.toLowerCase() 
    );
    if (isDuplicate) {
      errName.textContent = "Tên task đã tồn tại";
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

      let today = new Date();
      today.setHours(0, 0, 0, 0);
      if (start > end) {
        errStart.textContent = "Ngày bắt đầu phải trước ngày kết thúc";
        errStart.classList = "red";
        isValid = false;
      } else if (start < today) {
        errStart.textContent =
          "Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại";
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
        : ""; // lấy giá trị của tiến  độ để tiến hành sắp xếp

    let userData = users.find((u) => u.fullname === assignee);
    let assigneeId = userData?.id || null;

    if (
      !nameTask ||
      !assignee ||
      !status ||
      !startdate ||
      !duedate ||
      !priority ||
      !progress ||
      !assigneeId
    )
      return;

    let newTask = {
      id: Math.ceil(Math.random() * 10000),
      taskName: nameTask,
      nameAssignee: assignee,
      assigneeId,
      projectId: projectLocal[projectId].id,
      projectName: projectLocal[projectId].projectName,
      status,
      asignDate: convertStartDate,
      dueDate: convertDueDate,
      priority,
      progress,
      numbersTask,
    };

    tasks.push(newTask);
    console.log(tasks);
    
    localStorage.setItem("tasks", JSON.stringify(tasks));
    //reset lại giá trị ở các ô input trong form
    resetForm();
    modalAddEdit.style.display = "none";
    refreshRenderedSections();
  });
});

closeProject.addEventListener("click", function () {
  modalAddEdit.style.display = "none";
});

btnCancel.addEventListener("click", function () {
  modalAddEdit.style.display = "none";
});
function resetForm() {
  document.querySelector("#task-name").value = "";
  document.querySelector("#assignee").value = "";
  document.querySelector("#status").value = "";
  document.querySelector("#startDate").value = "";
  document.querySelector("#duedate").value = "";
  document.querySelector("#priority").value = "";
  document.querySelector("#progressTasks").value = "";
  document.querySelectorAll(".red").forEach((e) => (e.textContent = ""));
}

// Xóa task
function handleDelete(id) {
  let modalDelete = document.querySelector("#modalDelete");
  let btnConfirmTask = document.querySelector("#btnConfirm");
  let btnCancelTask = document.querySelector("#btnCancelTask");
  let closeModalDeleteTask = document.querySelector("#closeModalEditStatur");
  const taskLocals = JSON.parse(localStorage.getItem("tasks")) || [];
  modalDelete.style.display = "block";
  btnConfirmTask.addEventListener("click", function () {
    if (id) {
      // Tìm task trong mảng tasks
      const filterTasks = taskLocals.filter((task) => task.id !== id);

      // Lưu dữ liệu lên local
      localStorage.setItem("tasks", JSON.stringify(filterTasks));

      // Cập nhật biến tasks toàn cục
      tasks = filterTasks;

      // Cập nhật giao diện
      refreshRenderedSections();
      modalDelete.style.display = "none";
    }
  });
  closeModalDeleteTask.addEventListener("click", function () {
    modalDelete.style.display = "none";
  });

  btnCancelTask.addEventListener("click", function () {
    modalDelete.style.display = "none";
  });
}
/**
 * Hàm có nhiệm vụ xoá task
 * @param {*} id là địa chỉ của task cần xoá thông qua id
 * @returns trả về địa chỉ id của task cần xoá
 * Author : Phạm Tiến Hưng
 */
function handleEditTask(id) {
  let btnSaveTask = document.querySelector("#btnSaveTask");
  let modalAddEdit = document.querySelector("#modalAddEditTask");
  let task = tasks.find((t) => t.id === id);
  if (!task) return;

  modalAddEdit.style.display = "block";

  // Gán dữ liệu cũ vào form
  document.querySelector("#task-name").value = task.taskName;
  document.querySelector("#assignee").value = task.nameAssignee;
  document.querySelector("#status").value = task.status;
  document.querySelector("#startDate").value = convertToInputDate(
    task.asignDate
  );
  document.querySelector("#duedate").value = convertToInputDate(task.dueDate);
  document.querySelector("#priority").value = task.priority;
  document.querySelector("#progressTasks").value = task.progress;

  // Gỡ các sự kiện trước đó nếu có
  let newBtnSave = btnSaveTask.cloneNode(true);
  btnSaveTask.parentNode.replaceChild(newBtnSave, btnSaveTask);

  newBtnSave.addEventListener("click", function () {
    // Lấy input
    let taskName = document.querySelector("#task-name").value.trim();
    let nameAssignee = document.querySelector("#assignee").value;
    let status = document.querySelector("#status").value;
    let startDate = document.querySelector("#startDate").value;
    let dueDate = document.querySelector("#duedate").value;
    let priority = document.querySelector("#priority").value;
    let progress = document.querySelector("#progressTasks").value;

    // Lấy phần tử hiển thị lỗi
    let errName = document.querySelector("#error-task-name");
    let errStart = document.querySelector("#error-startdate");
    let errDue = document.querySelector("#error-duedate");
    let errPriority = document.querySelector("#error-priority");
    let errProgress = document.querySelector("#error-progress");
    let errStatus = document.querySelector("#error-status");
    let errAssignee = document.querySelector("#error-assignee"); // thêm nếu chưa có trong HTML

    // Reset lỗi
    [
      errName,
      errStart,
      errDue,
      errPriority,
      errProgress,
      errStatus,
      errAssignee,
    ].forEach((e) => {
      if (e) {
        e.textContent = "";
        e.classList.remove("red");
      }
    });

    let isValid = true;

    if (!taskName) {
      errName.textContent = "Vui lòng nhập tên task";
      errName.classList.add("red");
      isValid = false;
    } else if (taskName.length < 5 || taskName.length > 50) {
      errName.textContent = "Số lượng kí tự của bạn không đủ hoặc quá lớn";
      errName.classList.add("red");
    }

    if (!nameAssignee) {
      errAssignee.textContent = "Vui lòng chọn người được giao";
      errAssignee.classList.add("red");
      isValid = false;
    }

    if (!startDate) {
      errStart.textContent = "Vui lòng chọn ngày bắt đầu";
      errStart.classList.add("red");
      isValid = false;
    }

    if (!dueDate) {
      errDue.textContent = "Vui lòng chọn ngày kết thúc";
      errDue.classList.add("red");
      isValid = false;
    }

    if (startDate && dueDate && new Date(startDate) > new Date(dueDate)) {
      errStart.textContent = "Ngày bắt đầu phải trước ngày kết thúc";
      errStart.classList.add("red");
      isValid = false;
    }

    if (!priority) {
      errPriority.textContent = "Vui lòng chọn độ ưu tiên";
      errPriority.classList.add("red");
      isValid = false;
    }

    if (!progress) {
      errProgress.textContent = "Vui lòng chọn tiến độ";
      errProgress.classList.add("red");
      isValid = false;
    }

    if (!status) {
      errStatus.textContent = "Vui lòng chọn trạng thái";
      errStatus.classList.add("red");
      isValid = false;
    }

    // Kiểm tra trùng tên task (trừ task hiện tại)
    let duplicate = tasks.find(
      (t) => t.taskName === taskName && t.id !== task.id
    );
    if (duplicate) {
      errName.textContent = "Tên task đã tồn tại";
      errName.classList.add("red");
      isValid = false;
    }

    if (!isValid) return;

    // Cập nhật lại task
    task.taskName = taskName;
    task.nameAssignee = nameAssignee;
    task.status = status;
    task.asignDate = new Date(startDate).toLocaleDateString("vi-VN");
    task.dueDate = new Date(dueDate).toLocaleDateString("vi-VN");
    task.priority = priority;
    task.progress = progress;
    task.numbersTask =
      priority === "Thấp" ? 1 : priority === "Trung bình" ? 2 : 3;
    [
      errName,
      errStart,
      errDue,
      errPriority,
      errProgress,
      errStatus,
      errAssignee,
    ].forEach((e) => {
      if (e) {
        e.textContent = "";
        e.classList.remove("red");
      }
    });
    [
      taskName,
      nameAssignee,
      status,
      startDate,
      dueDate,
      priority,
      progress,
    ].forEach((task) => {
      if (task) {
        task.textContent = "";
      }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    modalAddEdit.style.display = "none";
    refreshRenderedSections();
  });
}

let currentEditIndex = null;

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
    refreshRenderedSections();
  }
});

// Lấy danh sách các task từ localStorage
function toggleList(status, listId) {
  let list = document.querySelector(listId);
  if (list.style.display === "table-row-group") {
    list.style.display = "none";
    sectionState[status] = false;
  } else {
    list.style.display = "table-row-group";
    sectionState[status] = true;
    renderTaskList(status, list);
  }
  localStorage.setItem("sectionState", JSON.stringify(sectionState));
}
// Hàm hiển thị danh sách task theo trạng thái
function refreshRenderedSections() {
  Object.entries(sectionState).forEach(([status, isOpen]) => {
    const listId =
      status === "To do"
        ? "#listTodo"
        : status === "In progress"
        ? "#listProgress"
        : status === "Pending"
        ? "#listPending"
        : "#listDone";

    const list = document.querySelector(listId);
    if (isOpen) {
      list.style.display = "table-row-group";
      renderTaskList(status, list);
    } else {
      list.style.display = "none";
    }
  });
}

// Lấy màu sắc cho độ ưu tiên
function getPriorityClass(priority) {
  return priority === "Thấp"
    ? "badge-low"
    : priority === "Trung bình"
    ? "badge-medium"
    : priority === "Cao"
    ? "badge-hight"
    : "";
}

// Lấy màu sắc cho trạng thái
function getStatusClass(progress) {
  return progress === "Đúng tiến độ"
    ? "badge-done"
    : progress === "Có rủi ro"
    ? "badge-medium"
    : progress === "Trễ hạn"
    ? "badge-hight"
    : "";
}

// Hàm render danh sách nhân viên vào select
function renderAssigneeOptions(members) {
  const select = document.querySelector("#assignee");
  select.innerHTML = '<option value="">-- Chọn nhân viên --</option>';

  members.forEach((member) => {
    let userfilter = users.find((u) => u.email === member.email);
    let name = userfilter ? userfilter.fullname : member.email;
    let option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });
}

// Render toàn bộ mảng dữ theo điều kiện
function renderAll() {
  renderAssigneeOptions(members);
  renderEmployee();
  renderHeader();
  refreshRenderedSections();
}
/**
 * Hàm chuyển năm tháng ngày về ngày tháng năm để render ra theo cấu trúc bài
 * @param {*} dateStr tham số của hàm
 * @returns trả về yy/mm/dd để đẩy lên form sửa
 */
function convertToInputDate(dateStr) {
  let [day, month, year] = dateStr.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}
// Hàm sắp xếp danh sách task theo độ ưu tiên hoặc ngày
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
searchTask();
function searchTask() {
  let inputSearch = document.querySelector("#inputSearch");

  // Các danh sách task theo status
  let listToDo = document.querySelector("#listTodo");
  let listInProgress = document.querySelector("#listProgress");
  let listPending = document.querySelector("#listPending");
  let listDone = document.querySelector("#listDone");

  inputSearch.addEventListener("input", function () {
    let keyword = inputSearch.value.trim().toLowerCase();

    // Nếu không nhập gì, render lại toàn bộ
    if (keyword === "") {
      refreshRenderedSections(); // gọi lại hàm render đầy đủ
      return;
    }

    // Clear tất cả các danh sách trước khi render mới
    listToDo.innerHTML = "";
    listInProgress.innerHTML = "";
    listPending.innerHTML = "";
    listDone.innerHTML = "";

    // Lọc ra các task phù hợp với từ khoá
    let filtered = tasks.filter((task) => {
      return (
        task.taskName.toLowerCase().includes(keyword) ||
        task.nameAssignee.toLowerCase().includes(keyword) ||
        task.status.toLowerCase().includes(keyword) ||
        task.priority.toLowerCase().includes(keyword) ||
        task.progress.toLowerCase().includes(keyword)
      );
    });

    // Nếu không tìm thấy gì
    if (filtered.length === 0) {
      [listToDo, listInProgress, listPending, listDone].forEach((list) => {
        list.innerHTML = `<tr><td colspan="7">Không tìm thấy task phù hợp</td></tr>`;
      });
      return;
    }

    // Render các task tìm được vào đúng list theo status
    filtered.forEach((task) => {
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
            <button onclick="handleEditTask(${
              task.id
            })" class="btn-edit">Sửa</button>
            <button onclick="handleDelete(${
              task.id
            })" class="btn-delete btnDeleteTask">Xoá</button>
          </div>
        </td>
      `;

      // Đưa task vào đúng danh sách theo status
      switch (task.status) {
        case "To do":
          listToDo.appendChild(tr);
          break;
        case "In Progress":
          listInProgress.appendChild(tr);
          break;
        case "Pending":
          listPending.appendChild(tr);
          break;
        case "Done":
          listDone.appendChild(tr);
          break;
      }
    });
  });
}

function addEmployee() {
  let btnAddemployee = document.querySelector("#btnAddEmployee");
  let modal = document.querySelector("#modalAddEployee");
  let out = document.querySelector("#closeAddProject");
  let btnCancel = document.querySelector("#btnCancelAdd");
  let save = document.querySelector("#btnSave");
  let errorEmail = document.querySelector("#errorEmail");
  let errorRole = document.querySelector("#errorRole");
  let emailInput = document.querySelector("#emailEmployee");
  let roleSelect = document.querySelector("#selectRole");

  btnAddemployee.addEventListener("click", function () {
    errorEmail.textContent = "";
    errorRole.textContent = "";
    modal.style.display = "block";
  });

  out.addEventListener("click", function () {
    modal.style.display = "none";
    emailInput.value = "";
    roleSelect.value = "";
  });

  btnCancel.addEventListener("click", function () {
    modal.style.display = "none";
    emailInput.value = "";
    roleSelect.value = "";
  });
  save.addEventListener("click", function () {
    let emailInput = document.querySelector("#emailEmployee");
    let roleSelect = document.querySelector("#selectRole");
    let email = emailInput.value.trim();
    let role = roleSelect.value;

    let foundUser = users.find((u) => u.email === email);
    let foundMember = members.find((u) => u.email === email);

    //kiểm tra email đủ mạnh hay không
    if (!isValidEmail(email)) {
      errorEmail.style.color = "red";
      errorEmail.textContent = "Email không đúng định dạng";
    }
    if (email.length < 5 || email.length > 50) {
      errorEmail.style.color = "red";
      errorEmail.textContent = "Email của bạn không đủ hoặc quá số lượng kí tự";
    }

    if (foundUser) {
      if (foundMember) {
        errorEmail.textContent = "Thành viên đã có vai trò này trong dự án!";
        errorEmail.style.color = "red";
        emailInput.value = "";
        roleSelect.value = "";
      } else {
        let newEmployee = {
          id: foundUser.id,
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
        errorEmail.textContent = "Thêm nhân viên vào dự án thành công";
        errorEmail.style.color = "green";
        modal.style.display = "none";

        // Reset input
        emailInput.value = "";
        roleSelect.value = "";
      }
    } else {
      errorEmail.textContent = "Thành viên không tồn tại";
      errorEmail.style.color = "red";
    }
  });
}
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|vn)$/;
  return emailRegex.test(email);
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
}

// Hàm render danh sách nhân viên
function renderEmployeeList() {
  let bodyModalEmployee = document.querySelector("#bodyModalEmployee");
  bodyModalEmployee.innerHTML = "";

  // Lọc ra chỉ những nhân viên có email
  let filteredMembers = members.filter(
    (member) =>
      member.email &&
      member.email.trim() !== "" &&
      member.role &&
      member.role !== "undefined"
  );

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
      <select class="selectRoleAgain">
      <option value="Developer">Developer </option>
      <option value="Reviewer">Reviewer</option>
      <option value="Maneger">Maneger</option>
      </select>
      <img class="iconTrash" onclick="handleDeleteMembers(${member.id})"  id="iconTrash" src="../assets/icons/Trash.png"></img>
      </div>
     </div>
    `;
  });
}
// if(members.length > 0){
//   let logoEmployee = document.querySelector("#logoEmployee");
//   let nameEmployee = document.querySelector("#nameEmployee");
//   let roleEmployee = document.querySelector("#roleEmployee");
//   logoEmployee.textContent = members[0].email.slice(0, 2).toUpperCase();
//   nameEmployee.textContent = members[0].nameUser;
//   roleEmployee.textContent = members[0].role;
// }
function handleDeleteMembers(id) {
  let btnSaveModalEmploye = document.querySelector("#btnSaveModalEmploye");
  if (id) {
    let idMemberDelete = id;
    let filterMembersDelete = members.filter((m) => m.id === idMemberDelete);
    members.splice(filterMembersDelete, 1);
    console.log(filterMembersDelete);
    renderEmployeeList();

    btnSaveModalEmploye.addEventListener("click", function () {
      projectLocal[projectId].members = members;
      localStorage.setItem("projects", JSON.stringify(projectLocal));
    });
  }
}

// Hàm tạo màu sắc ngẫu nhiên
function getRandomRgbColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}
