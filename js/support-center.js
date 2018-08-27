const ps = window.location.search.slice(1).split("&");
const params = ps.map(p => {
    if (!p.includes("=")) {
        return { k: p, v: "" };
    }

    return { k: p.split("=")[0], v: p.split("=")[1] };
});

while (params.findIndex(p => p.k === "") > -1) {
    params.splice(params.findIndex(p => p.k === ""), 1);
}

if (params.some(p => p.k === "q")) {
    const q = params.find(p => p.k === "q").v;
    const card = document.querySelector(`[data-q="${q}"]`);
    const link = document.querySelector(`[data-q-link="${q}"]`);

    if (card) {
        card.classList.add("expanded");
    }

    if (link) {
        link.classList.add("selected");
    }
}

if (document.querySelectorAll(".faq-card[data-q]")) {
    document.querySelectorAll(".faq-card[data-q]").forEach(el => {
        const q = el.getAttribute("data-q");

        document.querySelector(`.faq-card[data-q="${q}"] .faq-card-content`).innerHTML += `<a href="${getURLForQuery(el.getAttribute("data-q"))}" class="permalink">Permalink zu dieser Frage</a>`;
    });
}

if (document.querySelector(".sc-menu.contents .heading")) {
    document.querySelector(".sc-menu.contents .heading").addEventListener("click", ev => {
        ev.target.parentElement.classList.toggle("expanded");
    });
}

if (document.querySelectorAll(".sc-menu.contents a:not(.selected)")) {
    document.querySelectorAll(".sc-menu.contents a:not(.selected)").forEach(el => {
        el.addEventListener("click", ev => {
            ev.preventDefault();
            ev.stopPropagation();

            if (el.hasAttribute("data-q-link") && el.getAttribute("data-q-link")) {
                const q = el.getAttribute("data-q-link");

                window.location.assign(getURLForQuery(q));
            }
        });
    });
}

if (document.querySelectorAll(".faq-card-header")) {
    document.querySelectorAll(".faq-card-header").forEach(el => {
        el.addEventListener("click", ev => {
            ev.target.parentElement.classList.toggle("expanded");

            if (document.querySelector(".sc-menu.contents a.selected")) {
                document.querySelector(".sc-menu.contents a.selected").classList.remove("selected");
            }

            if (ev.target.parentElement.classList.contains("expanded")) {
                document.querySelector(`[data-q-link="${ev.target.parentElement.getAttribute("data-q")}"]`).classList.add("selected");
            }
        });
    });
}

if (document.querySelectorAll(".editor .update")) {
    document.querySelectorAll(".editor .update").forEach(el => {
        el.addEventListener("click", ev => {
            const id = el.getAttribute("data-q-id");
            const question = document.querySelector(`[data-q-question="${id}"]`).value;
            const answer = document.querySelector(`[data-q-answer="${id}"]`).value;

            preparePost("sc-admin.jsp", { method: "update", id: id, question: question, answer: answer });
        });
    });
}

if (document.querySelectorAll(".editor .delete")) {
    document.querySelectorAll(".editor .delete").forEach(el => {
        el.addEventListener("click", ev => {
            const id = el.getAttribute("data-q-id");

            preparePost("sc-admin.jsp", { method: "delete", id: id });
        });
    });
}

if (document.querySelectorAll(".editor .insert")) {
    document.querySelectorAll(".editor .insert").forEach(el => {
        el.addEventListener("click", ev => {
            const id = document.getElementById("new-question-id").value;
            const question = document.getElementById("new-question-question").value;
            const answer = document.getElementById("new-question-answer").value;

            preparePost("sc-admin.jsp", { method: "insert", id: id, question: question, answer: answer });
        });
    });
}

function getURLForQuery(query) {
    if (params.some(p => p.k === "q")) {
        params.find(p => p.k === "q").v = query;
    } else {
        params.push({ k: "q", v: query });
    }

    const paramString = "?" + params.map(p => {
        if (p.v === "") {
            return p.k;
        }
        return `${p.k}=${p.v}`;
    }).join("&");

    if (window.location.search === "") {
        return window.location.href + paramString;
    } else {
        return window.location.href.replace(window.location.search, paramString);
    }
}

function preparePost(path, params) {
    let form;

    if (document.getElementById("hidden-form")) {
        form = document.getElementById("hidden-form");
        form.innerHTML = "";
    } else {
        form = document.createElement("form");
        form.setAttribute("id", "hidden-form");
        document.body.appendChild(form);
    }

    form.setAttribute("method", "POST");
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }
}