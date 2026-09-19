// collect the user’s input and turn it into one transaction object.

const transactionForm = document.querySelector("#transaction-form");

const descriptionInput = document.querySelector("#description");
const amountInput = document.querySelector("#amount");
const typeInput = document.querySelector("#type");
const categoryInput = document.querySelector("#category");
const dateInput = document.querySelector("#date");

let transactions = [];

transactionForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const newTransaction = {
    id: Date.now(),
    description: descriptionInput.value.trim(),
    amount: Number(amountInput.value),
    type: typeInput.value,
    category: categoryInput.value,
    date: dateInput.value
  };
  console.log(newTransaction);
});
