function checkTime(timePeriod) {
    const morningBtn = document.getElementById('morningBtn');
    const afternoonBtn = document.getElementById('afternoonBtn');
    const tourCostElement = document.getElementById('tourCost');
  
    const clickedImg = timePeriod === 'morning' ? morningBtn : afternoonBtn;
    const notClickedImg = timePeriod === 'morning' ? afternoonBtn : morningBtn;
  
    clickedImg.src = clickedImg.getAttribute('data-active-src');
    notClickedImg.src = notClickedImg.getAttribute('data-inactive-src');

    if (timePeriod === 'morning') {
        tourCostElement.innerText = '新台幣 2000 元';
    } else {
        tourCostElement.innerText = '新台幣 2500 元';
    }
  }
  
//   function getIdFromUrl() {
//     const path = window.location.pathname;
//     const parts = path.split('/');
//     return parts[parts.length - 1];
//   }
  
//   async function fetchData() {
//     try {
//       const id = getIdFromUrl();
//       const response = await fetch(`/api/attraction/${id}`);
//       const data = await response.json();
//       populateData(data.data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   }

//   function populateData(data) {
//     document.querySelector('.section__attraction__profile__name').textContent = data.name;
//     document.querySelector('.section__attraction__profile__infomation__category').textContent = data.category;
//     document.querySelector('.section__attraction__profile__infomation__mrt').textContent = data.mrt;
//     document.querySelector('.section__attraction__img img').src = data.images[0];
//     document.querySelector('.section__attraction__profile__bookingform__text__description').textContent = data.description;
//     document.querySelector('.section__attraction__profile__bookingform__text__address--RegularContent').textContent = data.address;
//     document.querySelector('.section__attraction__profile__bookingform__text__transport--RegularContent').textContent = data.transport;
//   }

//   window.onload = fetchData;