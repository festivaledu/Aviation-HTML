/**
 * spring-animatable.js
 * Version 1.0 BETA
 * © 2018 Team FESTIVAL
 * All rights reserved
 */

class SpringAnimatable {
	constructor(params) {
		const spring = this;

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

		if (document.querySelector(".spring-animatable")) {
			spring.animatable = document.querySelector(".spring-animatable");
		} else {
			spring.animatable = document.createElement("div");
			spring.animatable.className = "spring-animatable";
			spring.animatable.setAttribute("id", spring.params.identifier);
			document.body.appendChild(spring.animatable);
		}
		spring.animatable.classList.add(...spring.params.classList);
		
		Object.assign(spring.animatable.style, spring.params.transitionStyle, {
			display: "none",
			position: "absolute",
			left: "0px",
			top: "0px",
			width: "0px",
			height: "0px",
			zIndex: "1000"
		});
		
		Object.assign(spring.params.targetElement.style, {
			visibility: "hidden",
			//display: "none"
		});
		
		spring.params.originElement.querySelectorAll(".header p").forEach(item => {
			Object.assign(item.style, {
				width: item.clientWidth + (parseInt(window.getComputedStyle(item)["padding-left"]) || 0) + "px"
			});
			
			spring.params.targetElement.querySelectorAll(".header p").forEach(_item => {
				if (_item.className == item.className) {
					Object.assign(_item.style, {
						width: item.clientWidth + (parseInt(window.getComputedStyle(item)["padding-left"]) || 0) + "px"
					});
				}
			});
		});

		spring._spring = new Spring(spring.params.spring);
		spring._didAnimate = false;
		spring._hideTimeout;
	}
	
	_prepare(originFrame, originElement, targetElement) {
		const spring = this;
		
		clearTimeout(spring._hideTimeout);
		Object.assign(spring.animatable.style, {
			transform: `translate3d(${originFrame.origin.x}px, ${originFrame.origin.y}px, 0)`,
			width: `${originFrame.size.width}px`,
			height: `${originFrame.size.height}px`
		});
		
		if (originElement == spring.params.targetElement) {
			Object.assign(spring.animatable.style, {
				transform: `translate3d(${originFrame.origin.x}px, ${originFrame.origin.y + document.body.scrollTop}px, 0)`,
			});
		}
		
		Object.assign(originElement.style, {
			visibility: "hidden"
		});
		
		Object.assign(targetElement.style, {
			display: null,
			visibility: "hidden"
		});
	}
	
	_finalize(targetElement) {
		const spring = this;
		Object.assign(targetElement.style, {
			visibility: "visible"
		});
		
		if (targetElement != spring.params.targetElement) {
			Object.assign(spring.params.targetElement.style, {
				visibility: "hidden",
				display: "none"
			});
		}
		
		spring.animatable.classList.add("fade");
		spring._hideTimeout = setTimeout(() => {
			Object.assign(spring.animatable.style, {
				display: "none",
			});
		}, 500);
	}
	
	_clearHideTimeout() {
		this.animatable.classList.remove("fade");
		clearTimeout(this._hideTimeout);
	}
	
	start() {
		const spring = this;
		
		spring._spring.stop();
		spring._spring.removeAllListeners();
		
		let originFrame = spring._getFrame(spring.params.originElement);
		let targetFrame;
		if (typeof spring.params.targetFrame === "function") {
			targetFrame = spring.params.targetFrame();
		} else {
			targetFrame = spring.params.targetFrame;
		}
		
		spring._prepare(originFrame, spring.params.originElement, spring.params.targetElement);
		spring.animatable.innerHTML = spring.params.originElement.innerHTML;
		
		
		
		spring._spring.onStart(() => {
			document.body.classList.add("no-scroll");
			
			spring.animatable.classList.remove("fade");
			Object.assign(spring.animatable.style, {
				display: null,
			});
		}).onUpdate(_spring => {
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
			
			Object.assign(spring.animatable.style, {
				transform: `translate3d(${calculatedFrame.origin.x}px, ${calculatedFrame.origin.y}px, 0)`,
				width: `${calculatedFrame.size.width}px`,
				height: `${calculatedFrame.size.height}px`
			});
		}).onStop(_spring => {
			spring._finalize(spring.params.targetElement);
		});
		
		spring._spring.start();
		spring._didAnimate = true;
	}

