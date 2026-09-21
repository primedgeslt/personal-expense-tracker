const STORAGE_KEY = "personal-expense-tracker-transactions";

const transactionForm = document.querySelector("#transaction-form");
const descriptionInput = document.querySelector("#description");
const amountInput = document.querySelector("#amount");
const typeInput = document.querySelector("#type");
const categoryInput = document.querySelector("#category");
const dateInput = document.querySelector("#date");
const transactionList = document.querySelector("#transaction-list");

// Search and filter controls
const searchInput = document.querySelector("#search");
const filterTypeInput = document.querySelector("#filter-type");
const filterCategoryInput = document.querySelector("#filter-category");

// Summary elements
const balanceTotal = document.querySelector("#balance-total");
const incomeTotal = document.querySelector("#income-total");
const expenseTotal = document.querySelector("#expense-total");

let transactions = loadTransactions();

let filters = {
  search: "",
  type: "all",
  category: "all"
};

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

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN"
  }).format(amount);
}

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

function getFilteredTransactions() {
  return transactions.filter(function (transaction) {
    const description = transaction.description.toLowerCase();
    const searchTerm = filters.search.toLowerCase();

    const matchesSearch = description.includes(searchTerm);

    const matchesType =
      filters.type === "all" || transaction.type === filters.type;

    const matchesCategory =
      filters.category === "all" ||
      transaction.category === filters.category;

    return matchesSearch && matchesType && matchesCategory;
  });
}

function renderTransactions() {
  transactionList.replaceChildren();

  const filteredTransactions = getFilteredTransactions();

  if (filteredTransactions.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.classList.add("empty-state");

    if (transactions.length === 0) {
      emptyMessage.textContent =
        "No transactions yet. Add your first transaction above.";
    } else {
      emptyMessage.textContent =
        "No transactions match the current filters.";
    }

    transactionList.append(emptyMessage);
    return;
  }

  filteredTransactions.forEach(function (transaction) {
    const transactionItem = document.createElement("article");

    transactionItem.classList.add(
      "transaction-item",
      transaction.type === "income"
        ? "transaction-income"
        : "transaction-expense"
    );

    transactionItem.dataset.transactionId = transaction.id;

    const transactionDescription = document.createElement("h3");
    transactionDescription.textContent = transaction.description;

    const transactionDetails = document.createElement("p");
    transactionDetails.textContent =
      `${transaction.category} • ${transaction.date}`;

    const transactionAmount = document.createElement("strong");
    transactionAmount.textContent =
      `${transaction.type === "expense" ? "-" : "+"}${formatCurrency(
        transaction.amount
      )}`;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.dataset.transactionId = transaction.id;

    transactionItem.append(
      transactionDescription,
      transactionDetails,
      transactionAmount,
      deleteButton
    );

    transactionList.append(transactionItem);
  });
}

function deleteTransaction(transactionId) {
  transactions = transactions.filter(function (transaction) {
    return String(transaction.id) !== String(transactionId);
  });

  saveTransactions();
  renderTransactions();
  updateSummary();
}

transactionList.addEventListener("click", function (event) {
  if (!event.target.classList.contains("delete-button")) {
    return;
  }

  const transactionId = event.target.dataset.transactionId;

  deleteTransaction(transactionId);
});

searchInput.addEventListener("input", function (event) {
  filters.search = event.target.value.trim();
  renderTransactions();
});

filterTypeInput.addEventListener("change", function (event) {
  filters.type = event.target.value;
  renderTransactions();
});

filterCategoryInput.addEventListener("change", function (event) {
  filters.category = event.target.value;
  renderTransactions();
});

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
