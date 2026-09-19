// ======================================================
// 1. GET THE FORM AND INPUT ELEMENTS FROM THE HTML
// ======================================================

// Find the transaction form on the page.
const transactionForm = document.querySelector("#transaction-form");

// Find each input field inside the form.
const descriptionInput = document.querySelector("#description");
const amountInput = document.querySelector("#amount");
const typeInput = document.querySelector("#type");
const categoryInput = document.querySelector("#category");
const dateInput = document.querySelector("#date");

// Create an empty array.
// We will store all transaction objects inside this array.
let transactions = [];

// Find the HTML element where transactions will be displayed.
const transactionList = document.querySelector("#transaction-list");


// ======================================================
// 2. FUNCTION TO DISPLAY TRANSACTIONS
// ======================================================

// This function takes the transactions in our array
// and displays them on the webpage.
function renderTransactions() {

  // Clear the transaction list before displaying it again.
  // This prevents duplicate transactions from appearing.
  transactionList.replaceChildren();


  // Check if there are no transactions in the array.
  if (transactions.length === 0) {

    // Create a paragraph element.
    const emptyMessage = document.createElement("p");

    // Add text to the paragraph.
    emptyMessage.textContent = "No transactions yet.";

    // Add the paragraph to the transaction list.
    transactionList.append(emptyMessage);

    // Stop the function here.
    return;
  }


  // Loop through every transaction in the array.
  transactions.forEach(function (transaction) {

    // Create an <article> to hold one transaction.
    const transactionItem = document.createElement("article");

    // Give the article a CSS class.
    transactionItem.classList.add("transaction-item");


    // --------------------------------------------------
    // Create and display the transaction description
    // --------------------------------------------------

    // Create an <h3> element.
    const transactionDescription = document.createElement("h3");

    // Put the transaction description inside the <h3>.
    transactionDescription.textContent = transaction.description;


    // --------------------------------------------------
    // Create and display category and date
    // --------------------------------------------------

    // Create a <p> element.
    const transactionDetails = document.createElement("p");

    // Display the category and date.
    transactionDetails.textContent =
      `${transaction.category} • ${transaction.date}`;


    // --------------------------------------------------
    // Create and display the transaction amount
    // --------------------------------------------------

    // Create a <strong> element.
    const transactionAmount = document.createElement("strong");

    // Check whether the transaction is an expense.
    //
    // If it is an expense, add a "-" sign.
    // Otherwise, add a "+" sign.
    transactionAmount.textContent =
      `${transaction.type === "expense" ? "-" : "+"}${transaction.amount}`;


    // Add the description, details, and amount
    // to the transaction article.
    transactionItem.append(
      transactionDescription,
      transactionDetails,
      transactionAmount
    );


    // Add the completed transaction article
    // to the transaction list on the webpage.
    transactionList.append(transactionItem);
  });
}


// ======================================================
// 3. LISTEN FOR FORM SUBMISSION
// ======================================================

// Run this function whenever the user submits the form.
transactionForm.addEventListener("submit", function (event) {

  // Prevent the browser from refreshing the page.
  event.preventDefault();


  // ====================================================
  // 4. CREATE A NEW TRANSACTION OBJECT
  // ====================================================

  // Collect the information entered by the user
  // and store it inside one transaction object.
  const newTransaction = {

    // Create a unique ID using the current time.
    id: Date.now(),

    // Get the description and remove extra spaces.
    description: descriptionInput.value.trim(),

    // Convert the amount from text into a number.
    amount: Number(amountInput.value),

    // Get the transaction type.
    // Example: "income" or "expense".
    type: typeInput.value,

    // Get the selected category.
    category: categoryInput.value,

    // Get the selected date.
    date: dateInput.value
  };


  // ====================================================
  // 5. ADD THE NEW TRANSACTION TO THE ARRAY
  // ====================================================

  // Add the new transaction object to our array.
  transactions.push(newTransaction);


  // ====================================================
  // 6. DISPLAY THE UPDATED TRANSACTION LIST
  // ====================================================

  // Run the render function again so the new
  // transaction appears on the webpage.
  renderTransactions();


  // Print the transactions array in the browser console.
  // This is useful for checking our data while developing.
  console.log(transactions);


  // ====================================================
  // 7. CLEAR THE FORM
  // ====================================================

  // Reset all form inputs after the transaction
  // has been successfully added.
  transactionForm.reset();
});
