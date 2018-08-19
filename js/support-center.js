document.querySelectorAll(".faq-card-header").forEach(el => {
    el.addEventListener("click", ev => {
        ev.target.parentElement.classList.toggle("expanded");
    });
});