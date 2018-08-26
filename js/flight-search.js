document.querySelectorAll(".search-results-container .results .result-cell").forEach(item => {
	item.addEventListener("click", () => {
		const selectedItemForm = document.forms[0];
		
		let departureTime = new Date(`${item.getAttribute("data-departure-date")}T${item.getAttribute("data-departure-time")}Z`);
		let arrivalTime = new Date(`${item.getAttribute("data-departure-date")}T${item.getAttribute("data-arrival-time")}Z`);
		
		console.log(departureTime);
		console.log(arrivalTime);
		
		let departureDate = new Date(item.getAttribute("data-departure-date"));
		departureDate.setHours(departureTime.getUTCHours());
		departureDate.setMinutes(departureTime.getUTCMinutes());
		
		let arrivalDate = new Date(item.getAttribute("data-departure-date"));
		arrivalDate.setHours(arrivalTime.getUTCHours());
		arrivalDate.setMinutes(arrivalTime.getUTCMinutes());
		if (arrivalTime.getTime() < departureTime.getTime()) {
			arrivalDate.setDate(arrivalDate.getDate() + 1);
		}
		
		console.log(departureDate);
		console.log(arrivalDate);
		
		selectedItemForm["depart_iata"].value = item.getAttribute("data-departure");
		selectedItemForm["arrv_iata"].value = item.getAttribute("data-arrival");
		selectedItemForm["depart_date"].value = departureDate.toISOString();
		selectedItemForm["arrv_date"].value = arrivalDate.toISOString();
		selectedItemForm["flight_number"].value = item.getAttribute("data-flight-number");
		
		// DO NOT USE THIS IN PRODUCTION!!!
		// This is for demonstration purposes only!
		selectedItemForm["price"].value = item.getAttribute("data-price");
		
		document.querySelectorAll(".search-results-container .results .result-cell.selected").forEach(item => {
			item.classList.remove("selected");
		});
		
		item.classList.add("selected");
		
		document.querySelector("button.continue-button").removeAttribute("disabled");
	});
});