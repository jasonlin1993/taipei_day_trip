let url = "/api/attractions?page=0";
let results = [];
let nextPage = null;
let isLoading = false;
let currentKeyword = "";

async function loadNextPage() {
  if (isLoading || nextPage === null) return;

  isLoading = true;

  try {
    const response = await fetch(
      `/api/attractions?page=${nextPage}&keyword=${currentKeyword}`
    );
    const data = await response.json();

    results = results.concat(data.data);
    nextPage = data.nextPage;

    data.data.forEach((item) => {
      createElement(item);
    });

    isLoading = false;
  } catch (error) {
    console.error("Error:", error);
    isLoading = false;
  }
}

let observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      loadNextPage();
    }
  });
});

async function initializeData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!data.data || data.data.length === 0) {
      const noDataDiv = document.createElement("div");
      noDataDiv.textContent = "抱歉，查無資料";
      document.querySelector(".container__section").appendChild(noDataDiv);
      return;
    }

    results = data.data;
    nextPage = data.nextPage;

    data.data.forEach((item, index) => {
      createElement(item);
      if (index === data.data.length - 1) {
        observer.observe(document.querySelector(".load-more-trigger"));
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

initializeData();
