const openModal = document.querySelector(".registry-button");
const closeModal = document.querySelector(".close-button");
const modal = document.querySelector(".registry-modal");

openModal.addEventListener("click", () => modal.showModal());
closeModal.addEventListener("click", () => modal.close());
