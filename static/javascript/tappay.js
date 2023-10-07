// component 的 script 部分

// TPDirect.setupSDK(11327, "app_whdEWBH8e8Lzy4N6BysVRRMILYORF6UxXbiOFsICkz0J9j1C0JUlCHv1tVJC", "sandbox");
TPDirect.setupSDK(137076, "app_A00NFC1RLWafBN5TuQfbkna219pA98PaBa2MBiEwvSTgnCchI9KInS3MJXTK", "sandbox");
// 把 TapPay 內建輸入卡號的表單給植入到 div 中
TPDirect.card.setup({
  // Display ccv field
  fields: {
    number: {
      // css selector
      element: "#card-number",
      placeholder: "**** **** **** ****",
    },
    expirationDate: {
      // DOM object
      element: document.getElementById("card-expiration-date"),
      placeholder: "MM / YY",
    },
    ccv: {
      element: "#card-ccv",
      placeholder: "ccv",
    },
  },
  styles: {
    input: {
      color: "gray",
    },
    "input.ccv": {
      // 'font-size': '16px'
    },
    ":focus": {
      color: "black",
    },
    ".valid": {
      color: "green",
    },
    ".invalid": {
      color: "red",
    },
    "@media screen and (max-width: 400px)": {
      input: {
        color: "orange",
      },
    },
  },
  // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
  isMaskCreditCardNumber: true,
  maskCreditCardNumberRange: {
    beginIndex: 6,
    endIndex: 11,
  },
});

document.getElementById("submit-button").addEventListener("click", onClick);

// TPDirect.card.onUpdate(function (update) {
//   if (update.canGetPrime) {
//     submitButton.removeAttribute("disabled");
//   } else {
//     submitButton.setAttribute("disabled", true);
//   }
// });

function onClick(event) {
  event.preventDefault();

  fetch("/api/booking", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("jwt"),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.data) {
        const address = data.data.attraction.address;
        const id = data.data.attraction.id;
        const image = data.data.attraction.image;
        const attractionName = data.data.attraction.name;
        const date = data.data.date;
        const price = data.data.price;
        const time = data.data.time;

        TPDirect.card.getPrime(function (result) {
          if (result.status !== 0) {
            console.error("getPrime 錯誤");
            return;
          }
          const prime = result.card.prime;
          const memberName = document.querySelector(".inputName").value;
          const memberEmail = document.querySelector(".inputEmail").value;
          const memberPhone = document.querySelector(".inputPhone").value;
          const requestBody = {
            prime: prime, // "前端從第三方金流 TapPay 取得的交易碼"
            order: {
              price: price,
              trip: {
                attraction: {
                  id: id,
                  name: attractionName,
                  address: address,
                  image: image,
                },
                date: date,
                time: time,
              },
              contact: {
                name: memberName,
                email: memberEmail,
                phone: memberPhone,
              },
            },
          };
          console.log(requestBody);
          fetch("/api/order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify(requestBody),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.data && data.data.number) {
                const order_number = data.data.number;
                const redirectUrl = `/thankyou?number=${order_number}`;
                window.location.href = redirectUrl;
              } else {
                console.error("Failed to retrieve order number");
              }
            });
        });
      }
    })

    .catch((error) => console.error("Error during fetch operation: ", error));
}
