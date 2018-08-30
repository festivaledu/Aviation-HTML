/**
 * spring-animatable.js
 * FESTIVAL Aviation
 * 
 * Create beautiful spring physics based animations
 * Internally called "Springy", this library builds up
 * on Wobble by Adam Miskiewicz. The main TypeScript 
 * file was ported to ES6 and optimized to be used in a 
 * non-Node.js environemt
 * 
 * Springy is heavily inspired by the "Today" tab in
 * iOS 11' redesigned App Store
 * 
 * @author Janik Schmidt (jani.schmidt@ostfalia.de), Adam Miskiewicz
 * @version: 1,0
 */

class SpringAnimatable {
	constructor(params) {
		const spring = this;

		// Initial configuration
		spring.params = {
			identifier: null,
			classList: [],
			originElement: null,
			targetElement: null,
			targetFrame: { origin: { x: 0, y: 0 }, size: { width: 0, height: 0 } },
			transitionStyle: {},
			spring: {}
		}

		Object.assign(spring.params, params);

		// Check if an animatable object already exists in the DOM, else create a new one
		if (document.querySelector(".spring-animatable")) {
			spring.animatable = document.querySelector(".spring-animatable");
		} else {
			spring.animatable = document.createElement("div");
			spring.animatable.className = "spring-animatable";
			spring.animatable.setAttribute("id", spring.params.identifier);
			document.body.appendChild(spring.animatable);
		}

		// Add all the classes specified in the parameters
		spring.animatable.classList.add(...spring.params.classList);

		// Apply some initial styles
		Object.assign(spring.animatable.style, spring.params.transitionStyle, {
			display: "none",
			position: "absolute",
			left: "0px",
			top: "0px",
			width: "0px",
			height: "0px",
			zIndex: "1000"
		});

		// Hide the target element
		Object.assign(spring.params.targetElement.style, {
			visibility: "hidden",
			//display: "none"
		});

		// EXCLUSIVE FOR AVIATION
		// Set promo text title width to a fixed value so it keeps its look when expanding
		spring.params.originElement.querySelectorAll(".header p").forEach(item => {
			Object.assign(item.style, {
				width: item.clientWidth + (parseInt(window.getComputedStyle(item)["padding-left"]) || 0) + "px"
			});

			// Apply the same to the target element
			spring.params.targetElement.querySelectorAll(".header p").forEach(_item => {
				if (_item.className == item.className) {
					Object.assign(_item.style, {
						width: item.clientWidth + (parseInt(window.getComputedStyle(item)["padding-left"]) || 0) + "px"
					});
				}
			});
		});

		// Some more initial configuration
		spring._spring = new Spring(spring.params.spring);
		spring._didAnimate = false;
		spring._hideTimeout;
	}

	/**
	 * Prepare the animation
	 * @param {Object} originFrame The origin frame, either from spring.params.originElement or spring.params.targetElement
	 * @param {HTMLElement} originElement The element the animation originates from
	 * @param {HTMLElement} targetElement The element where the animation should end
	 */
	_prepare(originFrame, originElement, targetElement) {
		const spring = this;

		// Clear the timeout that blocks the animation from happening multiple times
		clearTimeout(spring._hideTimeout);
		
		// Apply initial styles to the animatable object based on the origin frame
		Object.assign(spring.animatable.style, {
			transform: `translate3d(${originFrame.origin.x}px, ${originFrame.origin.y}px, 0)`,
			width: `${originFrame.size.width}px`,
			height: `${originFrame.size.height}px`
		});

		// if the animation is reversing, we're also including the body scroll offset
		if (originElement == spring.params.targetElement) {
			Object.assign(spring.animatable.style, {
				transform: `translate3d(${originFrame.origin.x}px, ${originFrame.origin.y + document.body.scrollTop}px, 0)`,
			});
		}

		// Hide both the origin and the target element
		Object.assign(originElement.style, {
			visibility: "hidden"
		});

		Object.assign(targetElement.style, {
			display: null,
			visibility: "hidden"
		});
	}

	/**
	 * Called when the animation is finished
	 * @param {HTMLElement} targetElement The target element of the current animation state, spring.params.targetElement if forwards, spring.params.originElement if backwards
	 */
	_finalize(targetElement) {
		const spring = this;
		
		// Show the target element
		Object.assign(targetElement.style, {
			visibility: "visible"
		});

		// Hide spring.params.targetElement instantly
		if (targetElement != spring.params.targetElement) {
			Object.assign(spring.params.targetElement.style, {
				visibility: "hidden",
				display: "none"
			});
		}

		// Fade out the animatable object and hide it afterwards
		spring.animatable.classList.add("fade");
		spring._hideTimeout = setTimeout(() => {
			Object.assign(spring.animatable.style, {
				display: "none",
			});
		}, 500);
	}

