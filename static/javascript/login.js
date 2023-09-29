// 登入/註冊/登出按鈕和模態框的DOM選擇器
let btn = document.querySelector(".header__item__text--singin");
let loginModal = document.querySelector(".header__item__login");
let createCountModal = document.querySelector(".header__item__createCount");
let loginClose = document.querySelector(".header__item__login--close");
let createCountClose = document.querySelector(".header__item__createCount .header__item__login--close");
let createCountLink = document.querySelector(".header__item__login__text--createCount");
let signInLink = document.querySelector(".header__item__createCount .header__item__login__text--createCount");

// 事件處理器函數
function showLoginModal() {
  createCountModal.close();
  loginModal.showModal();
}

function showCreateCountModal() {
  loginModal.close();
  createCountModal.showModal();
}

function logout() {
  localStorage.removeItem("jwt");
  location.reload(); // 重新載入頁面
}

// 添加事件監聽器
btn.addEventListener("click", function () {
  let isLoggedin = localStorage.getItem("jwt");
  if (isLoggedin) {
    logout();
  } else {
    loginModal.showModal();
  }
});

loginClose.addEventListener("click", function () {
  loginModal.close();
});

createCountClose.addEventListener("click", function () {
  createCountModal.close();
});

createCountLink.addEventListener("click", function () {
  showCreateCountModal();
});

signInLink.addEventListener("click", function () {
  showLoginModal();
});

function loginAccount() {
  const email = document.getElementById("signinEmail").value;
  const password = document.getElementById("signinPassword").value;
  const signinInfoText = document.querySelector(".header__item__login__text--signinInfo");

  if (!email || !password) {
    signinInfoText.innerText = "電子郵件或密碼請勿空白";
    return;
  }

  const data = {
    email: email,
    password: password,
  };

  fetch("/api/user/auth", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.token) {
        localStorage.setItem("jwt", data.token);
        loginModal.close();
        checkLoginStatus();
      } else {
        switch (data.message) {
          case "wrong_password":
            signinInfoText.innerText = "密碼輸入錯誤，請重新輸入";
            break;
          case "unregistered_email":
            signinInfoText.innerText = "查無此信箱，請重新輸入";
            break;
          case "empty_fields":
            signinInfoText.innerText = "電子郵件或密碼請勿空白";
            break;
          default:
            signinInfoText.innerText = "發生未知錯誤";
            break;
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function createAccount() {
  const name = document.getElementById("signUpName").value.trim();
  const email = document.getElementById("signUpEmail").value.trim();
  const password = document.getElementById("signUpPassword").value.trim();
  const memberInfoText = document.querySelector(".header__item__login__text--memberinfo");

  // 檢查輸入是否有空白
  if (!name || !email || !password) {
    memberInfoText.innerText = "輸入值不可為空白";
    return; // 終止函數執行
  }

  const data = {
    name: name,
    email: email,
    password: password,
  };
  fetch("/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.ok) {
        memberInfoText.innerText = "註冊成功，請登入帳號";
      } else {
        memberInfoText.innerText = "註冊失敗，email 已經重複註冊";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// 登入狀態檢查函數
function checkLoginStatus() {
  fetch("/api/user/auth", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("jwt"),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.data.id);
      if (data.data === null || data.error === true) {
        btn.innerText = "登入/註冊";
      } else {
        btn.innerText = "登出系統";
      }
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const booking1 = document.querySelector(".header__item__text--booking");
  const booking2 = document.querySelector(".section__attraction__profile__bookingform__text--bookingBTN");
  const dialog = document.querySelector(".header__item__login");

  function checkLoginStatus(callback) {
    const jwtToken = localStorage.getItem("jwt");

    if (!jwtToken) {
      callback(false);
      return;
    }

    fetch("/api/user/auth", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + jwtToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.data === null || data.error === true) {
          callback(false);
        } else {
          callback(true);
        }
      })
      .catch((error) => {
        console.error("Error during authentication:", error);
        callback(false);
      });
  }

  function handleClick() {
    checkLoginStatus((isLoggedIn) => {
      if (isLoggedIn) {
        window.location.href = "/booking";
      } else {
        dialog.showModal();
      }
    });
  }

  booking1.addEventListener("click", handleClick);
  booking2.addEventListener("click", handleClick);

  const closeDialogButton = document.querySelector(".header__item__login--close");
  closeDialogButton.addEventListener("click", function () {
    dialog.close();
  });
});

// 當文件載入完成後，我們會呼叫上述的檢查狀態函數
document.addEventListener("DOMContentLoaded", checkLoginStatus);
