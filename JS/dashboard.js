let currentPage = 1;
let recordsPerPage = 5;


// Fix: sử lí dữ liệu từ kiểu JSON thành mảng
let projectLocal = JSON.parse(localStorage.getItem("projects")) || [];
let projects = JSON.parse(localStorage.getItem("projects")) || [];
let user = JSON.parse(localStorage.getItem("user")) || [];
// Xác định người dùng đang đăng nhập
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

// Hàm lưu dữ liệu lên trên local
function saveLocalStorage(){
  localStorage.setItem("projects", JSON.stringify(projects)); 
};

// Hàm hiển thị bảng dữ liệu
function renderTable() {
  let tbody = document.querySelector("#tbody");
  tbody.innerHTML = ""; // dọn không bị lấy lại giá trị cột cũ

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
                    <button class="btnFix" id="btnFix">Sửa</button>
                    <button class="btnDelete" id="btnDelete">Xoá</button>
                    <a href="./detailProject.html?task=${index}" class="btnDetail">Chi Tiết</a>
                </div>
            </td>
        </tr>
        `;
  });
  addProject();
  deleteProject();
  renderPagination();
}

// hàm phân trang thêm các số trang
function renderPagination() {
  let totalPage = Math.ceil(projects.length / recordsPerPage);
  let pagesDiv = document.querySelector("#pages");
  pagesDiv.innerHTML = "";

  for (let i = 1; i <= totalPage; i++) {
    let btn = document.createElement("button");
    btn.textContent = i;
    btn.className = i === currentPage ? "active number" : "number";
    btn.addEventListener("click", function () {
      currentPage = i;// khởi tạo phân trang ô đầu tiên khi có dữ liệu là 1
      renderTable();
    });
    pagesDiv.appendChild(btn);
  }

  // Fix: Ensure buttons exist before modifying them
  let btnNext = document.querySelector("#btnNext");
  let btnPrev = document.querySelector("#btnPrev");

  if (btnNext && btnPrev) {
    btnNext.disabled = currentPage === totalPage;
    btnPrev.disabled = currentPage === 1;
  }
}
// khu vực để chuyển trang table
let btnPrev = document.querySelector("#btnPrev");
let btnNext = document.querySelector("#btnNext");
if (btnPrev) {
  btnPrev.addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  });
}

if (btnNext) {
  btnNext.addEventListener("click", function () {
    if (currentPage < Math.ceil(projects.length / recordsPerPage)) {
      currentPage++;
      renderTable();
    }
  });
}

// thẻ
let links = document.querySelectorAll(".link");
links.forEach(link => {
  link.addEventListener("click", function() {
    link.classList.toggle("active");
  });
});
// đẩy dữ liệu ra ngoài màn hình
renderTable();



// xoá dữ liệu cột
function deleteProject() {
  let modal = document.querySelector("#modal-container");
  let btnDelete = document.querySelectorAll(".btnDelete");
  let btnConfirm = document.querySelector("#btnConfirm");
  let btnCancel = document.querySelector(".btnCancel");
  let closeBtn = document.querySelector("#close");

  let deleteIndex = null; // Biến lưu index của phần tử cần xoá

  btnDelete.forEach((btn, index) => {
    btn.addEventListener("click", function () {
      deleteIndex = index; // Lưu lại index của phần tử cần xoá
      modal.style.display = "block";
    });
  });

  // Xử lý khi xác nhận xoá
  btnConfirm.addEventListener("click", function () {
    if (deleteIndex !== null) {
      projects.splice(deleteIndex, 1); // Xoá phần tử khỏi mảng
      saveLocalStorage(); // Cập nhật lại localStorage
      modal.style.display = "none";
      renderTable(); // Render lại bảng
      deleteIndex = null; // Reset lại chỉ số xoá để tránh lỗi
    }
  });

  // Xử lý khi huỷ bỏ xoá
  btnCancel.addEventListener("click", function () {
    modal.style.display = "none";
  });
  // khi nhấn icon close sẽ đóng modal
  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });
}
// Hàm sửa dự án
function addProject(){
  let modal = document.querySelector("#modalAddContainer");
  let btnAdd = document.querySelector("#btnAdd");
  let btnCancel = document.querySelector("#btnCancel");
  let closeBtn = document.querySelector("#closeProject");
  let btnFix = document.querySelectorAll(".btnFix");
  let error = document.querySelector("#error");
  let addIndex = null;

  btnAdd.addEventListener("click",function(){
    modal.style.display = "block";
  });

  btnFix.forEach((btn, index) => {
    btn.addEventListener("click", function () {
      addIndex = index; // Lưu lại index của phần tử cần xoá
      modal.style.display = "block";
    });
  });

  btnCancel.addEventListener("click", function () {
    modal.style.display = "none";
  });

  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });
  document.querySelector("#btnSave").addEventListener("click", function () {
    let nameProject = document.querySelector("#nameProject").value.trim();
    let describes = document.querySelector("#describes").value.trim();

    let findCategory = projects.find((element ) => element.projectName === nameProject);

    if (findCategory) {
      error.textContent = "Tên danh mục đã tồn tại";
    } else {
      error.textContent = "";
      let newProject = {
        id: projects.length + 1,
        projectName: nameProject,
        describe: describes,
        members: [{ userId: projects.length + 1, role: "" }]
      }
      projects.push(newProject);
      saveLocalStorage();
      modal.style.display = "none";
      renderTable();
    }
  });
}

renderTable();