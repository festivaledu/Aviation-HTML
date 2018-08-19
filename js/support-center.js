document.querySelectorAll("article.card a").forEach(el => {
    el.addEventListener("click", ev => {
        ev.target.classList.add("test");
        navigateWithFiller(ev.target.parentElement.getAttribute("data-message"), ev.target.getAttribute("href"));
        ev.preventDefault();
    });
});

closeFiller();

function navigateWithFiller(msg, url) {
    openFiller(msg);
    setTimeout(() => {
        // window.open(url);
        location.reload();
    }, 1500);
}

function openFiller(msg) {
    document.querySelector(".filler").classList.add("l", "show");
    document.querySelector(".filler-message").innerHTML = msg;
}

function closeFiller() {
    document.querySelector(".filler").classList.remove("show");
    setTimeout(() => {
        document.querySelector(".filler").classList.remove("r");
    }, 700);
}