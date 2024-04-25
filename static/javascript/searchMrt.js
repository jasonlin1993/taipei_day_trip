async function getMrtData() {
  try {
    const response = await fetch("/api/mrts");
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching MRT data:", error);
  }
}

function searchMRT(stationName) {
  const searchInput = document.getElementById("search");
  searchInput.value = stationName;
  search();
}

async function populateMrtList() {
  const metroStationsContainer = document.querySelector(
    ".section__listBar__container"
  );

  try {
    const mrtData = await getMrtData();

    if (mrtData) {
      mrtData.forEach((station) => {
        if (station) {
          const stationDiv = document.createElement("div");
          stationDiv.className = "section__listBar__container__text";
          stationDiv.textContent = station;
          stationDiv.onclick = function () {
            searchMRT(station);
          };
          metroStationsContainer.appendChild(stationDiv);
        }
      });
    }
  } catch (error) {
    console.error("Error populating MRT list:", error);
  }
}

async function search() {
  const searchValue = document.getElementById("search").value;
  if (searchValue) {
    url = `/api/attractions?page=0&keyword=${encodeURIComponent(searchValue)}`;
    currentKeyword = encodeURIComponent(searchValue);
  } else {
    url = "/api/attractions?page=0";
    currentKeyword = "";
  }

  document.querySelector(".container__section").innerHTML = "";
  results = [];
  nextPage = null;
  isLoading = false;

  initializeData();
}

document.addEventListener("DOMContentLoaded", populateMrtList);