	/**
	 * Clears the timeout that blocks the animation from happening multiple times
	 */
	_clearHideTimeout() {
		this.animatable.classList.remove("fade");
		clearTimeout(this._hideTimeout);
	}

	/**
	 * Start the animation in forward direction
	 */
	start() {
		const spring = this;

		// Stop any Spring from doing stuff
		spring._spring.stop();
		spring._spring.removeAllListeners();

		// Get the animation's origin frame
		let originFrame = spring._getFrame(spring.params.originElement);
		let targetFrame;
		if (typeof spring.params.targetFrame === "function") {
			targetFrame = spring.params.targetFrame();
		} else {
			targetFrame = spring.params.targetFrame;
		}

		// Prepare the animation
		spring._prepare(originFrame, spring.params.originElement, spring.params.targetElement);
		
		// Insert the orin element's HTML into the animatable object so it doesn't look that plain
		spring.animatable.innerHTML = spring.params.originElement.innerHTML;


		// Configure Spring events
		spring._spring.onStart(() => {
			// Prevent the body from scrolling (Safar/macOS only, maybe Firefox or even Edge)
			document.body.classList.add("no-scroll");

			// Show the animatable object instantly
			spring.animatable.classList.remove("fade");
			Object.assign(spring.animatable.style, {
				display: null,
			});
		}).onUpdate(_spring => {
			// onUpdate is called every frame of the Spring animation
			// Here we calculate the current frame according to the animation progress
			let calculatedFrame = {
				origin: {
					x: spring._calcAnimValue(targetFrame.origin.x, originFrame.origin.x, _spring.currentValue),
					y: spring._calcAnimValue(targetFrame.origin.y + document.body.scrollTop, originFrame.origin.y, _spring.currentValue)
				},
				size: {
					width: spring._calcAnimValue(targetFrame.size.width, originFrame.size.width, _spring.currentValue),
					height: spring._calcAnimValue(targetFrame.size.height, originFrame.size.height, _spring.currentValue)
				}
			};

			// Apply the styles to the animatable object
			Object.assign(spring.animatable.style, {
				transform: `translate3d(${calculatedFrame.origin.x}px, ${calculatedFrame.origin.y}px, 0)`,
				width: `${calculatedFrame.size.width}px`,
				height: `${calculatedFrame.size.height}px`
			});
		}).onStop(_spring => {
			// Finalize the animation
			spring._finalize(spring.params.targetElement);
		});

		// Fire the animation
		spring._spring.start();
		
		// Set _didAnimate to true, so if we use reverse(), we're actually reversing
		spring._didAnimate = true;
	}

	/**
	 * Start the animation in reverse direction
	 * This works basically the same way as start(),
	 * but originElement and targetElement are swpped
	 */
	reverse() {
		const spring = this;

		// If we haven't animated yet, we need to use the forward animation instead
		if (!spring._didAnimate) {
			spring.start();
			return;
		}

		spring._spring.stop();
		spring._spring.removeAllListeners();

		let originFrame;
		let targetFrame = spring._getFrame(spring.params.originElement);
		if (typeof spring.params.targetFrame === "function") {
			originFrame = spring.params.targetFrame();
		} else {
			originFrame = spring.params.targetFrame;
		}

		spring._prepare(originFrame, spring.params.targetElement, spring.params.originElement);
		spring.animatable.innerHTML = spring.params.originElement.innerHTML;

		spring._spring.onStart(() => {
			spring.animatable.classList.remove("fade");
			Object.assign(spring.animatable.style, {
				display: null,
			});
		}).onUpdate(_spring => {
			let calculatedFrame = {
				origin: {
					x: spring._calcAnimValue(targetFrame.origin.x, originFrame.origin.x, _spring.currentValue),
					y: spring._calcAnimValue(targetFrame.origin.y, originFrame.origin.y + document.body.scrollTop, _spring.currentValue)
				},
				size: {
					width: spring._calcAnimValue(targetFrame.size.width, originFrame.size.width, _spring.currentValue),
					height: spring._calcAnimValue(targetFrame.size.height, originFrame.size.height, _spring.currentValue)
				}
			};

			Object.assign(spring.animatable.style, {
				transform: `translate3d(${calculatedFrame.origin.x}px, ${calculatedFrame.origin.y}px, 0)`,
				width: `${calculatedFrame.size.width}px`,
				height: `${calculatedFrame.size.height}px`
			});
		}).onStop(_spring => {
			spring._finalize(spring.params.originElement);
			document.body.classList.remove("no-scroll");
		});

		spring._spring.start();
		spring._didAnimate = true;
	}

