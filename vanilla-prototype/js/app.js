const STORAGE_KEY = "personal-expense-tracker-transactions";

const transactionForm = document.querySelector("#transaction-form");
const descriptionInput = document.querySelector("#description");
const amountInput = document.querySelector("#amount");
const typeInput = document.querySelector("#type");
const categoryInput = document.querySelector("#category");
const dateInput = document.querySelector("#date");
const transactionList = document.querySelector("#transaction-list");

//Select the summary elements
const balanceTotal = document.querySelector("#balance-total");
const incomeTotal = document.querySelector("#income-total");
const expenseTotal = document.querySelector("#expense-total");


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

//Add the currency formatter
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN"
  }).format(amount);
}

// Add the totals function
function updateSummary() {
  const income = transactions
    .filter(function (transaction) {
      return transaction.type === "income";
    })
    .reduce(function (total, transaction) {
      return total + transaction.amount;
    }, 0);

  const expenses = transactions
    .filter(function (transaction) {
      return transaction.type === "expense";
    })
    .reduce(function (total, transaction) {
      return total + transaction.amount;
    }, 0);

  const balance = income - expenses;

  balanceTotal.textContent = formatCurrency(balance);
  incomeTotal.textContent = formatCurrency(income);
  expenseTotal.textContent = formatCurrency(expenses);
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
updateSummary();
transactionForm.reset();
});

renderTransactions();
updateSummary();
