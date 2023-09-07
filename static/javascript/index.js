let url = '/api/attractions?page=0';
let results = [];
let nextPage = null;
let isLoading = false;
let currentKeyword = ''; // 新增一個變量來存儲當前的搜尋關鍵字

function createElement(data) {
  let newDiv = document.createElement("div");
  newDiv.className = "container__section__title";

  let img = document.createElement('img');
  img.src = data.images[0];
  img.className = "container__section__title__image";

  let titleName = document.createElement("p");
  titleName.textContent = data.name;
  titleName.className = "container__section__title__text";

  let mrtDiv = document.createElement("p");
  mrtDiv.className = "container__section__titles__mrts";

  let titleMrt = document.createElement("p");
  titleMrt.textContent = data.mrt;
  titleMrt.className = "container__section__titles__mrts--mrt";

  let titleCategory = document.createElement("p");
  titleCategory.textContent = data.category;
  titleCategory.className = "container__section__titles__mrts--category";

  mrtDiv.appendChild(titleMrt);
  mrtDiv.appendChild(titleCategory);
  newDiv.appendChild(img);
  newDiv.appendChild(titleName);
  newDiv.appendChild(mrtDiv);
  document.querySelector('.container__section').appendChild(newDiv);
}

async function loadNextPage() {
  if (isLoading || nextPage === null) return;

  isLoading = true;

  try {
    const response = await fetch(`/api/attractions?page=${nextPage}&keyword=${currentKeyword}`); // 修改這裡來包含當前的搜尋關鍵字
    const data = await response.json();
    
    results = results.concat(data.data);
    nextPage = data.nextPage;

    data.data.forEach(item => {
      createElement(item);
    });

    isLoading = false;
  } catch (error) {
    console.error('Error:', error);
    isLoading = false;
  }
}

let observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadNextPage();
    }
  });
});

async function initializeData() {
  try {
    const response = await fetch(url);
    const data = await response.json();

    // 如果資料不存在或為空，則顯示 "抱歉，查無資料" 的消息
    if (!data.data || data.data.length === 0) {
      const noDataDiv = document.createElement('div');
      noDataDiv.textContent = "抱歉，查無資料";
      document.querySelector('.container__section').appendChild(noDataDiv);
      return;
    }

    results = data.data;
    nextPage = data.nextPage;

    data.data.forEach((item, index) => {
      createElement(item);
      
      // 如果是最後一個元素，則附加觀察者
      if (index === data.data.length - 1) {
        observer.observe(document.querySelector('.load-more-trigger'));
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

initializeData();

async function getMrtData() {
  try {
    const response = await fetch('/api/mrts');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching MRT data:', error);
  }
}

function searchMRT(stationName) {
  const searchInput = document.getElementById('search');
  searchInput.value = stationName; // 設置搜索框的值為站名
  search(); // 調用現有的搜索功能進行搜索
}


async function populateMrtList() {
  const metroStationsContainer = document.querySelector('.section__listBar__container');
  
  // 清除現有的資料
  metroStationsContainer.innerHTML = '';

  try {
    const mrtData = await getMrtData();

    if (mrtData) {
      mrtData.forEach(station => {
        if (station) {
          const stationDiv = document.createElement('div');
          stationDiv.className = 'section__listBar__container__text';
          stationDiv.textContent = station;
          stationDiv.onclick = function() {
            searchMRT(station);
          }; // 為每個站添加一個點擊事件來調用新的 searchMRT 函數
          metroStationsContainer.appendChild(stationDiv);
        }
      });
    }
  } catch (error) {
    console.error('Error populating MRT list:', error);
  }
}


document.addEventListener('DOMContentLoaded', populateMrtList);

async function search() {
  const searchValue = document.getElementById('search').value;
  if (searchValue) {
    url = `/api/attractions?page=0&keyword=${encodeURIComponent(searchValue)}`;
    currentKeyword = encodeURIComponent(searchValue);  // 修改這裡來儲存當前的搜尋關鍵字
  } else {
    url = '/api/attractions?page=0';
    currentKeyword = '';  // 如果沒有搜尋條件，則清空currentKeyword
  }
  
  // 清空之前的結果
  document.querySelector('.container__section').innerHTML = '';
  results = [];
  nextPage = null;
  isLoading = false;

  // 重新加載數據
  initializeData();
}

function scrollToLeft() {
  const container = document.getElementById('metroStations');
  container.scrollLeft -= 300; 
}

function scrollToRight() {
  const container = document.getElementById('metroStations');
  container.scrollLeft += 300;
}