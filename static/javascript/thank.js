if (window.location.pathname.startsWith("/thankyou")) {
  // 這個方法比較彈性，不需要比對整個URL
  const token = localStorage.getItem("jwt");

  if (!token) {
    // 如果沒有找到 token，則重定向到登入頁面
    window.location.href = "/";
  }
}

// 首先取得訂單編號從URL
const urlParams = new URLSearchParams(window.location.search);
const order_number = urlParams.get("number");

const orderNumberElement = document.getElementById("orderNumberDisplay");
orderNumberElement.textContent = order_number; // 更新訂單編號的顯示
