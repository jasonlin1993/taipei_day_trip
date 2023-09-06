let url = '/api/attractions?page=0';
let results = [];
let nextPage = null;
let isLoading = false;

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

function loadNextPage() {
  if (isLoading || nextPage === null) return;

  isLoading = true;

  fetch(`/api/attractions?page=${nextPage}`)
  .then(response => response.json())
  .then(data => {
    results = results.concat(data.data);
    nextPage = data.nextPage;

    data.data.forEach(item => {
      createElement(item);
    });

    isLoading = false;
  })
  .catch(error => {
    console.error('Error:', error);
    isLoading = false;
  });
}

let observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadNextPage();
    }
  });
});

fetch(url)
.then(response => response.json())
.then(data => {
  results = data.data;
  nextPage = data.nextPage;

  data.data.forEach((item, index) => {
    createElement(item);
    
    // 如果是最後一個元素，則附加觀察者
    if (index === data.data.length - 1) {
      observer.observe(document.querySelector('.load-more-trigger'));
    }
  });
})
.catch(error => {
  console.error('Error:', error);
});




function scrollToLeft() {
    const container = document.getElementById('metroStations');
    container.scrollLeft -= 300; 
  }
  
  function scrollToRight() {
    const container = document.getElementById('metroStations');
    container.scrollLeft += 300; // 可根據需要調整這個數值
  }
  
  