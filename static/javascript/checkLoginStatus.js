function checkLoginStatus() {
  const token = localStorage.getItem("jwt");
  const btn = document.querySelector(".header__item__text--signin");

  if (token) {
    btn.innerText = "登出系統";
  } else {
    btn.innerText = "登入/註冊";
  }
}
