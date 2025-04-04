// trang js đăng kí
let form = document.querySelector("#form");

let users = JSON.parse(localStorage.getItem("user")) || [];
let userLogin = JSON.parse(localStorage.getItem("userLogin")) || [];

form.addEventListener("submit", function (event) {
    event.preventDefault(); // Ngăn form gửi đi mặc định
    let email = document.querySelector("#inputEmail").value.trim();
    let password = document.querySelector("#inputPass").value.trim();
    let errors = document.querySelectorAll(".error");
    let name = document.querySelector("#inputName").value.trim();
    let confirm = document.querySelector('#inputConfirm').value.trim();
    // kiểm tra dữ liệu đầu vào
    // làm trống các ô báo lỗi
    errors.forEach((error ) => (error.textContent = ""));

    let hasError = false;
    let statur = false;

    //kiểm tra tên để trống
    if (!name) {
        errors[0].textContent = "Tên không được để trống";
        hasError = true;
    }else{
        errors[0].textContent = "";
    }

    //kiểm tra email để trống
    if (!email) {
        errors[1].textContent = "Email không được để trống";
        hasError = true;
    } else if (users.some(user => user.email === email)) { 
        errors[1].textContent = "Email đã được sử dụng";
        hasError = true;
    }else{
        errors[1].textContent = "";
    }

    //kiểm tra pass để trống
    if (!password) {
        errors[2].textContent = "Mật khẩu không được để trống";
        hasError = true;
    }else{
        errors[2].textContent = "";
    }

    //kiểm tra confirm để trống và có trùng với pass hay không
    if (!confirm) {
        errors[3].textContent = "Mật khẩu không được để trống";
        hasError = true;
    } else if (confirm !== password) {
        errors[3].textContent = "Mật khẩu xác nhận không khớp";
        hasError = true;
    }else{
        errors[3].textContent = "";
    }

    //kiểm tra email đủ mạnh hay không
    if(!isValidEmail(email)){
        errors[1].textContent = "Email không đúng định dạng";
        hasError = true;
    }

    //kiểm tra pass đủ mạnh hay không
    if (!isStrongPassword(password)) {
        errors[2].textContent = "Mật khẩu không đủ mạnh";
        hasError = true; 
    }
    if (!hasError) {
    
        let newUser = {
            id : users.length + 1,
            fullname: name,
            email,
            password,
            statur,
        };
        users.push(newUser);
        localStorage.setItem("user", JSON.stringify(users));
        //  Xóa dữ liệu trong các ô input sau khi đăng ký thành công
        form.reset();
        return;
    }

});

// hàm kiểm tra định dạng email
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|vn)$/;
    return emailRegex.test(email);
}
// hàm kiểm tra pass
function isStrongPassword(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}
