// Lấy form đăng nhập
let form = document.querySelector("#form");

// Lấy danh sách người dùng từ localStorage (hoặc rỗng nếu chưa có ai)
let user = JSON.parse(localStorage.getItem("user")) || [];
let userLogin = JSON.parse(localStorage.getItem("userLogin")) || [];

form.addEventListener("submit", function (event) {
    event.preventDefault(); // Ngăn form gửi đi mặc định
    
    let email = document.querySelector("#inputEmail").value.trim();
    let password = document.querySelector("#inputPass").value.trim();
    let errors = document.querySelectorAll(".error");
    
    // Xóa thông báo lỗi trước khi kiểm tra
    errors.forEach((error) => (error.textContent = ""));

    let hasError = false;
    // Kiểm tra email
    if (!email) {
        errors[0].textContent = "Email không được để trống";
        hasError = true;
    } else if (!isValidEmail(email)) {
        errors[0].textContent = "Email không đúng định dạng";
        hasError = true; 
    }

    // Kiểm tra mật khẩu
    if (!password) {
        errors[1].textContent = "Mật khẩu không được để trống";
        hasError = true;
    } else if (!isStrongPassword(password)) {
        errors[1].textContent = "Mật khẩu không đủ mạnh";
        hasError = true; 
    }

    if (!hasError) {
       
        
        // Tìm người dùng có email khớp
        let foundUser = user.find(user => user.email === email);
        if (foundUser && foundUser.password === password) {
            foundUser.statur = true;
            localStorage.setItem("user", JSON.stringify(user));// lưu dữ liệu đã được cập nhật lên local
            // Chuyển hướng đến trang dashboard
            window.location.href = "dashboard.html";
        } else {
            errors[1].textContent = "Email hoặc mật khẩu không đúng!";
            errors[0].textContent = "Email hoặc mật khẩu không đúng!";
        }
        
        let idUserLogin = foundUser.id;
        let Login = {
            email,
            password,
            fullname: foundUser.fullname,
            idUser: idUserLogin,
            statur: foundUser.statur,
        }
        localStorage.setItem("userLogin",JSON.stringify(Login));// lưu dữ liệu người đang đăng nhập lên local
    }
});

// Hàm kiểm tra định dạng email
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|vn)$/;
    return emailRegex.test(email);
}

// hàm kiểm tra mật khẩu mạnh
function isStrongPassword(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}