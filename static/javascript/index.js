let url = '/api/attractions?page=0'
let results = [];

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


fetch(url, {
  method: 'GET',
  headers: {
      'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  results = data.data;

  for(let i=0; i<13; i++) {
      createElement(
          results[i],
          "container__section__title",
          "container__section__image",
          "container__section__text",
          "container__section__titles__mrts--mrt",
          "container__section__titles__mrts--category"
      )
  }
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
  
  