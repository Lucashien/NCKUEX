const openModalButton = document.getElementById("open-modal");

openModalButton.addEventListener("click", showModal);

function showModal() {
    const modal = document.createElement("div");
    modal.id = "modal";
    document.body.appendChild(modal);
  
    fetch("./personal_page.html")
      .then(response => response.text())
      .then(html => {
        modal.innerHTML = html;
        modal.classList.add("visible");
      });
  }