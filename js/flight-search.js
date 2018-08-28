const loadJSON = (file, callback, callbackError) => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.overrideMimeType("application/json");
		xhr.open("GET", file);
		xhr.onload = resolve;
		xhr.onerror = reject;
		xhr.send();
	})
};

const postData = (file, data, callback, callbackError) => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.overrideMimeType("application/json");
		xhr.open("POST", file);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.onload = resolve;
		xhr.onerror = reject;
		xhr.send(data.join("&"));
	});
};

const passengerCountChanged = (e) => {
	document.forms["selectedItem"]["passengers"].value = e.value;
}

const classChanged = (e) => {
	document.forms["selectedItem"]["flight_class"].value = e.value;
}

if (location.pathname.match(/booking-search/)) {
	let inputTimeout;
	document.querySelectorAll(".search-results-header .column[data-key]:not([data-key=\"date\"])").forEach(container => {
		container.querySelector("input:not([name])").addEventListener("input", e => {
			const suggestionWrapper = container.querySelector(".suggestions");
			const suggestionContainer = container.querySelector(".suggestions .suggestions-list");

			if (!e.target.value.length) {
				suggestionWrapper.classList.remove("visible");

				if (inputTimeout) {
					clearTimeout(inputTimeout);
				}
				return;
			}
			if (inputTimeout) {
				clearTimeout(inputTimeout);
			}

			inputTimeout = setTimeout(async () => {
				const suggestionData = await loadJSON(`airport_lookup.jsp?query=${escape(e.target.value)}`).then(e => { return JSON.parse(e.target.response); });

				suggestionWrapper.classList.add("visible");
				suggestionContainer.innerHTML = "";

				if (suggestionData["code"] == 200) {
					suggestionData["items"].forEach(suggestion => {
						let child = document.createElement("li");
						child.className = "suggestion-item";
						child.setAttribute("data-iata", suggestion["iata_code"]);
						child.innerHTML = suggestion["name"];

						child.addEventListener("click", () => {
							container.querySelector("input:not([name])").value = suggestion["name"];
							container.querySelector("input[name]").value = suggestion["iata_code"];

							suggestionWrapper.classList.remove("visible");
						});

						suggestionContainer.appendChild(child);
					});
				} else if (suggestionData["code"] == 500) {
					let child = document.createElement("li");
					child.className = "suggestion-item no-results";
					child.innerHTML = "Internal Server Error";
					suggestionContainer.appendChild(child);
				} else {
					let child = document.createElement("li");
					child.className = "suggestion-item no-results";
					child.innerHTML = "Keine Ergebnisse";
					suggestionContainer.appendChild(child);
				}
			}, 500);
		});

		// container.querySelector("input:not([name])").addEventListener("blur", e => {
		// 	container.querySelector(".suggestions").classList.remove("visible");
		// });
	});

	document.querySelectorAll(".calendar").forEach(item => {
		new Calendar(item, {
			onDateSelected: (date) => {
				document.querySelector(".search-results-header .column[data-key=\"date\"] input:not([name])").value = date.toLocaleDateString("de-DE", {
					day: "numeric",
					month: "long",
					year: "numeric"
				});
				document.querySelector(".search-results-header .column[data-key=\"date\"] input[name]").value = date.toISOString();
				item.classList.remove("visible");
			},
			hidePast: true
		});
	});
	
	document.querySelector(".search-results-header .column[data-key=\"date\"] input:not([name])").addEventListener("focus", () => {
		document.querySelector(".search-results-header .column[data-key=\"date\"] .calendar").classList.add("visible");
	});
}

