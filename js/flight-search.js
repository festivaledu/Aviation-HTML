// let inputTimeout;
// document.querySelectorAll(".search-results-header .column[data-key]:not([data-key=\"date\"])").forEach(container => {
// 	container.querySelector("input:not([name])").addEventListener("input", e => {
// 		const suggestionContainer = container.querySelector(".suggestions");
		
// 		if (!e.target.value.length) {
// 			suggestionContainer.classList.remove("visible");
			
// 			if (inputTimeout) {
// 				clearTimeout(inputTimeout);
// 			}
// 			return;
// 		}
// 		if (inputTimeout) {
// 			clearTimeout(inputTimeout);
// 		}
		
// 		inputTimeout = setTimeout(async () => {
// 			const suggestionData = await loadJSON(`airport_lookup.jsp?query=${escape(e.target.value)}`).then(e => { return JSON.parse(e.target.response); });
			
// 			suggestionContainer.classList.add("visible");
// 			suggestionContainer.innerHTML = "";
			
// 			suggestionData.forEach(suggestion => {
// 				let child = document.createElement("li");
// 				child.className = "suggestion-item";
// 				child.setAttribute("data-iata", suggestion["iata_code"]);
// 				child.innerHTML = suggestion["municipality"] || suggestion["name"];
				
// 				child.addEventListener("click", () => {
// 					container.querySelector("input:not([name])").value = suggestion["municipality"] || suggestion["name"];
// 					container.querySelector("input[name]").value = suggestion["iata_code"];
					
// 					suggestionContainer.classList.remove("visible");
// 				});
				
// 				suggestionContainer.appendChild(child);
// 			});
// 		}, 500);
// 	});
	
// 	// container.querySelector("input:not([name])").addEventListener("blur", e => {
// 	// 	container.querySelector(".suggestions").classList.remove("visible");
// 	// });
// });

const passengerCountChanged = (e) => {
	document.forms[0]["passengers"].value = e.value;
}

const classChanged = (e) => {
	document.forms[0]["flight_class"].value = e.value;
}

document.querySelectorAll(".search-results-container .results .result-cell").forEach(item => {
	item.addEventListener("click", () => {
		const selectedItemForm = document.forms[0];
		
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
		
		selectedItemForm["depart_iata"].value = item.getAttribute("data-departure");
		selectedItemForm["arrv_iata"].value = item.getAttribute("data-arrival");
		selectedItemForm["depart_date"].value = departureDate.toISOString();
		selectedItemForm["arrv_date"].value = arrivalDate.toISOString();
		selectedItemForm["flight_number"].value = item.getAttribute("data-flight-number");
		selectedItemForm["passengers"].value = document.querySelector("input[name=\"passengers\"]").value;
		selectedItemForm["flight_class"].value = document.querySelector("select[name=\"flight_class\"]").value;
		
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