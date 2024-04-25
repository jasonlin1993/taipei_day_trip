const today = new Date().toISOString().substr(0, 10);
const birthdayInput = document.querySelector(".bday");
if (birthdayInput) {
  birthdayInput.min = today;
}
