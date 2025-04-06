let currentPage = 1;
let recordsPerPage = 5;

// Dữ liệu từ localStorage
let allProjects = JSON.parse(localStorage.getItem("projects")) || [];
let users = JSON.parse(localStorage.getItem("user")) || [];
let userLogin = JSON.parse(localStorage.getItem("userLogin")) || [];

// Kiểm tra người dùng đang đăng nhập
let currentUser = users.find(user => user.statur === true);
if (!currentUser) {
  window.location.href = "signIn.html";
}

// Lọc các dự án mà user hiện tại tham gia
let projects = allProjects.filter(project =>
  project.members?.some(member => member.userId === userLogin.idUser)
);

// Đăng xuất
document.querySelector("#out").addEventListener("click", function () {
  let index = users.findIndex(user => user.statur === true);
  if (index !== -1) {
    users[index].statur = false;
    localStorage.setItem("user", JSON.stringify(users));
    window.location.href = "signIn.html";
  }
});

// Lưu lại toàn bộ dữ liệu
function saveAllProjects() {
  localStorage.setItem("projects", JSON.stringify(allProjects));
}

// Render bảng
function renderTable() {
  let tbody = document.querySelector("#tbody");
  tbody.innerHTML = "";

  let start = (currentPage - 1) * recordsPerPage;
  let end = start + recordsPerPage;
  let paginatedItems = projects.slice(start, end);

  paginatedItems.forEach((element, index) => {
    tbody.innerHTML += `
      <tr>
        <td>${element.id}</td>
        <td>${element.projectName}</td>
        <td>
          <div class="btn">
            <button class="btnFix" data-index="${index}">Sửa</button>
            <button class="btnDelete" data-index="${index}">Xoá</button>
            <a href="./detailProject.html?task=${index}" class="btnDetail">Chi Tiết</a>
          </div>
        </td>
      </tr>
    `;
  });

  renderPagination();
}

// Phân trang
function renderPagination() {
  let totalPage = Math.ceil(projects.length / recordsPerPage); // Tổng số trang được chia ra từ mảng object chia cho tổng số phần tử có thể xuất hiện
  let pagesDiv = document.querySelector("#pages");
  pagesDiv.innerHTML = "";

  for (let i = 1; i <= totalPage; i++) {
    let btnNumber = document.createElement("button");
    btnNumber.classList.toggle("btnNumber");
    btnNumber.textContent = i;
    btnNumber.className = i === currentPage ? "active number" : "number";
    btnNumber.addEventListener("click", function () {
      currentPage = i;
      renderTable();
    });
    pagesDiv.appendChild(btnNumber);
  }

  document.querySelector("#btnNext").disabled = currentPage === totalPage;
  document.querySelector("#btnPrev").disabled = currentPage === 1;
}

// Chuyển trang
document.querySelector("#btnPrev")?.addEventListener("click", function () {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
});
document.querySelector("#btnNext")?.addEventListener("click", function () {
  if (currentPage < Math.ceil(projects.length / recordsPerPage)) {
    currentPage++;
    renderTable();
  }
});

// gắn sự kiện cho các link
document.querySelectorAll(".link").forEach(link => {
  link.addEventListener("click", function () {
    link.classList.toggle("activeLink");
  });
});

// Xoá dự án
function deleteProject() {
  let modal = document.querySelector("#modal-container");
  let btnConfirm = document.querySelector("#btnConfirm");
  let btnCancel = document.querySelector(".btnCancel");
  let closeBtn = document.querySelector("#close");
  let deleteIndex = null;

  document.querySelector("#tbody").addEventListener("click", function (event) {
    if (event.target.classList.contains("btnDelete")) {  // contains giúp kiểm tra xem key truyền vào có phải class hay không và trả về giá trị true / false
      deleteIndex = event.target.dataset.index;// lấy địa chỉ của index được nhấn xoá
      modal.style.display = "block";
    }
  });

  btnConfirm.addEventListener("click", function () {
    if (deleteIndex !== null) {
      let deletedProject = projects[deleteIndex];
      let indexInAll = allProjects.findIndex(p => p.id === deletedProject.id);// lấy địa chỉ id của toàn bộ index các phần tử
      if (indexInAll !== -1) {
        allProjects.splice(indexInAll, 1);
      }
      projects.splice(deleteIndex, 1);
      saveAllProjects();
      modal.style.display = "none";
      renderTable();
    }
  });

  btnCancel.addEventListener("click", () => (modal.style.display = "none"));
  closeBtn.addEventListener("click", () => (modal.style.display = "none"));
}

