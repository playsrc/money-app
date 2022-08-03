// Mock Database
let storedRecords = JSON.parse(localStorage.getItem("records")) || [];

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

      <button
        id=${record.id}
        class="button edit-button"
        aria-controls="editDialog"
      >
        <img src="./assets/pencil-simple-line.svg" />
      </button>
    `;

    recordsTable.appendChild(displayNewRecord);
  });

  updateAmounts();
  handleEditModal();
}

renderRecords();

// Registry Modal Window
const openModal = document.getElementById("registryButton");
const closeModal = document.getElementById("closeButton");
const modal = document.getElementById("dialog");

openModal.addEventListener("click", () => modal.showModal());
closeModal.addEventListener("click", () => modal.close());

// Modal Form
const modalForm = document.getElementById("modalForm");

const descriptionInput = document.getElementById("descriptionInput");
const amountInput = document.getElementById("amountInput");
const categoryInput = document.getElementById("categoryInput");

const incomeButton = document.getElementById("incomeButton");
const expenseButton = document.getElementById("expenseButton");
const submitButton = document.getElementById("submitButton");

modalForm.addEventListener("submit", (e) => {
  e.preventDefault();

  createRecord({
    id: new Date().getTime(),
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

// Edit Modal Window
function handleEditModal() {
  const openEditModal = document.querySelectorAll(".edit-button");
  const closeEditModal = document.querySelectorAll(".close-button");
  const editModal = document.getElementById("editDialog");

  openEditModal.forEach((editBtn) =>
    editBtn.addEventListener("click", () => {
      editModal.showModal();
      handleEditForm(parseInt(editBtn.id));
    })
  );

  closeEditModal.forEach((closeBtn) =>
    closeBtn.addEventListener("click", () => editModal.close())
  );
}

function handleEditForm(id) {
  console.log("event added");
  const editModal = document.getElementById("editDialog");
  const modalForm = document.getElementById("editForm");

  const descriptionInput = document.getElementById("descriptionEditInput");
  const amountInput = document.getElementById("amountEditInput");
  const categoryInput = document.getElementById("categoryEditInput");

  const submitButton = document.getElementById("editSubmitButton");
  const deleteButton = document.getElementById("deleteRegistryButton");

  storedRecords.forEach((record) => {
    if (id === record.id) {
      descriptionInput.value = record.description;
      amountInput.value = record.amount;
      categoryInput.value = record.category;
    }
  });

  modalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("submitted");
  });

  submitButton.addEventListener("click", () => {
    console.log(descriptionInput.value);

    localStorage.setItem(
      "records",
      JSON.stringify(
        storedRecords.map((record) => {
          const description = descriptionInput.value;
          const amount = parseFloat(amountInput.value);
          const category = categoryInput.value;

          if (record.id === id) {
            return {
              ...record,
              description,
              amount,
              category,
            };
          } else {
            return record;
          }
        })
      )
    );
    storedRecords = JSON.parse(localStorage.getItem("records")) || [];

    editModal.close();

    renderRecords();
  });

  deleteButton.addEventListener("click", () => {
    localStorage.setItem(
      "records",
      JSON.stringify(
        storedRecords.filter((record) => {
          if (record.id !== id) {
            return true;
          }
        })
      )
    );
    storedRecords = JSON.parse(localStorage.getItem("records")) || [];

    editModal.close();

    renderRecords();
  });
}

handleEditModal();
