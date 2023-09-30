document.addEventListener("DOMContentLoaded", function () {
  fetch("/api/booking", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("jwt"),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const newBookingContainer = document.createElement("div");
      newBookingContainer.className = "attraction";

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
      console.log(attractionCount.textContent);

      const deleteBtn = document.createElement("img");
      deleteBtn.src = "styles/icon/icon_delete.svg";
      deleteBtn.className = "attraction__info__deleteBtn";
      deleteBtn.alt = "deleteBtn";

      newBooking.appendChild(attractionName);
      newBooking.appendChild(attractionAddress);
      newBooking.appendChild(attractionTime);
      newBooking.appendChild(attractionCount);
      newBooking.appendChild(deleteBtn);
      newBookingContainer.appendChild(imgDiv);
      newBookingContainer.appendChild(newBooking);

      document.querySelector(".attraction").appendChild(newBookingContainer);
    })
    .catch((error) => console.error("Error fetching booking:", error));
});
// 如果有刪除按鈕，添加事件監聽
const deleteButton = document.querySelector(".delete-button");
if (deleteButton) {
  deleteButton.addEventListener("click", function () {
    fetch("/api/booking", {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + jwtToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          window.location.reload(); // 刷新頁面
        } else {
          console.log(data.message);
        }
      })
      .catch((error) => console.error("Error deleting booking:", error));
  });
}

function newBooking(data) {}