// Thêm / Sửa dự án
function addProject() {
  let modal = document.querySelector("#modalAddContainer");
  let btnAdd = document.querySelector("#btnAdd");
  let btnCancel = document.querySelector("#btnCancel");
  let closeBtn = document.querySelector("#closeProject");
  let btnSave = document.querySelector("#btnSave");
  let error = document.querySelector("#error");
  let editIndex = null;

  btnAdd.addEventListener("click", function () {
    modal.style.display = "block";
    document.querySelector("#nameProject").value = "";
    document.querySelector("#describes").value = "";
    error.textContent = "";
    editIndex = null;
  });

  document.querySelector("#tbody").addEventListener("click", function (event) {
    if (event.target.classList.contains("btnFix")) {
      editIndex = event.target.dataset.index;
      let project = projects[editIndex];
      document.querySelector("#nameProject").value = project.projectName;
      document.querySelector("#describes").value = project.describe;
      error.textContent = "";
      modal.style.display = "block";
    }
  });

  btnCancel.addEventListener("click", () => (modal.style.display = "none"));
  closeBtn.addEventListener("click", () => (modal.style.display = "none"));

  btnSave.addEventListener("click", function () {
    let name = document.querySelector("#nameProject").value.trim();
    let description = document.querySelector("#describes").value.trim();

    if (!name) {
      error.textContent = "Vui lòng nhập tên dự án";
      return;
    }

    if (editIndex !== null) {
      let duplicate = projects.find((p, i) => p.projectName === name && i !== +editIndex);
      if (duplicate) {
        error.textContent = "Tên dự án đã tồn tại";
        return;
      }

      // Cập nhật trong cả allProjects
      let project = projects[editIndex];
      let indexInAll = allProjects.findIndex(p => p.id === project.id);
      if (indexInAll !== -1) {
        allProjects[indexInAll].projectName = name;
        allProjects[indexInAll].describe = description;
        projects[editIndex].projectName = name;
        projects[editIndex].describe = description;
        saveAllProjects();
      }
      modal.style.display = "none";
      renderTable();
    } else {
      let duplicate = allProjects.find(p => p.projectName === name);
      if (duplicate) {
        error.textContent = "Tên dự án đã tồn tại";
        return;
      }

      let newId = allProjects.length ? Math.max(...allProjects.map(p => p.id)) + 1 : 1;

      let newProject = {
        id: newId,
        projectName: name,
        describe: description,
        members: [{ userId: userLogin.idUser, role: "Project owner" }]
      };

      allProjects.push(newProject);
      localStorage.setItem("projects", JSON.stringify(allProjects));

      // Cập nhật danh sách dự án của user đăng nhập
      projects = allProjects.filter(project =>
        project.members?.some(member => member.userId === userLogin.idUser)
      );

      modal.style.display = "none";
      renderTable();
    }
  });
}
function renderFilterProject() {
  const inputSearch = document.querySelector("#inputSearch");

  inputSearch.addEventListener("input", function () {
    const keyword = inputSearch.value.trim().toLowerCase();
    const tbody = document.querySelector("#tbody");
    tbody.innerHTML = "";

    // Nếu không có từ khoá, render lại toàn bộ
    if (keyword === "") {
      renderTable();
      return;
    }

    // Lọc theo tên dự án (không phân biệt hoa thường)
    let filtered = projects.filter(project =>
      project.projectName.toLowerCase().includes(keyword)
    );

    filtered.forEach((element, index) => {
      let originalIndex = projects.findIndex(p => p.id === element.id);
      tbody.innerHTML += `
        <tr>
          <td>${element.id}</td>
          <td>${element.projectName}</td>
          <td>
            <div class="btn">
              <button class="btnFix" data-index="${originalIndex}">Sửa</button>
              <button class="btnDelete" data-index="${originalIndex}">Xoá</button>
              <a href="./detailProject.html?task=${originalIndex}" class="btnDetail">Chi Tiết</a>
            </div>
          </td>
        </tr>
      `;
    });
  });
}

renderTable();
addProject();
deleteProject();
renderFilterProject();
