function getIdFromUrl() {
  const parts = window.location.pathname.split("/");
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

function updateUI(timePeriod) {
  const morningBtn = document.getElementById("morningBtn");
  const afternoonBtn = document.getElementById("afternoonBtn");
  const tourCostElement = document.getElementById("tourCost");
  const clickedImg = timePeriod === "morning" ? morningBtn : afternoonBtn;
  const notClickedImg = timePeriod === "morning" ? afternoonBtn : morningBtn;
  clickedImg.src = clickedImg.getAttribute("data-active-src");
  notClickedImg.src = notClickedImg.getAttribute("data-inactive-src");
  tourCostElement.innerText = `新台幣 ${
    timePeriod === "morning" ? 2000 : 2500
  } 元`;
}

function updateCarousel(offset) {
  const carousel = document.querySelector("[data-carousel]");
  const slides = carousel.querySelectorAll("[data-slide]");
  const circles = document.querySelectorAll(
    ".section__attraction__btn__circle img"
  );
  let activeIndex = Array.from(slides).findIndex((slide) =>
    slide.classList.contains("active")
  );
  let newIndex = (activeIndex + offset + slides.length) % slides.length;
  slides[activeIndex].classList.remove("active");
  slides[newIndex].classList.add("active");
  circles[activeIndex].src = document.getElementById(
    "circle-current-1-url"
  ).value;
  circles[newIndex].src = document.getElementById("circle-current-url").value;
}

function createCircleElements(imageCount) {
  const circleContainer = document.querySelector(
    ".section__attraction__btn__circle"
  );
  circleContainer.innerHTML = "";
  const circleCurrentUrl = document.getElementById("circle-current-url").value;
  const circleCurrent1Url = document.getElementById(
    "circle-current-1-url"
  ).value;
  const createCircle = (src, isCurrent) => {
    const imgElem = document.createElement("img");
    imgElem.src = src;
    imgElem.alt = "icon_btn_circle";
    imgElem.classList.add(
      isCurrent
        ? "section__attraction__btn__circle--checked"
        : "section__attraction__btn__circle--check"
    );
    circleContainer.appendChild(imgElem);
  };

  createCircle(circleCurrentUrl, true);
  for (let i = 1; i < imageCount; i++) {
    createCircle(circleCurrent1Url, false);
  }
}

function createImageElements(images) {
  const imageContainer = document.querySelector("[data-carousel]");
  imageContainer
    .querySelectorAll(".carousel-image, .section__attraction__img")
    .forEach((imgElem) => imgElem.remove());
  images.forEach((imageSrc, index) => {
    const imgElem = document.createElement("img");
    imgElem.src = imageSrc;
    imgElem.classList.add(
      index === 0 ? "section__attraction__img" : "carousel-image"
    );
    imgElem.setAttribute("data-slide", "");
    if (index === 0) {
      imgElem.classList.add("active");
    }
    imageContainer.appendChild(imgElem);
  });
}

function populateData(data) {
  document.querySelector(".section__attraction__profile__name").textContent =
    data.name;
  document.querySelector(
    ".section__attraction__profile__infomation__category"
  ).textContent = data.category;
  document.querySelector(
    ".section__attraction__profile__infomation__mrt"
  ).textContent = data.mrt;
  document.querySelector(
    ".section__attraction__profile__bookingform__text__description"
  ).textContent = data.description;
  document.querySelector(
    ".section__attraction__profile__bookingform__text__address--RegularContent"
  ).textContent = data.address;
  document.querySelector(
    ".section__attraction__profile__bookingform__text__transport--RegularContent"
  ).textContent = data.transport;
}

function isDataComplete(data) {
  if (data.attraction_id && data.date && data.time && data.price) {
    return true;
  }
  return false;
}

function hasToken() {
  return !!localStorage.getItem("jwt");
}

async function bookAttraction() {
  const attractionId = getIdFromUrl();
  const date = document.querySelector(".bday").value;
  const morningBtn = document.getElementById("morningBtn");
  const time = morningBtn.src.includes("radio_btn_click.svg")
    ? "morning"
    : "afternoon";
  const tourCostElem = document.getElementById("tourCost");
  const price = tourCostElem.textContent.includes("2000") ? 2000 : 2500;

  const bookingData = {
    attraction_id: attractionId,
    date: date,
    time: time,
    price: price,
  };

  if (!isDataComplete(bookingData)) {
    return;
  }

  if (!hasToken()) {
    return;
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

document
  .getElementById("morningBtn")
  .addEventListener("click", () => updateUI("morning"));
document
  .getElementById("afternoonBtn")
  .addEventListener("click", () => updateUI("afternoon"));
document
  .querySelector("[data-carousel-button='next']")
  .addEventListener("click", () => updateCarousel(1));
document
  .querySelector("[data-carousel-button='prev']")
  .addEventListener("click", () => updateCarousel(-1));

document
  .querySelector(".section__attraction__profile__bookingform__text--bookingBTN")
  .addEventListener("click", bookAttraction);

window.onload = fetchData;
