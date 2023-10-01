// 限制只有選取今天跟以後的時間
const today = new Date().toISOString().substr(0, 10);
const birthdayInput = document.getElementById("bday");
birthdayInput.min = today;

//選擇上下半天時更新選擇時間
function updateUI(timePeriod) {
  const morningBtn = document.getElementById("morningBtn");
  const afternoonBtn = document.getElementById("afternoonBtn");
  const tourCostElement = document.getElementById("tourCost");

  const clickedImg = timePeriod === "morning" ? morningBtn : afternoonBtn;
  const notClickedImg = timePeriod === "morning" ? afternoonBtn : morningBtn;

  clickedImg.src = clickedImg.getAttribute("data-active-src");
  notClickedImg.src = notClickedImg.getAttribute("data-inactive-src");

  tourCostElement.innerText = `新台幣 ${timePeriod === "morning" ? 2000 : 2500} 元`;
}

// 圖片輪播圖
function updateCarousel(offset) {
  const carousel = document.querySelector("[data-carousel]");
  const slides = carousel.querySelectorAll("[data-slide]");
  const circles = document.querySelectorAll(".section__attraction__btn__circle img");

  let activeIndex = Array.from(slides).findIndex((slide) => slide.classList.contains("active"));
  let newIndex = (activeIndex + offset + slides.length) % slides.length;

  slides[activeIndex].classList.remove("active");
  slides[newIndex].classList.add("active");

  circles[activeIndex].src = document.getElementById("circle-current-1-url").value;
  circles[newIndex].src = document.getElementById("circle-current-url").value;
}

// 獲取 URL 的ID
function getIdFromUrl() {
  const parts = window.location.pathname.split("/");
  return parts[parts.length - 1];
}

// 獲取景點數量
async function fetchData() {
  try {
    const id = getIdFromUrl();
    const response = await fetch(`/api/attraction/${id}`);
    const data = await response.json();
    populateData(data.data);
    createImageElements(data.data.images);
    createCircleElements(data.data.images.length);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// 動態新增圓點數量
function createCircleElements(imageCount) {
  const circleContainer = document.querySelector(".section__attraction__btn__circle");
  circleContainer.innerHTML = "";

  const circleCurrentUrl = document.getElementById("circle-current-url").value;
  const circleCurrent1Url = document.getElementById("circle-current-1-url").value;

  const createCircle = (src, isCurrent) => {
    const imgElem = document.createElement("img");
    imgElem.src = src;
    imgElem.alt = "icon_btn_circle";
    imgElem.classList.add(
      isCurrent ? "section__attraction__btn__circle--checked" : "section__attraction__btn__circle--check"
    );
    circleContainer.appendChild(imgElem);
  };

  createCircle(circleCurrentUrl, true);
  for (let i = 1; i < imageCount; i++) {
    createCircle(circleCurrent1Url, false);
  }
}

// 顯示當前圖片並新增 active
function createImageElements(images) {
  const imageContainer = document.querySelector("[data-carousel]");
  imageContainer.querySelectorAll(".carousel-image, .section__attraction__img").forEach((imgElem) => imgElem.remove());
  images.forEach((imageSrc, index) => {
    const imgElem = document.createElement("img");
    imgElem.src = imageSrc;
    imgElem.classList.add(index === 0 ? "section__attraction__img" : "carousel-image");
    imgElem.setAttribute("data-slide", "");
    if (index === 0) {
      imgElem.classList.add("active");
    }
    imageContainer.appendChild(imgElem);
  });
}

// 根據景點 api 資料
function populateData(data) {
  document.querySelector(".section__attraction__profile__name").textContent = data.name;
  document.querySelector(".section__attraction__profile__infomation__category").textContent = data.category;
  document.querySelector(".section__attraction__profile__infomation__mrt").textContent = data.mrt;
  document.querySelector(".section__attraction__profile__bookingform__text__description").textContent =
    data.description;
  document.querySelector(".section__attraction__profile__bookingform__text__address--RegularContent").textContent =
    data.address;
  document.querySelector(".section__attraction__profile__bookingform__text__transport--RegularContent").textContent =
    data.transport;
}

// 檢查資料完整性
function isDataComplete(data) {
  // 檢查 attraction_id、date、time 和 price 是否存在且不為空
  if (data.attraction_id && data.date && data.time && data.price) {
    return true;
  }
  return false;
}

// 預定景點選擇
async function bookAttraction() {
  const attractionId = getIdFromUrl();
  const date = document.getElementById("bday").value;
  const morningBtn = document.getElementById("morningBtn");
  const time = morningBtn.src.includes("radio_btn_click.svg") ? "morning" : "afternoon";
  const tourCostElem = document.getElementById("tourCost");
  const price = tourCostElem.textContent.includes("2000") ? 2000 : 2500;

  const bookingData = {
    attraction_id: attractionId,
    date: date,
    time: time,
    price: price,
  };

  // 在送出資料前先確認其完整性
  if (!isDataComplete(bookingData)) {
    return; // 阻止後續的資料送出
  }

  try {
    const response = await fetch("/api/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify(bookingData),
    });

    const data = await response.json();

    if (data.ok) {
      window.location.href = "/booking";
    } else {
      console.log(data.message);
    }
  } catch (error) {
    console.error("Error booking:", error);
  }
}

// 點擊事件監聽器
document.getElementById("morningBtn").addEventListener("click", () => updateUI("morning"));
document.getElementById("afternoonBtn").addEventListener("click", () => updateUI("afternoon"));
document.querySelector("[data-carousel-button='next']").addEventListener("click", () => updateCarousel(1));
document.querySelector("[data-carousel-button='prev']").addEventListener("click", () => updateCarousel(-1));

document
  .querySelector(".section__attraction__profile__bookingform__text--bookingBTN")
  .addEventListener("click", bookAttraction);

// 頁面加載
window.onload = fetchData;