	/**
	 * Returns the absolute frame of an element
	 * @param {HTMLElement} element The element we want to get the frame of
	 * @returns An object in the format {{x, y}, {width, height}}
	 */
	_getFrame(element) {
		var top = 0, left = 0;
		var width = element.offsetWidth, height = element.offsetHeight;
		do {
			top += element.offsetTop || 0;
			left += element.offsetLeft || 0;
			element = element.offsetParent;
		} while (element);

		return {
			origin: {
				x: left,
				y: top
			},
			size: {
				width: width,
				height: height
			}
		}
	}

	/**
	 * Calculates a value between original and target ising currentValue
	 * @param {Number} target The value we want to have
	 * @param {Number} original The value we started with
	 * @param {Number} currentValue The current progress value
	 */
	_calcAnimValue(target, original, currentValue) {
		return original + ((target - original) * currentValue);
	}
}

class Spring {
	constructor(config) {
		const spring = this;

		spring._listeners = [];
		spring._currentAnimationStep = 0;
		spring._currentTime = 0;
		spring._springTime = 0;
		spring._currentValue = 0;
		spring._currentVelocity = 0;
		spring._isAnimating = false;
		spring._oscillationVelocityPairs = [];

		spring._config = {
			fromValue: 0,
			toValue: 1,
			stiffness: 100,
			damping: 10,
			mass: 1,
			initialVelocity: 0,
			overshootClamping: false,
			allowsOverdamping: false,
			restVelocityThreshold: 0.001,
			restDisplacementThreshold: 0.001
		}
		Object.assign(spring._config, config);

		spring._currentValue = spring._config.fromValue;
		spring._currentVelocity = spring._config.initialVelocity;
	}

	start() {
		const _this = this;
		let _config = _this._config, fromValue = _config.fromValue, toValue = _config.toValue, initialVelocity = _config.initialVelocity;

		if (fromValue !== toValue || initialVelocity !== 0) {
			this._reset();
			this._isAnimating = true;
			if (!this._currentAnimationStep) {
				this._notifyListeners("onStart");
				this._currentAnimationStep = requestAnimationFrame(() => {
					_this._step(Date.now());
				});
			}
		}
		return this;
	}

	stop() {
		if (!this._isAnimating) {
			return this;
		}
		this._isAnimating = false;
		this._notifyListeners("onStop");
		if (this._currentAnimationStep) {
			cancelAnimationFrame(this._currentAnimationStep);
			this._currentAnimationStep = 0;
		}
		return this;
	}

	get currentValue() {
		return this._currentValue;
	}

	get currentVelocity() {
		return this._currentVelocity;
	}

	get isAtRest() {
		return this._isSpringAtRest();
	}

	get isAnimating() {
		return this._isAnimating;
	}

	updateConfig(updatedConfig) {
		this._advanceSpringToTime(Date.now());

		let baseConfig = {
			fromValue: this._currentValue,
			initialVelocity: this._currentVelocity
		}
		this._config = __assign({}, this._config, baseConfig, updatedConfig);
		this._reset();
		return this;
	}

	onStart(listener) {
		this._listeners.push({ onStart: listener });
		return this;
	}

	onUpdate(listener) {
		this._listeners.push({ onUpdate: listener });
		return this;
	}

	onStop(listener) {
		this._listeners.push({ onStop: listener });
		return this;
	}

	removeListener(listenerFn) {
		this._listeners = this._listeners.reduce(function(result, listener) {
			let foundListenerFn = Object.values(listener).indexOf(listenerFn) !== -1;
			if (!foundListenerFn) {
				result.push(listener);
			}
			return result;
		}, []);
		return this;
	}

	removeAllListeners() {
		this._listeners = [];
		return this;
	}

	_reset() {
		this._currentTime = Date.now();
		this._springTime = 0.0;
		this._currentValue = this._config.fromValue;
		this._currentVelocity = this._config.initialVelocity;
	}

	_notifyListeners(eventName) {
		const _this = this;
		this._listeners.forEach(function(listener) {
			let maybeListenerFn = listener[eventName];
			if (typeof maybeListenerFn === "function") {
				maybeListenerFn(_this);
			}
		});
	}

	_step(timestamp) {
		const _this = this;
		this._advanceSpringToTime(timestamp, true);

		if (this._isAnimating) {
			this._currentAnimationStep = requestAnimationFrame(() => {
				return _this._step(Date.now());
			});
		}
	}

