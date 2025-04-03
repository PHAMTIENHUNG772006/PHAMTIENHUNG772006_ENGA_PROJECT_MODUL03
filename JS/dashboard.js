let currentPage = 1;
let recordsPerPage = 5;


let projectLocal = JSON.parse(localStorage.getItem("projects")) || [];
let user = JSON.parse(localStorage.getItem("user")) || [];

let projects = [
  {
    id: 1,
    projectName: "Xây dựng website thương mại điện tử",
    describe: "Dự án phát triển một nền tảng thương mại điện tử giúp doanh nghiệp bán hàng trực tuyến.",
    members: [{ userId: 1, role: "Owner" }]
  },
  {
    id: 2,
    projectName: "Phát triển ứng dụng di động",
    describe: "Dự án tạo ra một ứng dụng di động đa nền tảng giúp người dùng tiếp cận dịch vụ tiện ích nhanh chóng.",
    members: [{ userId: 2, role: "Dev" }]
  },
  {
    id: 3,
    projectName: "Quản lý dữ liệu khách hàng",
    describe: "Dự án xây dựng hệ thống lưu trữ và quản lý thông tin khách hàng hiệu quả.",
    members: [{ userId: 3, role: "Tester" }]
  },
  {
    id: 4,
    projectName: "Xây dựng website thương mại điện tử",
    describe: "Dự án phát triển một website thương mại điện tử chuyên nghiệp với giao diện thân thiện.",
    members: [{ userId: 4, role: "Designer" }]
  },
  {
    id: 5,
    projectName: "Phát triển ứng dụng di động",
    describe: "Ứng dụng di động hỗ trợ các chức năng tiện ích và nâng cao trải nghiệm người dùng.",
    members: [{ userId: 5, role: "Manager" }]
  },
  {
    id: 6,
    projectName: "Quản lý dữ liệu khách hàng",
    describe: "Hệ thống giúp doanh nghiệp quản lý thông tin khách hàng chính xác và bảo mật.",
    members: [{ userId: 6, role: "Support" }]
  },
  {
    id: 7,
    projectName: "Quản lý dữ liệu khách hàng",
    describe: "Hệ thống giúp doanh nghiệp quản lý thông tin khách hàng chính xác và bảo mật.",
    members: [{ userId: 6, role: "Support" }]
  },
  {
    id: 8,
    projectName: "Quản lý dữ liệu khách hàng",
    describe: "Hệ thống giúp doanh nghiệp quản lý thông tin khách hàng chính xác và bảo mật.",
    members: [{ userId: 6, role: "Support" }]
  },
  {
    id: 9,
    projectName: "Quản lý dữ liệu khách hàng",
    describe: "Hệ thống giúp doanh nghiệp quản lý thông tin khách hàng chính xác và bảo mật.",
    members: [{ userId: 6, role: "Support" }]
  },
  {
    id: 10,
    projectName: "Quản lý dữ liệu khách hàng",
    describe: "Hệ thống giúp doanh nghiệp quản lý thông tin khách hàng chính xác và bảo mật.",
    members: [{ userId: 6, role: "Support" }]
  },
];

// Fix: sử lí dữ liệu từ kiểu JSON thành mảng
localStorage.setItem("projects", JSON.stringify(projects));
let out = document.querySelector("#out").addEventListener("click",function(){
  user[0].statur = false;
  localStorage.setItem("user",JSON.stringify(user));
})
// Tìm kiếm xem có đang ở trạng thái đăng nhập hay không
if (!user || user[0].statur == false) {
  window.location.href = "signIn.html";
}



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
                    <button class="btnFix">Sửa</button>
                    <button class="btnDelete" id="btnDelete">Xoá</button>
                    <a href="./detailProject.html?task=${index}" class="btnDetail">Chi Tiết</a>
                </div>
            </td>
        </tr>
        `;
  });

  renderPagination();
  deleteElement();
  addProject();
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
btnPrev.addEventListener("click", function () {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
});

btnNext.addEventListener("click", function () {
  if (currentPage < Math.ceil(projects.length / recordsPerPage)) {
    currentPage++;
    renderTable();
  }
});

// thẻ a
let links = document.querySelectorAll(".link");
links.forEach(link => {
  link.addEventListener("click", function() {
    link.classList.add("active");
  });
});
// đẩy dữ liệu ra ngoài màn hình
renderTable();




// xoá dữ liệu cột
function deleteElement() {
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
      localStorage.setItem("projects", JSON.stringify(projects)); // Cập nhật lại localStorage
      modal.style.display = "none";
      renderTable(); // Render lại bảng
      deleteIndex = null; // Reset lại chỉ số xoá để tránh lỗi
    }
  });

  // Xử lý khi huỷ bỏ xoá
  btnCancel.addEventListener("click", function () {
    modal.style.display = "none";
  });

  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });
}

function addProject(){
  let modal = document.querySelector("#modalAddContainer");
  let btnAdd = document.querySelector("#btnAdd");
  let btnCancel = document.querySelector("#btnCancel");
  let closeBtn = document.querySelector("#closeProject");

  btnAdd.addEventListener("click",function(){
    modal.style.display = "block";
  });

  btnCancel.addEventListener("click", function () {
    modal.style.display = "none";
  });

  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });
}








