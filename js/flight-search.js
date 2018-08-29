/**
 * flight-search.js
 * FESTIVAL Aviation
 * 
 * This file contains all the logic client for the flight search
 * 
 * @author Janik Schmidt (jani.schmidt@ostfalia.de)
 * @version 1.0
 */

/**
 * Load JSON data from a URL and return a Promise to resolve
 * @param {String} file The URL to load JSON data from
 * @returns {Promise} A Promise that is resolved when the request is completed
 */
const loadJSON = (file) => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.overrideMimeType("application/json");
		xhr.open("GET", file);
		xhr.onload = resolve;
		xhr.onerror = reject;
		xhr.send();
	})
};

/**
 * POST form data to a URL and return a Promise to resolve
 * @param {String} file The URL to load POST form data to
 * @param {Array} data The form data to POST
 */
const postData = (file, data) => {
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

/**
 * Called when the passenger count is changed
 * Updates a hidden input field with a value between 1 and 10
 * @param {HTMLElement} e The event target that is passed from within the callee
 */
const passengerCountChanged = (e) => {
	document.forms["selectedItem"]["passengers"].value = e.value;
}

/**
 * Called when the flight class is changed
 * Updates a hidden input field with a string value
 * @param {HTMLElement} e The event target that is passed from within the callee
 */
const classChanged = (e) => {
	document.forms["selectedItem"]["flight_class"].value = e.value;
}

// All the logic for the page "booking-search.jsp"
if (location.pathname.match(/booking-search/)) {
	// This is basically the same logic as seen in "landing.js". Please see "landing.js" for details.
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


// All the logic for the page "booking-results.jsp"
if (location.pathname.match(/booking-results/)) {
	// Select all flight search result cells and add a click listener
	document.querySelectorAll(".search-results-container .results .result-cell").forEach(item => {
		item.addEventListener("click", () => {
			// Store a reference to the hidden form on this page
			const selectedItemForm = document.forms["selectedItem"];
			
			// Create Date objects from the item's departure and arrival time as ISO format
			// This is just used for parsing departure and arrival times in the correct timezone
			let departureTime = new Date(`${item.getAttribute("data-departure-date")}T${item.getAttribute("data-departure-time")}Z`);
			let arrivalTime = new Date(`${item.getAttribute("data-departure-date")}T${item.getAttribute("data-arrival-time")}Z`);
			
			// The actual date time objects
			let departureDate = new Date(item.getAttribute("data-departure-date"));
			departureDate.setHours(departureTime.getUTCHours());
			departureDate.setMinutes(departureTime.getUTCMinutes());
			
			let arrivalDate = new Date(item.getAttribute("data-departure-date"));
			arrivalDate.setHours(arrivalTime.getUTCHours());
			arrivalDate.setMinutes(arrivalTime.getUTCMinutes());
			
			// If the arrival time is before the departure time, add another 24 hours (or in this case 1 day)
			if (arrivalTime.getTime() < departureTime.getTime()) {
				arrivalDate.setDate(arrivalDate.getDate() + 1);
			}
			
			// Insert the parsed data into the hidden form (dates as ISO strings)
			selectedItemForm["depart_date"].value = departureDate.toISOString();
			selectedItemForm["arrv_date"].value = arrivalDate.toISOString();
			selectedItemForm["flight_number"].value = item.getAttribute("data-flight-number");
			
			// If we have an input field for the passenger count because we came directly from index.jsp, add this value to the hidden form
			if (document.querySelector(".search-results-header input[name=\"passengers\"]")) {
				selectedItemForm["passengers"].value = document.querySelector(".search-results-header input[name=\"passengers\"]").value;
			}
			
			// If we have an input field for the class because we came directly from index.jsp, add this value to the hidden form
			if (document.querySelector(".search-results-header select[name=\"flight_class\"]")) {
				selectedItemForm["flight_class"].value = document.querySelector(".search-results-header select[name=\"flight_class\"]").value;
			}
			
			// DO NOT USE THIS IN PRODUCTION!!!
			// This is for demonstration purposes only!
			selectedItemForm["duration"].value = arrivalDate.getTime() - departureDate.getTime();
			selectedItemForm["stops"].value = item.getAttribute("data-stops");
			selectedItemForm["price"].value = item.getAttribute("data-price");
			
			// Remove selected state from any other selected cell
			document.querySelectorAll(".search-results-container .results .result-cell.selected").forEach(item => {
				item.classList.remove("selected");
			});
			
			// Add selected state to this particular cell
			item.classList.add("selected");
			
			// Enable the continue button because we selected a cell
			document.querySelector("button.continue-button").removeAttribute("disabled");
		});
	});
}

// All the logic for the page "booking-services.jsp"
if (location.pathname.match(/booking-services/)) {
	// Select all the service result cells and add a click listener
	document.querySelectorAll(".search-results-container .results .result-cell").forEach(item => {
		item.addEventListener("click", () => {
			// Set references to the hidden form and currently selected services (split by ",")
			const selectedItemForm = document.forms["selectedItem"];
			const services = selectedItemForm["services"].value.split(",");
			
			if (services.indexOf(item.getAttribute("data-service-id")) >= 0) {
				// If services contains this service cell id, remove it
				item.classList.remove("selected");
				selectedItemForm["services"].value = selectedItemForm["services"].value.replace(`${item.getAttribute("data-service-id")},`, "");
			} else {
				// Otherwise add it to services array
				item.classList.add("selected");
				selectedItemForm["services"].value += `${item.getAttribute("data-service-id")},`;
			}
		});
	});
}

// All the logic for the page "booking-billing"
if (location.pathname.match(/booking-billing/)) {
	// Add a click listener to the continue button
	document.querySelector(".continue-button").addEventListener("click", () => {
		// Create an array for the billing address values that will be used later to POST
		const billingAddressData = [];
		
		// Check if every form element has data (value.length != 0)
		for (var i=0; i<document.forms["billingAddress"].elements.length; i++) {
			let item = document.forms["billingAddress"].elements[i];
			
			if (!item.value.length) {
                // alert("Bitte fülle alle Felder aus, damit deine Rechnungsadresse gespeichert werden kann.");
				
				// Thanks to Fabian Krahtz for converting this to his amazing modals!
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
			
			// Add the form data as key=value notation
			billingAddressData.push(`${item.name}=${item.value}`);
		};
		
		// Here we submit the billing address details to the server
		postData("update_billing.jsp", billingAddressData).then(e => {
			const data = JSON.parse(e.target.response);
			if (data.code == 200) {
				// If the request was successful, we can finally submit the hidden form to the server to complete the booking
				document.forms["selectedItem"]["billingId"].value = data["billingId"];
				document.forms["selectedItem"].submit();
			} else {
				// If the request was not successful, we display an alert that the request was unsuccessful and why
				// alert(`Da hat etwas nicht geklappt. Der Server hat mit folgender Nachricht geantwortet:\n\n${data.message}`);
			
				// Thanks to Fabian Krahtz for converting this to his amazing modals!
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