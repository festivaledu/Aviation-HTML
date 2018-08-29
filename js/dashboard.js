if (document.querySelectorAll(".cancel")) {
    document.querySelectorAll(".cancel").forEach(el => {
        el.addEventListener("click", ev => {
            const bookingId = el.getAttribute("data-b-id");
            const holder = el.getAttribute("data-b-holder");
            const svid = el.getAttribute("data-b-svid");
            const email = el.getAttribute("data-b-email");

            preparePost("sc-cancellations.jsp", { bookingId: bookingId, holder: holder, svid: svid, email: email, message: "Storniert durch Dashboard" });
        });
    });
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