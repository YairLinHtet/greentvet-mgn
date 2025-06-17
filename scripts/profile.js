// Profiles for team

const carousel = document.querySelector(".carousel");
const arrowbtns = document.querySelectorAll(".wrapper .arrow");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;

let isDragging = false,
  startX,
  stratScrollLeft;

arrowbtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
  });
});
const startDrag = (e) => {
  isDragging = true;
  carousel.classList.add("dragging");
  startX = e.pageX;
  stratScrollLeft = carousel.scrollLeft;
};
const dragging = (e) => {
  if (!isDragging) return;
  carousel.scrollLeft = stratScrollLeft - (e.pageX - startX);
};

const stopDrag = () => {
  isDragging = false;
  carousel.classList.remove("dragging");
};

carousel.addEventListener("mousedown", startDrag);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", stopDrag);

// Profile for Volunteers
