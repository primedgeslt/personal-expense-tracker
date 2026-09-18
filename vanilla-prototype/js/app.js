const transactionForm = document.querySelector("#transaction-form");

let transactions = [];

transactionForm.addEventListener("submit", function (event) {
  event.preventDefault();

  console.log("The form was submitted.");
});
