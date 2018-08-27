let animatables = [];
let scrollRetractors = [];
document.querySelectorAll("[data-spring-animatable]").forEach(item => {
	let target = document.querySelector(`[data-spring-animatable-target="${item.getAttribute("data-spring-animatable")}"]`);
	if (!target) {
		return;
	}

	// Scroll Retractor
	let scrollContainer = target.querySelector(".content-scroll-wrapper"),
		scroll = target.querySelector(".content"),
		retract = target.querySelector(".header");

	let retractor = new ScrollRetractor({
		scrollContainer: scrollContainer,
		scrollElement: scroll,
		retractElement: retract,
		minHeight: 200
	});

	scrollContainer.addEventListener("scroll", () => {
		retractor.elementDidScroll();
	});

	// Spring Animation
	let animatable = new SpringAnimatable({
		identifier: item.getAttribute("data-spring-animatable"),
		classList: ["promo-animatable"],
		originElement: item,
		targetElement: document.querySelector(`[data-spring-animatable-target="${item.getAttribute("data-spring-animatable")}"]`),
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
		spring: {
			mass: 1,
			stiffness: 351.77878,
			damping: 28.13365
		}
	});

	item.addEventListener("click", () => {
		animatables.forEach(anim => {
			anim._clearHideTimeout();
		})

		animatable.start();
		document.querySelector(".spring-background").classList.add("visible");
		target.querySelector(".content-scroll-wrapper").scrollTop = 0;
	});

	if (target.querySelector(".close-button")) {
		target.querySelector(".close-button").addEventListener("click", () => {
			animatable.reverse();
			document.querySelector(".spring-background").classList.remove("visible");
		});
	}

	animatables.push(animatable);
});

// Search Experiment
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


let inputTimeout;
document.querySelectorAll(".hero-search-bar .input-wrapper:not([data-key=\"date\"])").forEach(container => {
	container.querySelector("input:not([name])").addEventListener("input", e => {
		const suggestionWrapper = container.querySelector(".suggestions");
		const suggestionContainer = container.querySelector(".suggestions .suggestions-list");

		if (!e.target.value.length) {
			suggestionContainer.classList.remove("visible");

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

			if (suggestionData.length) {
				suggestionData.forEach(suggestion => {
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
			document.querySelector(".hero-search-bar .input-wrapper[data-key=\"date\"] input:not([name])").value = date.toLocaleDateString("de-DE", {
				day: "numeric",
				month: "long",
				year: "numeric"
			});
			document.querySelector(".hero-search-bar .input-wrapper[data-key=\"date\"] input[name]").value = date.toISOString();
		},
		hidePast: true
	});
});

document.querySelector(".hero-search-bar .input-wrapper[data-key=\"date\"] input:not([name])").addEventListener("focus", () => {
	document.querySelector(".hero-search-bar .input-wrapper[data-key=\"date\"] .calendar").classList.add("visible");
});