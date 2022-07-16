// Mock Database
const storedRecords = JSON.parse(localStorage.getItem("records")) || [];

function createRecord(record) {
  storedRecords.push(record);

  localStorage.setItem("records", JSON.stringify(storedRecords));
  console.log(storedRecords);
}

/* localStorage.setItem(
  "records",
  JSON.stringify([
    {
      description: "Lorem ipsum, dolor sit amet consect.",
      amount: 1500,
      type: "income",
      category: "Lorem, ipsum.",
      createdAt: new Date(),
    },
    {
      description: "Lorem ipsum, dolor sit amet consect.",
      amount: 500,
      type: "expense",
      category: "Lorem, ipsum.",
      createdAt: new Date(),
    },
  ])
); */

// Card List
const incomeTotal = document.getElementById("incomeTotal");
const expenseTotal = document.getElementById("expenseTotal");
const balanceTotal = document.getElementById("balanceTotal");

function updateAmounts() {
  const income = storedRecords.reduce((acc, record) => {
    return record.type === "income" ? acc + record.amount : acc;
  }, 0);

  const expense = storedRecords.reduce((acc, record) => {
    return record.type === "expense" ? acc + record.amount : acc;
  }, 0);

  const balance = income - expense;

  incomeTotal.innerText = formatter(income);
  expenseTotal.innerText = formatter(expense);
  balanceTotal.innerText = formatter(balance);
}

updateAmounts();

// Formatter for currency
function formatter(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// Records Table
const recordsTable = document.getElementById("recordsTable");

function renderRecords() {
  recordsTable.innerHTML = "";

  storedRecords.forEach((record) => {
    const displayNewRecord = document.createElement("tr");

    displayNewRecord.innerHTML = `
      <td>${record.description}</td>
      <td class="${record.type}">${formatter(record.amount)}</td>
      <td>${record.category}</td>
      <td>${new Intl.DateTimeFormat("pt-BR").format(
        new Date(record.createdAt)
      )}</td>
    `;

    recordsTable.appendChild(displayNewRecord);
  });

  updateAmounts();
}

renderRecords();

// Modal Window
const openModal = document.querySelector(".registry-button");
const closeModal = document.querySelector(".close-button");
const modal = document.querySelector(".registry-modal");

openModal.addEventListener("click", () => modal.showModal());
closeModal.addEventListener("click", () => modal.close());

// Modal Form
const modalForm = document.querySelector(".modal-form");

const descriptionInput = document.getElementById("descriptionInput");
const amountInput = document.getElementById("amountInput");
const categoryInput = document.getElementById("categoryInput");

const incomeButton = document.querySelector(".income-button");
const expenseButton = document.querySelector(".expense-button");
const submitButton = document.querySelector(".submit-button");

modalForm.addEventListener("submit", (e) => {
  e.preventDefault();

  createRecord({
    description: descriptionInput.value,
    amount: parseFloat(amountInput.value),
    type: incomeButton.classList.contains("active") ? "income" : "expense",
    category: categoryInput.value,
    createdAt: new Date(),
  });

  renderRecords();

  descriptionInput.value = "";
  amountInput.value = "";
  categoryInput.value = "";

  modal.close();
});

incomeButton.addEventListener("click", () => {
  incomeButton.classList.add("active");
  incomeButton.setAttribute("aria-checked", "true");

  expenseButton.classList.remove("active");
  expenseButton.setAttribute("aria-checked", "false");
});

expenseButton.addEventListener("click", () => {
  expenseButton.classList.add("active");
  expenseButton.setAttribute("aria-checked", "true");

  incomeButton.classList.remove("active");
  incomeButton.setAttribute("aria-checked", "false");
});
