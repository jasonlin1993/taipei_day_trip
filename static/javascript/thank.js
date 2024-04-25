if (window.location.pathname.startsWith("/thankyou")) {
  const token = localStorage.getItem("jwt");

  if (!token) {
    window.location.href = "/";
  }
}

const urlParams = new URLSearchParams(window.location.search);
const order_number = urlParams.get("number");

const orderNumberElement = document.getElementById("orderNumberDisplay");
orderNumberElement.textContent = order_number;
