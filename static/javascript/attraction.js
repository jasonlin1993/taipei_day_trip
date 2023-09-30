// 限制日期選擇
let today = new Date().toISOString().substr(0, 10);
document.getElementById("bday").min = today;

function checkTime(timePeriod) {
  const morningBtn = document.getElementById("morningBtn");
  const afternoonBtn = document.getElementById("afternoonBtn");
  const tourCostElement = document.getElementById("tourCost");

  const clickedImg = timePeriod === "morning" ? morningBtn : afternoonBtn;
  const notClickedImg = timePeriod === "morning" ? afternoonBtn : morningBtn;

  clickedImg.src = clickedImg.getAttribute("data-active-src");
  notClickedImg.src = notClickedImg.getAttribute("data-inactive-src");

  if (timePeriod === "morning") {
    tourCostElement.innerText = "新台幣 2000 元";
  } else {
    tourCostElement.innerText = "新台幣 2500 元";
  }
}

const buttons = document.querySelectorAll("[data-carousel-button]");

const circles = document.querySelectorAll(".section__attraction__btn__circle img");

// 通過ID獲取URL
const circleCurrentUrl = document.getElementById("circle-current-url").value;
const circleCurrent1Url = document.getElementById("circle-current-1-url").value;

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const circles = document.querySelectorAll(".section__attraction__btn__circle img");
    const offset = button.dataset.carouselButton === "next" ? 1 : -1;

    const carousel = button.closest("[data-carousel]");
    const slides = carousel.querySelectorAll("[data-slide]");

    let activeIndex = Array.from(slides).findIndex((slide) => slide.classList.contains("active"));

    let newIndex = activeIndex + offset;

    if (newIndex < 0) {
      newIndex = slides.length - 1;
    }

    if (newIndex >= slides.length) {
      newIndex = 0;
    }

    slides[activeIndex].classList.remove("active");
    slides[newIndex].classList.add("active");

    // 更新圓圈指示器的圖片
    circles[activeIndex].src = circleCurrent1Url;
    circles[newIndex].src = circleCurrentUrl;
  });
});

function getIdFromUrl() {
  const path = window.location.pathname;
  const parts = path.split("/");
  return parts[parts.length - 1];
}

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

function createCircleElements(imageCount) {
  const circleCurrentUrl = document.getElementById("circle-current-url").value;
  const circleCurrent1Url = document.getElementById("circle-current-1-url").value;

  const circleContainer = document.querySelector(".section__attraction__btn__circle");
  circleContainer.innerHTML = ""; // 清空當前的圓形元素

  const imgElemO = document.createElement("img");
  imgElemO.src = circleCurrentUrl; // "O" 代表的圖片
  imgElemO.alt = "icon_btn_circle";
  imgElemO.classList.add("section__attraction__btn__circle--checked");
  circleContainer.appendChild(imgElemO);

  for (let i = 1; i < imageCount; i++) {
    const imgElemX = document.createElement("img");
    imgElemX.src = circleCurrent1Url; // "X" 代表的圖片
    imgElemX.alt = "icon_btn_circle";
    imgElemX.classList.add("section__attraction__btn__circle--check");
    circleContainer.appendChild(imgElemX);
  }
}

function createImageElements(images) {
  const imageContainer = document.querySelector("[data-carousel]");
  imageContainer.querySelectorAll(".carousel-image, .section__attraction__img").forEach((imgElem) => imgElem.remove());
  images.forEach((imageSrc, index) => {
    const imgElem = document.createElement("img");
    imgElem.src = imageSrc;
    if (index === 0) {
      imgElem.classList.add("section__attraction__img");
    } else {
      imgElem.classList.add("carousel-image");
    }
    imgElem.setAttribute("data-slide", "");
    if (index === 0) {
      imgElem.classList.add("active");
    }
    imageContainer.appendChild(imgElem);
  });
}

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

async function bookAttraction() {
  const attractionId = getIdFromUrl();
  const date = document.getElementById("bday").value;
  const morningBtn = document.getElementById("morningBtn");
  const afternoonBtn = document.getElementById("afternoonBtn");

  let time;
  if (morningBtn.src.includes("radio_btn_click.svg")) {
    time = "morning";
  } else if (afternoonBtn.src.includes("radio_btn_click.svg")) {
    time = "afternoon";
  }

  const tourCostElem = document.getElementById("tourCost");
  let price;
  if (tourCostElem.textContent.includes("2000")) {
    price = 2000;
  } else if (tourCostElem.textContent.includes("2500")) {
    price = 2500;
  }

  const bookingData = {
    attraction_id: attractionId,
    date: date,
    time: time,
    price: price,
  };
  console.log(bookingData);

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
document
  .querySelector(".section__attraction__profile__bookingform__text--bookingBTN")
  .addEventListener("click", bookAttraction);

window.onload = fetchData;
