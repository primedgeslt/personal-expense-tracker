const transactionForm = document.querySelector("#transaction-form");

let transactions = [];

if (transactionForm) {
  transactionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    console.log("The form was submitted.");
  });
}

