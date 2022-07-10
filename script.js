const openModal = document.querySelector(".transaction-button");
const closeModal = document.querySelector(".close-button");
const modal = document.querySelector(".transaction-modal");

openModal.addEventListener("click", () => modal.showModal());
closeModal.addEventListener("click", () => modal.close());
