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
  