if (location.pathname.match(/booking-results/)) {
	document.querySelectorAll(".search-results-container .results .result-cell").forEach(item => {
		item.addEventListener("click", () => {
			const selectedItemForm = document.forms["selectedItem"];
			
			let departureTime = new Date(`${item.getAttribute("data-departure-date")}T${item.getAttribute("data-departure-time")}Z`);
			let arrivalTime = new Date(`${item.getAttribute("data-departure-date")}T${item.getAttribute("data-arrival-time")}Z`);
			
			let departureDate = new Date(item.getAttribute("data-departure-date"));
			departureDate.setHours(departureTime.getUTCHours());
			departureDate.setMinutes(departureTime.getUTCMinutes());
			
			let arrivalDate = new Date(item.getAttribute("data-departure-date"));
			arrivalDate.setHours(arrivalTime.getUTCHours());
			arrivalDate.setMinutes(arrivalTime.getUTCMinutes());
			if (arrivalTime.getTime() < departureTime.getTime()) {
				arrivalDate.setDate(arrivalDate.getDate() + 1);
			}
			
			selectedItemForm["depart_date"].value = departureDate.toISOString();
			selectedItemForm["arrv_date"].value = arrivalDate.toISOString();
			selectedItemForm["flight_number"].value = item.getAttribute("data-flight-number");
			
			if (document.querySelector(".search-results-header input[name=\"passengers\"]")) {
				selectedItemForm["passengers"].value = document.querySelector(".search-results-header input[name=\"passengers\"]").value;
			}
			
			if (document.querySelector(".search-results-header select[name=\"flight_class\"]")) {
				selectedItemForm["flight_class"].value = document.querySelector(".search-results-header select[name=\"flight_class\"]").value;
			}
			
			// DO NOT USE THIS IN PRODUCTION!!!
			// This is for demonstration purposes only!
			selectedItemForm["duration"].value = arrivalDate.getTime() - departureDate.getTime();
			selectedItemForm["stops"].value = item.getAttribute("data-stops");
			selectedItemForm["price"].value = item.getAttribute("data-price");
			
			document.querySelectorAll(".search-results-container .results .result-cell.selected").forEach(item => {
				item.classList.remove("selected");
			});
			
			item.classList.add("selected");
			
			document.querySelector("button.continue-button").removeAttribute("disabled");
		});
	});
}

if (location.pathname.match(/booking-services/)) {
	document.querySelectorAll(".search-results-container .results .result-cell").forEach(item => {
		item.addEventListener("click", () => {
			const selectedItemForm = document.forms["selectedItem"];
			const services = selectedItemForm["services"].value.split(",");
			
			if (services.indexOf(item.getAttribute("data-service-id")) >= 0) {
				item.classList.remove("selected");
				selectedItemForm["services"].value = selectedItemForm["services"].value.replace(`${item.getAttribute("data-service-id")},`, "");
			} else {
				item.classList.add("selected");
				selectedItemForm["services"].value += `${item.getAttribute("data-service-id")},`;
			}
		});
	});
}

if (location.pathname.match(/booking-billing/)) {
	document.querySelector(".continue-button").addEventListener("click", () => {
		const billingAddressData = [];
		for (var i=0; i<document.forms["billingAddress"].elements.length; i++) {
			let item = document.forms["billingAddress"].elements[i];
			
			if (!item.value.length) {
                // alert("Bitte fülle alle Felder aus, damit deine Rechnungsadresse gespeichert werden kann.");
                
                modal.classList.remove("error", "info", "question", "success", "warning");
                modal.classList.add("error");
                modalTitle.style.visibility = "visible";
                modalTitle.innerText = "Ungültige Eingabe";
                modalTitleBar.hidden = false;
                modalPrimary.style.visibility = "hidden";
                modalText.innerText = "Bitte fülle alle Felder aus, damit deine Rechnungsadresse gespeichert werden kann.";
                document.body.classList.add("modal-open");

				return;
			}
			billingAddressData.push(`${item.name}=${item.value}`);
		};
		
		postData("update_billing.jsp", billingAddressData).then(e => {
			const data = JSON.parse(e.target.response);
			if (data.code == 200) {
				document.forms["selectedItem"]["billingId"].value = data["billingId"];
				document.forms["selectedItem"].submit();
			} else {
				// alert(`Da hat etwas nicht geklappt. Der Server hat mit folgender Nachricht geantwortet:\n\n${data.message}`);
            
                modal.classList.remove("error", "info", "question", "success", "warning");
                modal.classList.add("error");
                modalTitle.style.visibility = "visible";
                modalTitle.innerText = "Da hat etwas nicht geklappt";
                modalTitleBar.hidden = false;
                modalPrimary.style.visibility = "hidden";
                modalText.innerText = `Es tut uns Leid, aber auf unserer Seite ist ein Fehler aufgetreten. Der Server hat mit folgender Nachricht geantwortet:\n\n${data.message}\n\nBitte versuch es später noch einmal.`;
                document.body.classList.add("modal-open");
            }
		});
	});
}