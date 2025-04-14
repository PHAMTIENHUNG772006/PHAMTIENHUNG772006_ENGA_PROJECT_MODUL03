let users = JSON.parse(localStorage.getItem("user")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let projects = JSON.parse(localStorage.getItem("projects")) || [];
let userLogin = JSON.parse(localStorage.getItem("userLogin")) || {};
let currentProject = 0;

// Kiểm tra đăng nhập
let currentUser = userLogin;
if (currentUser.statur === false) {
  window.location.href = "signIn.html";
}
document.addEventListener("DOMContentLoaded", function () {
  renderAllMyTask();
  sortTask();
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
//sự kiện của
let icon = document.querySelectorAll(".icon");
icon.forEach((icon) => {
  icon.addEventListener("click", function () {
    icon.classList.toggle("tranform");
  });
});

// Lọc task của user
let myTasks = tasks.filter((task) => task.assigneeId === userLogin.idUser);
let myProject = [];

// Gom nhóm task theo từng project
myTasks.forEach((task) => {
  let project = projects.find((p) => p.id === task.projectId);
  if (project) {
    let existed = myProject.find((p) => p.projectId === project.id);
    if (!existed) {
      myProject.push({
        projectId: project.id,
        nameProject: project.projectName,
        tasks: [],
      });
    }
    let projectObj = myProject.find((p) => p.projectId === project.id);
    projectObj.tasks.push(task);
  }
});

// Lưu vào localStorage nếu cần
localStorage.setItem("myProject", JSON.stringify(myProject));

// Render bảng
function renderAllMyTask() {
  let listTable = document.querySelector("#listTable");
  listTable.innerHTML = "";

  myProject.forEach((element) => {
    listTable.innerHTML += `
    <tbody class="project-group">
      <tr class="section-header">
        <td colspan="6">
          <div class="headerList">
            <img class="icon toggle-icon" src="../assets/icons/Triangle.png" alt="">
            <p class="nameList">${element.nameProject}</p>
          </div>
        </td>
      </tr>
    </tbody>
    <tbody class="hidden tbody tableTask">
      ${element.tasks.map((task) => `
        <tr>
          <td>${task.taskName}</td>
          <td><span class="badge ${getPriorityClass(task.priority)}">${task.priority}</span></td>
          <td>
            <div class="iconEditDiv">
              <div class="stasur">${task.status}</div>
              <div><img class="icon iconStatur" onclick="handleEditStatur(${
            task.id
          })" src="../assets/icons/edit-icon.png" alt=""></div>
            </div>
          </td>
          <td class="date">${task.asignDate}</td>
          <td class="date">${task.dueDate}</td>
          <td><span class="badge ${getStatusClass(task.progress)}">${task.progress}</span></td>
        </tr>
      `).join("")}
    </tbody>
  `;
  });

}


// Lấy màu sắc cho độ ưu tiên
function getPriorityClass(priority) {
  return priority === "Thấp"
    ? "badge-low"
    : priority === "Trung bình"
    ? "badge-medium"
    : priority === "Cao"
    ? "badge-high"
    : "";
}

// Lấy màu sắc cho trạng thái
function getStatusClass(progress) {
  return progress === "Đúng tiến độ"
    ? "badge-done"
    : progress === "Có rủi ro"
    ? "badge-medium"
    : progress === "Trễ hạn"
    ? "badge-high"
    : "";
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




function sortTask() {
  let sortFilterId = document.querySelector("#sortFilters");
  sortFilterId.addEventListener("change", function () {
    let sortFilterValue = sortFilterId.value;

    if (sortFilterValue === "priority") {
      myProject.forEach((project) => {
        project.tasks.sort((a, b) => {
          const priorityValue = {
            "Thấp": 1,
            "Trung bình": 2,
            "Cao": 3,
          };
          return priorityValue[b.priority] - priorityValue[a.priority];
        });
      });
      renderAllMyTask();
    }

    if (sortFilterValue === "date") {
      myProject.forEach((project) => {
        project.tasks.sort((a, b) => {
          let dateA = new Date(convertToInputDate(a.dueDate));
          let dateB = new Date(convertToInputDate(b.dueDate));
          return dateB - dateA;
        });
      });
      renderAllMyTask();
    }
  });
}

sortTask();


searchTask();
function searchTask() {
  let inputSearch = document.querySelector("#inputSearch");
  let listTable = document.querySelector("#listTable");

  inputSearch.addEventListener("input", function () {
    let keyword = inputSearch.value.trim().toLowerCase();
    listTable.innerHTML = "";

    if (keyword === "") {
      renderAllMyTask();
      return;
    }

    // Lọc task theo keyword
    let filtered = myTasks.filter((task) => {
      return (
        task.taskName.toLowerCase().includes(keyword) &&
        task.assigneeId === userLogin.idUser
      );
    });
    console.log(filtered);
    

    if (filtered.length === 0) {
      listTable.innerHTML =
        `<tr><td id="red"  colspan ='6'>Không tìm thấy kết quả</td></tr>`;
      return;
    }

    // Gom nhóm theo project
    let groupedByProject = {};
    filtered.forEach((task) => {
      if (!groupedByProject[task.projectId]) {
        groupedByProject[task.projectId] = [];
      }
      groupedByProject[task.projectId].push(task);
    });
   

    // Render theo từng nhóm project
    for (let projectId in groupedByProject) {
     
      let project = projects.find((p) => p.id === projectId);
     
      let projectName = project ? project.projectName : "Dự án không xác định";

      listTable.innerHTML += `
        <tbody class="project-group">
          <tr class="section-header">
            <td colspan="6">
              <div class="headerList">
                <img class="icon toggle-icon" src="../assets/icons/Triangle.png" alt="">
                <p class="nameList">${projectName}</p>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody class="hidden tbody tableTask">
          ${groupedByProject[projectId]
            .map(
              (task) => `
              <tr>
                <td>${task.taskName}</td>
                <td>${task.nameAssignee}</td>
                <td><span class="badge ${getPriorityClass(task.priority)}">${task.priority}</span></td>
                <td class="date">${task.asignDate}</td>
                <td class="date">${task.dueDate}</td>
                <td><span class="badge ${getStatusClass(task.progress)}">${task.progress}</span></td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      `;
    }

    // Thêm toggle cho icon sau khi render
    let icons = document.querySelectorAll(".toggle-icon");
    icons.forEach((icon) => {
      icon.addEventListener("click", function () {
        icon.classList.toggle("tranform");
        const tbodyTask = icon.closest("tbody").nextElementSibling;
        tbodyTask.classList.toggle("hidden");
      });
    });
  });
}
function handleEditStatur(id){
  let modalEdit = document.querySelector("#modalEditStatur"); // chỉ chọn 1 modal
  modalEdit.style.display = "block";
  let btnSave = document.querySelector(".btnConfirmTask");
  let btnCancel = document.querySelector(".btnCancel");
  let closeModalEditStatur = document.querySelector("#closeModalEditStatur");
  btnSave.addEventListener("click",function(){
    modalEdit.style.display = "none";
  });
  btnCancel.addEventListener("click",function(){
    modalEdit.style.display = "none";
  });
  closeModalEditStatur.addEventListener("click",function(){
    modalEdit.style.display = "none";
  });
}

