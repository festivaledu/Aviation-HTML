let lastExpirationLength = 0;

document.querySelectorAll("form input").forEach(el => {
	el.addEventListener("input", ev => {
		if (el.hasAttribute("data-corresponds")) {
			const c = el.getAttribute("data-corresponds");

			switch (c) {
				case "holder":
					document.getElementById("card-holder").innerText = el.value;
					break;
				case "number":
					el.value = el.value.replace(/[^\d]/g, "").replace(/(.{4})/g, "$1 ").trim();
					
					const numbers = el.value.split(" ");
					for (let i = 0; i < 4; i++) {
						if (numbers[i]) {
							document.querySelectorAll(".card .number span")[i].innerText = numbers[i].substr(0, 4) + "•".repeat(4 - numbers[i].substr(0, 4).length);
						} else {
							document.querySelectorAll(".card .number span")[i].innerText = "••••";
						}
					}
					
					break;
				case "expiration":
					document.getElementById("card-expiration").innerText = el.value;
					
					if (el.value.length > lastExpirationLength && el.value.length == 2) {
						el.value += "/";
					}
					
					lastExpirationLength = el.value.length;
					break;
			}
		}
	});
});

document.getElementById("modal-primary").addEventListener("click", ev => {
	document.querySelector("form button").classList.add("hidden");
	document.querySelector(".sk-folding-cube").classList.add("shown");
});