function checkTime(timePeriod) {
    const morningBtn = document.getElementById('morningBtn');
    const afternoonBtn = document.getElementById('afternoonBtn');
  
    const clickedImg = timePeriod === 'morning' ? morningBtn : afternoonBtn;
    const notClickedImg = timePeriod === 'morning' ? afternoonBtn : morningBtn;
  
    clickedImg.src = clickedImg.getAttribute('data-active-src');
    notClickedImg.src = notClickedImg.getAttribute('data-inactive-src');
  }
  