	_advanceSpringToTime(timestamp, shouldNotifyListeners) {
		if (shouldNotifyListeners === undefined) { shouldNotifyListeners = false; }
		if (!this._isAnimating) {
			return;
		}

		var deltaTime = timestamp - this._currentTime;
		if (deltaTime > Spring.MAX_DELTA_TIME_MS) {
			deltaTime = Spring.MAX_DELTA_TIME_MS;
		}

		this._springTime += deltaTime;
		var c = this._config.damping;
		var m = this._config.mass;
		var k = this._config.stiffness;
		var fromValue = this._config.fromValue;
		var toValue = this._config.toValue;
		var v0 = -this._config.initialVelocity;

		// SpringUtils.errorIfNot(m > 0, "Mass value must be greater than 0");
		// SpringUtils.errorIfNot(k > 0, "Stiffness value must be greater than 0");
		// SpringUtils.errorIfNot(c > 0, "Damping value must be greater than 0");

		var zeta = c / (2 * Math.sqrt(k * m));
		var omega0 = Math.sqrt(k / m) / 1000;
		var omega1 = omega0 * Math.sqrt(1.0 - zeta * zeta);
		var omega2 = omega0 * Math.sqrt(zeta * zeta - 1.0);
		var x0 = toValue - fromValue;
		if (zeta > 1 && !this._config.allowsOverdamping) {
			zeta = 1;
		}
		var oscillation = 0.0;
		var velocity = 0.0;
		var t = this._springTime;
		if (zeta < 1) {
			var envelope = Math.exp(-zeta * omega0 * t);
			oscillation = toValue - envelope * ((v0 + zeta * omega0 * x0) / omega1 * Math.sin(omega1 * t) + x0 * Math.cos(omega1 * t));

			velocity = zeta * omega0 * envelope *
				(Math.sin(omega1 * t) * (v0 + zeta * omega0 * x0) / omega1 +
					x0 * Math.cos(omega1 * t)) - envelope *
				(Math.cos(omega1 * t) * (v0 + zeta * omega0 * x0) -
					omega1 * x0 * Math.sin(omega1 * t));
		}
		else if (zeta === 1) {
			var envelope = Math.exp(-omega0 * t);
			oscillation = toValue - envelope * (x0 + (v0 + omega0 * x0) * t);
			velocity = envelope * (v0 * (t * omega0 - 1) + t * x0 * (omega0 * omega0));
		}
		else {
			var envelope = Math.exp(-zeta * omega0 * t);
			oscillation =
				toValue -
				envelope *
				((v0 + zeta * omega0 * x0) * Math.sinh(omega2 * t) +
					omega2 * x0 * Math.cosh(omega2 * t)) /
				omega2;
			velocity =
				envelope *
				zeta *
				omega0 *
				(Math.sinh(omega2 * t) * (v0 + zeta * omega0 * x0) +
					x0 * omega2 * Math.cosh(omega2 * t)) /
				omega2 -
				envelope *
				(omega2 * Math.cosh(omega2 * t) * (v0 + zeta * omega0 * x0) +
					omega2 * omega2 * x0 * Math.sinh(omega2 * t)) /
				omega2;
		}
		this._currentTime = timestamp;
		this._currentValue = oscillation;
		this._currentVelocity = velocity;

		if (!shouldNotifyListeners) {
			return;
		}
		this._notifyListeners("onUpdate");
		if (!this._isAnimating) {
			return;
		}

		if (this._isSpringOvershooting() || this._isSpringAtRest()) {
			if (k !== 0) {
				this._currentValue = toValue;
				this._currentVelocity = 0;
				this._notifyListeners("onUpdate");
			}
			this.stop();
			return;
		}
	}

	_isSpringOvershooting() {
		let _config = this._config, stiffness = _config.stiffness, fromValue = _config.fromValue, toValue = _config.toValue, overshootClamping = _config.overshootClamping;

		if (overshootClamping && stiffness !== 0) {
			if (fromValue < toValue) {
				return this._currentValue > toValue;
			}
			else {
				return this._currentValue < toValue;
			}
		}
	}

	_isSpringAtRest() {
		var _config = this._config, stiffness = _config.stiffness, toValue = _config.toValue, restDisplacementThreshold = _config.restDisplacementThreshold, restVelocityThreshold = _config.restVelocityThreshold;

		let isNoVelocity = Math.abs(this._currentVelocity) <= restVelocityThreshold;
		let isNoDisplacement = stiffness !== 0 && Math.abs(toValue - this._currentValue) <= restDisplacementThreshold;
		return isNoDisplacement && isNoVelocity;
	}
}
Spring.MAX_DELTA_TIME_MS = 1 / 60 * 1000 * 4;