	reverse() {
		const spring = this;

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
	/*start() {
		const spring = this;
		
		clearTimeout(spring._hideTimeout);

		spring._spring.stop();
		spring._spring.removeAllListeners();

		let originFrame = spring._getFrame(spring.params.originElement);
		let targetFrame;
		if (typeof spring.params.targetFrame === "function") {
			targetFrame = spring.params.targetFrame();
		} else {
			targetFrame = spring.params.targetFrame;
		}

		spring._spring.onStart(_spring => {
			Object.assign(spring.params.originElement.style, {
				visibility: "hidden"
			});
			Object.assign(spring.params.targetElement.style, {
				display: null,
				visibility: "hidden"
			});

			spring.animatable.classList.remove("fade");
			Object.assign(spring.animatable.style, {
				display: "block",
			});
			
			spring.animatable.innerHTML = spring.params.originElement.innerHTML;
			document.body.classList.add("no-scroll");
		}).onUpdate(_spring => {
			Object.assign(spring.animatable.style, {
				left: `${spring._calcAnimValue(targetFrame[0][0], originFrame[0][0], _spring.currentValue)}px`,
				top: `${spring._calcAnimValue(targetFrame[0][1] + document.body.scrollTop, originFrame[0][1], _spring.currentValue)}px`,
				width: `${spring._calcAnimValue(targetFrame[1][0], originFrame[1][0], _spring.currentValue)}px`,
				height: `${spring._calcAnimValue(targetFrame[1][1], originFrame[1][1], _spring.currentValue)}px`,
			});
		}).onStop(_spring => {
			Object.assign(spring.params.targetElement.style, {
				visibility: "visible"
			});

			spring.animatable.classList.add("fade");
			spring._hideTimeout = setTimeout(() => {
				Object.assign(spring.animatable.style, {
					display: "none",
				});
			}, 300);
		});

		spring._spring.start();
		spring._didAnimate = true;
	}

	reverse() {
		const spring = this;

		if (!spring._didAnimate) {
			spring.start();
			return;
		}
		
		clearTimeout(spring._hideTimeout);

		let originFrame;
		let targetFrame = spring._getFrame(spring.params.originElement);
		if (typeof spring.params.targetFrame === "function") {
			originFrame = spring.params.targetFrame();
		} else {
			originFrame = spring.params.targetFrame;
		}

		spring._spring.onStart(_spring => {
			Object.assign(spring.params.originElement.style, {
				visibility: "hidden"
			});
			Object.assign(spring.params.targetElement.style, {
				visibility: "hidden"
			});

			spring.animatable.classList.remove("fade");
			Object.assign(spring.animatable.style, {
				display: "block",
			});
		}).onUpdate(_spring => {
			Object.assign(spring.animatable.style, {
				left: `${spring._calcAnimValue(targetFrame[0][0], originFrame[0][0], _spring.currentValue)}px`,
				top: `${spring._calcAnimValue(targetFrame[0][1], originFrame[0][1] + document.body.scrollTop, _spring.currentValue)}px`,
				width: `${spring._calcAnimValue(targetFrame[1][0], originFrame[1][0], _spring.currentValue)}px`,
				height: `${spring._calcAnimValue(targetFrame[1][1], originFrame[1][1], _spring.currentValue)}px`,
			});
		}).onStop(_spring => {
			Object.assign(spring.params.originElement.style, {
				visibility: "visible"
			});
			Object.assign(spring.params.targetElement.style, {
				visibility: "hidden",
				display: "none"
			});

			spring.animatable.classList.add("fade");
			spring._hideTimeout = setTimeout(() => {
				Object.assign(spring.animatable.style, {
					display: "none",
				});
			}, 500);
			
			document.body.classList.remove("no-scroll");
		});

		spring._spring.start();
		spring._didAnimate = false;
	}*/

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