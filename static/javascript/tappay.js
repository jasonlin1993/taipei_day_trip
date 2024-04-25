TPDirect.setupSDK(
  137076,
  "app_A00NFC1RLWafBN5TuQfbkna219pA98PaBa2MBiEwvSTgnCchI9KInS3MJXTK",
  "sandbox"
);

TPDirect.card.setup({
  fields: {
    number: {
      element: "#card-number",
      placeholder: "**** **** **** ****",
    },
    expirationDate: {
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
    "input.ccv": {},
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

  isMaskCreditCardNumber: true,
  maskCreditCardNumberRange: {
    beginIndex: 6,
    endIndex: 11,
  },
});

document.getElementById("submit-button").addEventListener("click", onClick);

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
            prime: prime,
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
