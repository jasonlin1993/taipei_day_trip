// 常用的 DOM 選擇器
const selectors = {
  btn: ".header__item__text--singin",
  loginModal: ".header__item__login",
  createCountModal: ".header__item__createCount",
  loginClose: ".header__item__login--close",
  createCountClose: ".header__item__createCount .header__item__login--close",
  createCountLink: ".header__item__login__text--createCount",
  signInLink: ".header__item__createCount .header__item__login__text--createCount",
  bookingBtn: ".header__item__text--booking",
  signinEmail: "#signinEmail",
  signinPassword: "#signinPassword",
  signUpName: "#signUpName",
  signUpEmail: "#signUpEmail",
  signUpPassword: "#signUpPassword",
  signinInfoText: ".header__item__login__text--signinInfo",
  memberInfoText: ".header__item__login__text--memberinfo",
  dateErrorElement: ".dateError",
  dateInput: "#bday",
  startBookingTrip: ".section__attraction__profile__bookingform__text--bookingBTN",
};

// 重新載入頁面
function reloadPage() {
  location.reload();
}

// 顯示登入對話框
function showLoginModal() {
  closeModal(selectors.createCountModal);
  openModal(selectors.loginModal);
}

// 顯示註冊對話框
function showCreateCountModal() {
  closeModal(selectors.loginModal);
  openModal(selectors.createCountModal);
}

// 關閉對話框
function closeModal(modalSelector) {
  const modal = document.querySelector(modalSelector);
  if (modal) {
    modal.close();
  }
}

// 開啟對話框
function openModal(modalSelector) {
  const modal = document.querySelector(modalSelector);
  if (modal) {
    modal.showModal();
  }
}

// 登入函數
function loginAccount() {
  const email = document.querySelector(selectors.signinEmail).value;
  const password = document.querySelector(selectors.signinPassword).value;
  const signinInfoText = document.querySelector(selectors.signinInfoText);

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
        closeModal(selectors.loginModal);
        checkLoginStatus();
      } else {
        handleLoginError(data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// 處理登入錯誤
function handleLoginError(message) {
  const signinInfoText = document.querySelector(selectors.signinInfoText);
  switch (message) {
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

// 註冊函數
function createAccount() {
  const name = document.querySelector(selectors.signUpName).value.trim();
  const email = document.querySelector(selectors.signUpEmail).value.trim();
  const password = document.querySelector(selectors.signUpPassword).value.trim();
  const memberInfoText = document.querySelector(selectors.memberInfoText);

  if (!name || !email || !password) {
    memberInfoText.innerText = "輸入值不可為空白";
    return;
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

// 登出函數
function logout() {
  localStorage.removeItem("jwt");
  reloadPage();
}

// 檢查登入/登出狀態
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
      const btn = document.querySelector(selectors.btn);
      if (data.data === null || data.error === true) {
        btn.innerText = "登入/註冊";
      } else {
        btn.innerText = "登出系統";
      }
    });
}

// 點擊事件處理函數
function handleClick() {
  const isLoggedin = localStorage.getItem("jwt");
  if (isLoggedin) {
    logout();
  } else {
    showLoginModal();
  }
}

// 初始化函數
function initialize() {
  // 添加事件監聽器
  document.querySelector(selectors.bookingBtn).addEventListener("click", function () {
    const isLoggedin = localStorage.getItem("jwt");
    if (isLoggedin) {
      // 如果已經登入，則導向/booking頁面
      window.location.href = "/booking";
    } else {
      // 如果還沒有登入，則顯示登入對話框
      showLoginModal();
    }
  });

  document.querySelector(selectors.startBookingTrip).addEventListener("click", function () {
    const dateInput = document.querySelector(selectors.dateInput);
    const dateErrorElement = document.querySelector(selectors.dateErrorElement);
    const isLoggedin = localStorage.getItem("jwt");
    if (!isLoggedin) {
      showLoginModal();
      return;
    }

    if (!dateInput.value) {
      dateErrorElement.style.display = "block";
      return;
    }

    dateErrorElement.style.display = "none;";
  });
}

document.querySelector(selectors.loginClose).addEventListener("click", function () {
  closeModal(selectors.loginModal);
});

document.querySelector(selectors.createCountClose).addEventListener("click", function () {
  closeModal(selectors.createCountModal);
});

document.querySelector(selectors.createCountLink).addEventListener("click", function () {
  showCreateCountModal();
});

document.querySelector(selectors.signInLink).addEventListener("click", function () {
  showLoginModal();
});

document.querySelector(selectors.btn).addEventListener("click", handleClick);

// 當 DOM 全部載入完畢，就執行 initialize 函數
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}
