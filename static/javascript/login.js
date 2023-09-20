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
