/**
 * landing.js
 * FESTIVAL Aviation
 * 
 * This script handles all the logic found on index.jsp
 * 
 * @author Janik Schmidt (jani.schmidt@ostfalia.de)
 * @version 0.4-1
 */

// Store the promo text containers and their parallax headers in arrays
let animatables = [];
let scrollRetractors = [];

// Select all DOM elements containing the attribute "data-spring-animatable"
document.querySelectorAll("[data-spring-animatable]").forEach(item => {
	// Continue only if there is a accompanying target
	let target = document.querySelector(`[data-spring-animatable-target="${item.getAttribute("data-spring-animatable")}"]`);
	if (!target) {
		return;
	}

	// Initialize the Scroll Retractor component for this element
	let scrollContainer = target.querySelector(".content-scroll-wrapper"),
		scroll = target.querySelector(".content"),
		retract = target.querySelector(".header");

	let retractor = new ScrollRetractor({
		scrollContainer: scrollContainer,
		scrollElement: scroll,
		retractElement: retract,
		minHeight: 200
	});

	// Should probably move this inside the ScrollRetractor object
	scrollContainer.addEventListener("scroll", () => {
		retractor.elementDidScroll();
	});

	// Initialize the Spring Animation
	let animatable = new SpringAnimatable({
		identifier: item.getAttribute("data-spring-animatable"),	// Use the item's ID as an animation identifier
		classList: ["promo-animatable"],	// A list of CSS classes to add to the item
		originElement: item,	// This is the element where the animation begins from
		targetElement: document.querySelector(`[data-spring-animatable-target="${item.getAttribute("data-spring-animatable")}"]`),	// This is the element where the animation should stop

		// Return a function to be called everytime this animation is triggered
		// This controls the target frame
		targetFrame: () => {
			if (window.innerWidth < 768) {
				return {
					origin: {
						x: 0,
						y: 0
					},
					size: {
						width: window.innerWidth,
						height: window.innerHeight
					}
				}
			}

			return {
				origin: {
					x: window.innerWidth / 2 - 630 / 2,
					y: window.innerHeight / 2 - 630 / 2
				},
				size: {
					width: 630,
					height: 630
				}
			}
		},

		// Some math stuff
		// The iOS app I created for this calculated these for me
		spring: {
			mass: 1,
			stiffness: 351.77878,
			damping: 28.13365
		}
	});

	// If a promo container is clicked, trigger the animation
	item.addEventListener("click", () => {
		animatables.forEach(anim => {
			anim._clearHideTimeout();
		})

		animatable.start();

		// Unhide the background
		document.querySelector(".spring-background").classList.add("visible");

		// Reset the scroll offset because it looks better
		target.querySelector(".content-scroll-wrapper").scrollTop = 0;
	});

	// Reverse the animation if the close button was clicked
	if (target.querySelector(".close-button")) {
		target.querySelector(".close-button").addEventListener("click", () => {
			animatable.reverse();

			// Hide the background
			document.querySelector(".spring-background").classList.remove("visible");
		});
	}

	// Push the animatable object into the animatables array
	animatables.push(animatable);
});

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

// This variable is needed to not constantly strain the server with requests. Blame Apache for their bad software!
let inputTimeout;

// Select all input containers from the hero bar that are not the date selector
document.querySelectorAll(".hero-search-bar .input-wrapper[data-key]:not([data-key=\"date\"])").forEach(container => {
	// Add a click listener to the visible input (the one that doesn't have a name tag)
	container.querySelector("input:not([name])").addEventListener("input", e => {
		// Select the the suggestions containers
		const suggestionWrapper = container.querySelector(".suggestions");
		const suggestionContainer = container.querySelector(".suggestions .suggestions-list");

		// If the input value is empty (length == 0), remove the "visible" class and clear the input timeout
		if (!e.target.value.length) {
			suggestionWrapper.classList.remove("visible");
			suggestionContainer.innerHTML = "";

			if (inputTimeout) {
				clearTimeout(inputTimeout);
			}
			return;
		}

		// Clear the input timeout if it exists
		if (inputTimeout) {
			clearTimeout(inputTimeout);
		}

		// Load requests 500ms after the last input event
		inputTimeout = setTimeout(async () => {
			// airport_lookup.jsp searches through all airports matching a certain query (all airports matching iata_code or gps_code, or 5 results matching name or municipality)
			const suggestionData = await loadJSON(`airport_lookup.jsp?query=${escape(e.target.value)}`).then(e => { return JSON.parse(e.target.response); });

			// Show the suggestions container, clear all previous results
			suggestionWrapper.classList.add("visible");
			suggestionContainer.innerHTML = "";

			// Code 200 means OK, we got some airport data
			if (suggestionData["code"] == 200) {
				// Create new DOM elements for every suggestion item
				suggestionData["items"].forEach(suggestion => {
					let child = document.createElement("li");
					child.className = "suggestion-item";
					child.setAttribute("data-iata", suggestion["iata_code"]);
					child.innerHTML = suggestion["name"];

					// Add a click event to add IATA code into the hidden input and the name into the visible output
					child.addEventListener("click", () => {
						container.querySelector("input:not([name])").value = suggestion["name"];
						container.querySelector("input[name]").value = suggestion["iata_code"];

						// Item clicked, hide suggestions
						suggestionWrapper.classList.remove("visible");
					});

					// Append the DOM element to the list of suggestions
					suggestionContainer.appendChild(child);
				});
			} else if (suggestionData["code"] == 500) {
				// Code 500 means Internal Server Error
				// Insert a child indicating a server error
				let child = document.createElement("li");
				child.className = "suggestion-item no-results";
				child.innerHTML = "Internal Server Error";
				suggestionContainer.appendChild(child);
			} else {
				// In any other case, we get a Code 404 Not Found
				let child = document.createElement("li");
				child.className = "suggestion-item no-results";
				child.innerHTML = "Keine Ergebnisse";
				suggestionContainer.appendChild(child);
			}
		}, 500);
	});
});

// Initialize the calendar selector inside the hero search bar
document.querySelectorAll(".hero-search-bar .input-wrapper[data-key=\"date\"] .calendar").forEach(item => {
	new Calendar(item, {
		onDateSelected: (date) => {
			// This event is fired when a date is selected
			// Here we format the date into a localized string and insert it into the visible input field
			document.querySelector(".hero-search-bar .input-wrapper[data-key=\"date\"] input:not([name])").value = date.toLocaleDateString("de-DE", {
				day: "numeric",
				month: "long",
				year: "numeric"
			});

			// Convert the date into a ISO string (Zulu time) and insert it into the hidden input field
			document.querySelector(".hero-search-bar .input-wrapper[data-key=\"date\"] input[name]").value = date.toISOString();

			// Hide the calendar
			item.classList.remove("visible");
		},
		hidePast: true
	});
});

// If we focus the date input field, show the calendar selector
document.querySelector(".hero-search-bar .input-wrapper[data-key=\"date\"] input:not([name])").addEventListener("focus", () => {
	document.querySelector(".hero-search-bar .input-wrapper[data-key=\"date\"] .calendar").classList.add("visible");
});