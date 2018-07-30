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