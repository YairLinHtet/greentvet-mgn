//Drop Down for Campaign
document.querySelectorAll(".lang-option").forEach((toggle) => {
  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    const dropdown = toggle.nextElementSibling;
    dropdown.classList.toggle("show");
  });
});

window.addEventListener("click", (e) => {
  if (!e.target.closest(".dropdown")) {
    document
      .querySelectorAll(".lang-dropdown")
      .forEach((dd) => dd.classList.remove("show"));
  }
});

document.querySelectorAll(".cam-choose").forEach((toggle) => {
  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    const dropdown = toggle.nextElementSibling;
    dropdown.classList.toggle("show");
  });
});

window.addEventListener("click", (e) => {
  if (!e.target.closest(".campaign")) {
    document
      .querySelectorAll(".cam-dropdown")
      .forEach((dd) => dd.classList.remove("show"));
  }
});

function showMenu() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "flex";
}
function hideMenu() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "none";
}
