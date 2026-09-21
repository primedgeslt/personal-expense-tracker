const STORAGE_KEY = "personal-expense-tracker-transactions";

const transactionForm = document.querySelector("#transaction-form");
const descriptionInput = document.querySelector("#description");
const amountInput = document.querySelector("#amount");
const typeInput = document.querySelector("#type");
const categoryInput = document.querySelector("#category");
const dateInput = document.querySelector("#date");
const transactionList = document.querySelector("#transaction-list");

let transactions = loadTransactions();

function loadTransactions() {
  const savedTransactions = localStorage.getItem(STORAGE_KEY);

  if (!savedTransactions) {
    return [];
  }

  try {
    return JSON.parse(savedTransactions);
  } catch (error) {
    console.error("Could not load saved transactions:", error);
    return [];
  }
}

function saveTransactions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function renderTransactions() {
  transactionList.replaceChildren();

  if (transactions.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No transactions yet.";
    transactionList.append(emptyMessage);
    return;
  }

  transactions.forEach(function (transaction) {
    const transactionItem = document.createElement("article");
    transactionItem.classList.add("transaction-item");

    const transactionDescription = document.createElement("h3");
    transactionDescription.textContent = transaction.description;

    const transactionDetails = document.createElement("p");
    transactionDetails.textContent =
      `${transaction.category} • ${transaction.date}`;

    const transactionAmount = document.createElement("strong");
    transactionAmount.textContent =
      `${transaction.type === "expense" ? "-" : "+"}${transaction.amount}`;

    transactionItem.append(
      transactionDescription,
      transactionDetails,
      transactionAmount
    );

    transactionList.append(transactionItem);
  });
}

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

  transactions.push(newTransaction);
  saveTransactions();
  renderTransactions();
  transactionForm.reset();
});

renderTransactions();
