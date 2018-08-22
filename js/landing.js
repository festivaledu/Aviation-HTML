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

/*let destTimeout;
document.querySelector(".hero-search-bar .input-wrapper[data-key=\"departure\"] input#depart").addEventListener("input", (e) => {
	console.log(e.target.value);
	
	if (destTimeout) {
		clearTimeout(destTimeout);
	}
	
	destTimeout = setTimeout(async () => {
		const suggestionData = await loadJSON(`airport_lookup.jsp?query=${escape(e.target.value)}`).then(e => { return JSON.parse(e.target.response); });

		const suggestionContainer = document.querySelector(".hero-search-bar .input-wrapper[data-key=\"departure\"] .suggestions");
		suggestionContainer.classList.add("visible");
		suggestionContainer.innerHTML = "";
		
		suggestionData.forEach(suggestion => {
			let child = document.createElement("li");
			child.className = "suggestion-item";
			child.setAttribute("data-iata", suggestion["iata_code"]);
			child.innerHTML = `${suggestion["name"]}, ${suggestion["iso_country"]}`;
			suggestionContainer.appendChild(child);
		});
	}, 500);
});*/

let inputTimeout;
document.querySelectorAll(".hero-search-bar .input-wrapper[data-key]").forEach(container => {
	container.querySelector("input:not([name])").addEventListener("input", e => {
		if (inputTimeout) {
			clearTimeout(inputTimeout);
		}
		
		inputTimeout = setTimeout(async () => {
			const suggestionData = await loadJSON(`airport_lookup.jsp?query=${escape(e.target.value)}`).then(e => { return JSON.parse(e.target.response); });
			
			const suggestionContainer = container.querySelector(".suggestions");
			suggestionContainer.classList.add("visible");
			suggestionContainer.innerHTML = "";
			
			suggestionData.forEach(suggestion => {
				let child = document.createElement("li");
				child.className = "suggestion-item";
				child.setAttribute("data-iata", suggestion["iata_code"]);
				child.innerHTML = suggestion["name"];
				
				child.addEventListener("click", () => {
					container.querySelector("input:not([name])").value = suggestion["name"];
					container.querySelector("input[name]").value = suggestion["iata_code"];
					
					suggestionContainer.classList.remove("visible");
				});
				
				suggestionContainer.appendChild(child);
			});
		}, 500);
	});
	
	// container.querySelector("input:not([name])").addEventListener("blur", e => {
	// 	container.querySelector(".suggestions").classList.remove("visible");
	// });
});