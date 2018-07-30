/**
 * scroll-retractor.js
 * Version 1.0 BETA
 * © 2018 Team FESTIVAL
 * All rights reserved
 */

class ScrollRetractor {
	constructor(params) {
		const scroll = this;
		
		scroll.params = {
			scrollContainer: null,
			scrollElement: null,
			retractElement: null,
			minHeight: 0
		}
		Object.assign(scroll.params, params);
		
		scroll._initialHeight = scroll.params.retractElement.offsetHeight;
		
		Object.assign(scroll.params.scrollContainer.style, {
			paddingTop: `${scroll._initialHeight}px`
		});
	}
	
	elementDidScroll() {
		const scroll = this;
		let scrollTop = scroll.params.scrollContainer.scrollTop;
		let scrollHeight = scroll.params.scrollContainer.scrollHeight - scroll.params.scrollContainer.offsetHeight;
		
		if (scrollTop <= scrollHeight) {
			Object.assign(scroll.params.retractElement.style, {
				maxHeight: `${Math.max(scroll._initialHeight - scrollTop, scroll.params.minHeight)}px`
			});
		}
		// } else {
		// 	Object.assign(scroll.params.retractElement.style, {
		// 		maxHeight: `${scroll.params.minHeight - (scrollTop - scrollHeight)}px`
		// 	});
		// }
	}
}