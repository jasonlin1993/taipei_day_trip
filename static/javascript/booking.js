document.addEventListener("DOMContentLoaded", function () {
  // 檢查當前 URL 是否是 /booking
  if (window.location.pathname === "/booking") {
    // 檢查 localStorage 中是否有 jwt token
    const token = localStorage.getItem("jwt");

    // 如果 token 存在，代表用戶已登入
    if (token) {
      fetch("/api/booking", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.data) {
            // 有 booking 資料，生成相應的 HTML
            createNewBookingElement(data);
          } else {
            // 沒有 booking 資料，直接顯示沒有預定行程的提示
            displayNoBookingMessage();
          }
        })
        .catch((error) => console.error("Error fetching booking:", error));

      fetch("/api/user/auth", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          createMemberElement(data);
        })
        .catch((error) => console.error("Error fetching user auth:", error));
    }
  }
});

// 如果資料庫沒有資料，則顯示為沒有預定行程
function displayNoBookingMessage() {
  const attractionInformationSections = document.querySelectorAll(".attractionInformation");
  const cutLines = document.querySelectorAll(".cutLine2");
  const noneBookingSection = document.querySelector(".noneBooking");

  attractionInformationSections.forEach((section) => {
    section.style.display = "none";
  });

  cutLines.forEach((line) => {
    line.style.display = "none";
  });

  noneBookingSection.style.display = "block";
}

// 如果有刪除按鈕，添加事件監聽
function addDeleteButtonEventListener(button) {
  const attractionInformationSections = document.querySelectorAll(".attractionInformation");
  const cutLines = document.querySelectorAll(".cutLine2");
  const noneBookingSection = document.querySelector(".noneBooking");

  button.addEventListener("click", function () {
    fetch("/api/booking", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          attractionInformationSections.forEach((section) => {
            section.style.display = "none";
          });

          cutLines.forEach((line) => {
            line.style.display = "none";
          });

          noneBookingSection.style.display = "block";
        } else {
          console.log(data.message);
        }
      })
      .catch((error) => console.error("Error deleting booking:", error));
  });
}

// 更新會員資訊
function createMemberElement(data) {
  document.querySelector(".headline__text__name").textContent = data.data.name;
  document.querySelector(".inputName").value = data.data.name;
  document.querySelector(".inputEmail").value = data.data.email;
}

// 更新景點資訊
function createNewBookingElement(data) {
  const newBookingContainer = document.createElement("div");
  newBookingContainer.className = "attractionContainer";

  const imgDiv = document.createElement("div");
  const img = document.createElement("img");
  img.src = data.data.attraction.image;
  img.className = "attraction__img";
  imgDiv.appendChild(img);

  const newBooking = document.createElement("div");
  newBooking.className = "attraction__info";

  const attractionName = document.createElement("p");
  attractionName.textContent = "台北一日遊: " + data.data.attraction.name;
  attractionName.className = "attraction__info__name";

  const attractionAddress = document.createElement("p");
  attractionAddress.textContent = "地點: " + data.data.attraction.address;
  attractionAddress.className = "attraction__info__address";

  const attractionTime = document.createElement("p");
  attractionTime.className = "attraction__info__time";
  if (data.data.time === "morning") {
    attractionTime.textContent = "時間: 早上 9 點到下午 4 點";
  } else {
    attractionTime.textContent = "時間: 下午 2 點到晚上 9 點";
  }

  const attractionCount = document.createElement("p");
  attractionCount.textContent = "費用: " + data.data.price + " 元";
  attractionCount.className = "attraction__info__count";

  const deleteBtn = document.createElement("img");
  deleteBtn.src = "styles/icon/icon_delete.svg";
  deleteBtn.className = "attraction__info__deleteBtn";
  deleteBtn.alt = "deleteBtn";

  // 為新生成的刪除按鈕添加事件監聽
  addDeleteButtonEventListener(deleteBtn);

  newBooking.appendChild(attractionName);
  newBooking.appendChild(attractionAddress);
  newBooking.appendChild(attractionTime);
  newBooking.appendChild(attractionCount);
  newBooking.appendChild(deleteBtn);
  newBookingContainer.appendChild(imgDiv);
  newBookingContainer.appendChild(newBooking);
  document.querySelector(".confirm__text__total").textContent = data.data.price;
  document.querySelector(".attractionContainer").appendChild(newBookingContainer);
}
