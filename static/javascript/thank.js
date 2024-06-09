document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("jwt");
  if (!token) {
    window.location.href = "/";
    return;
  }

  if (window.location.pathname.startsWith("/thankyou")) {
    const urlParams = new URLSearchParams(window.location.search);
    const orderNumber = urlParams.get("number");
    document.getElementById("orderNumberDisplay").textContent = orderNumber;

    try {
      const bookingResponse = await fetch("/api/booking", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const bookingData = await bookingResponse.json();
      if (bookingData.data && bookingData.data.status === 1) {
        createThankYouBookingElement(bookingData);
      } else {
        displayNoBookingMessage();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
});

function createThankYouBookingElement(data) {
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
  newBooking.appendChild(attractionName);
  newBooking.appendChild(attractionAddress);
  newBooking.appendChild(attractionTime);
  newBooking.appendChild(attractionCount);
  newBookingContainer.appendChild(imgDiv);
  newBookingContainer.appendChild(newBooking);
  document
    .querySelector(".attractionContainer")
    .appendChild(newBookingContainer);
}

function displayNoBookingMessage() {
  const attractionInformationSections = document.querySelectorAll(
    ".attractionInformation"
  );
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
