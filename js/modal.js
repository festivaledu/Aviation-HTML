const triggers = document.querySelectorAll(".modal-trigger");
const modal = document.querySelector(".modal");
const modalTitleBar = document.getElementById("modal-title-bar");
const modalTitle = document.getElementById("modal-title");
const modalText = document.getElementById("modal-text");
const modalPrimary = document.getElementById("modal-primary");
const modalClose = document.getElementById("modal-close");

if (triggers) {
    triggers.forEach(el => {
        el.addEventListener("click", ev => {
            ev.preventDefault();

            if (document.querySelector(".modal")) {
                modal.classList.remove("error", "info", "question", "success", "warning");
                
                if (el.hasAttribute("data-modal-type")) {
                    modal.classList.add(el.getAttribute("data-modal-type"));
                }

                if (el.hasAttribute("data-modal-title")) {
                    modalTitle.style.visibility = "visible";
                    modalTitle.innerText = el.getAttribute("data-modal-title");
                } else {
                    modalTitle.style.visibility = "hidden";
                }
            
                modalTitleBar.hidden = !el.hasAttribute("data-modal-type") && !el.hasAttribute("data-modal-title");
            
                if (el.hasAttribute("data-modal-primary") && el.hasAttribute("data-modal-primary-action")) {
                    modalPrimary.style.visibility = "visible";
                    modalPrimary.innerText = el.getAttribute("data-modal-primary");

                    modal.setAttribute("data-primary-action", el.getAttribute("data-modal-primary-action"));
                    
                    if (el.hasAttribute("data-modal-primary-action-target")) {
                        modal.setAttribute("data-primary-action-target", el.getAttribute("data-modal-primary-action-target"));
                    }

                    if (el.hasAttribute("data-modal-primary-action-timeout")) {
                        modal.setAttribute("data-primary-action-timeout", el.getAttribute("data-modal-primary-action-timeout"));
                    }
                } else {
                    modalPrimary.style.visibility = "hidden";
                }

                if (el.hasAttribute("data-modal-secondary")) {
                    modalClose.innerText = el.getAttribute("data-modal-secondary");
                }

                if (el.hasAttribute("data-modal-text")) {
                    modalText.innerText = el.getAttribute("data-modal-text");
                }

                document.body.classList.add("modal-open");
            } else {
                if (el.hasAttribute("data-modal-text")) {
                    alert(el.getAttribute("data-modal-text"));
                }
            }
        });
    });
}

if (modalPrimary) {
    modalPrimary.addEventListener("click", ev => {
        ev.preventDefault();
        document.body.classList.remove("modal-open");

        let timeout = 0;
        if (modal.hasAttribute("data-primary-action-timeout")) {
            timeout = modal.getAttribute("data-primary-action-timeout");
        }

        setTimeout(() => {
            switch (modal.getAttribute("data-primary-action")) {
                case "submit": {
                    if (!modal.hasAttribute("data-primary-action-target")) {
                        document.querySelector("form").submit();
                    } else {
                        document.querySelector(modal.getAttribute("data-primary-action-target")).submit();
                    }
                    break;
                }
            }
        }, timeout);
    });
}

if (modalClose) {
    modalClose.addEventListener("click", ev => {
        ev.preventDefault();
        document.body.classList.remove("modal-open");
    });
}