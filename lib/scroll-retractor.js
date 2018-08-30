/**
 * scroll-retractor.js
 * FESTIVAL Aviation
 * 
 * Parallax scrolling for containers
 * 
 * @author Janik Schmidt (jani.schmidt@ostfalia.de)
 * @version 1.0
 */

class ScrollRetractor {
	constructor(params) {
		const scroll = this;

		// Initial configuration
		scroll.params = {
			scrollContainer: null,
			scrollElement: null,
			retractElement: null,
			minHeight: 0
		}
		Object.assign(scroll.params, params);

		// Calculate the initial height and apply it to the style
		scroll._initialHeight = scroll.params.retractElement.offsetHeight;
		Object.assign(scroll.params.scrollContainer.style, {
			paddingTop: `${scroll._initialHeight}px`
		});
	}

	// This method is usually called when a "scroll" event happened
	elementDidScroll() {
		const scroll = this;
		let scrollTop = scroll.params.scrollContainer.scrollTop;
		let scrollHeight = scroll.params.scrollContainer.scrollHeight - scroll.params.scrollContainer.offsetHeight;

		// Calculate the parrallax from the current scroll offset, limited by minimum height
		if (scrollTop <= scrollHeight) {
			Object.assign(scroll.params.retractElement.style, {
				maxHeight: `${Math.max(scroll._initialHeight - scrollTop, scroll.params.minHeight)}px`
			});
		}
	}
}