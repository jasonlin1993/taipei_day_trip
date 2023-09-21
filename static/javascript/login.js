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

// 添加事件監聽器
btn.addEventListener("click", function() {
  loginModal.showModal();
});

loginClose.addEventListener("click", function() {
  loginModal.close();
});

createCountClose.addEventListener("click", function() {
  createCountModal.close();
});

createCountLink.addEventListener("click", function() {
  showCreateCountModal();
});

signInLink.addEventListener("click", function() {
  showLoginModal();
});


function loginAccount() {
  const email = document.getElementById('signinEmail').value;
  const password = document.getElementById('signinPassword').value;

  const data = {
      email: email,
      password: password
  };

  fetch("/api/user/auth", {
      method: "PUT",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
      if (data.token) {
          localStorage.setItem('jwt', data.token);
          // 登入成功，您可以做其他事情，例如重新導向到主頁
      } else {
          // 顯示錯誤訊息
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
}


function createAccount() {
  const name = document.getElementById('signUpName').value;
  const email = document.getElementById('signUpEmail').value;
  const password = document.getElementById('signUpPassword').value;

  const data = {
      name: name,
      email: email,
      password: password
  };

  fetch("/api/user", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
      const memberInfoText = document.querySelector(".header__item__login__text--memberinfo");
      if (data.ok) {
          memberInfoText.innerText = "註冊成功，請登入帳號";
      } else {
          memberInfoText.innerText = "註冊失敗，email 已經重複註冊";
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
}
