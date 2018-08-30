/**
 * calendar.js
 * FESTIVAL Aviation
 * 
 * This is the controller behind the calendar selectors on index.jsp and booking-search.jsp
 * It's based on Metro 4 by Sergey Pimenov, converted from JQuery into ES6
 * 
 * @author Janik Schmidt (jani.schmidt@ostfalia.de), Sergey Pimenov
 */

/**
 * A helper method to create DOM elements of type,
 * with a class name of className and a content of 
 * innerHTML
 * 
 * @param {String} type The type of DOM element to create (eg. div)
 * @param {String} className The class name of the new element
 * @param {String} innerHTML The content of the new element
 */
var createElement = (type, className, innerHTML) => {
	let element = document.createElement(type);
	element.className = className || "";
	element.innerHTML = innerHTML || "";

	return element;
}


/**
 * Creates a new instance of Calender using element as its target
 * @param {HTMLElement} element The target element to display the calendar at
 * @param {Object} options An object containing options to configure the calendar
 */
var Calendar = function(element, options) {
	// Enable strict mode to force cleaner code
	"use strict";

	// Initial configuration
	const calendar = this;
	calendar.element = element;

	calendar.today = new Date();
	calendar.today.setHours(0, 0, 0, 0);
	calendar.show = new Date();
	calendar.show.setHours(0, 0, 0, 0);
	calendar.current = {
		year: calendar.show.getFullYear(),
		month: calendar.show.getMonth(),
		day: calendar.show.getDate()
	};

	// The strings used to display on the calendar
	// Might localize this at some point, but why?
	calendar.days = [
		"Montag",
		"Dienstag",
		"Mittwoch",
		"Donnerstag",
		"Freitag",
		"Samstag",
		"Sonntag",
	];
	calendar.months = [
		"Januar",
		"Februar",
		"März",
		"April",
		"Mai",
		"Juni",
		"Juli",
		"August",
		"September",
		"Oktober",
		"November",
		"Dezember"
	];

	// ADD ALL THE OPTIONS!
	calendar.options = {};
	Object.assign(calendar.options, options);

	// Here we render the top part of the calendar
	let _renderHeader = () => {
		const calendar = this;

		// Select any existing header, or create a new one
		let header = calendar.element.querySelector(".calendar-header");

		if (!header) {
			header = document.createElement("div");
			header.className = "calendar-header";
			calendar.element.appendChild(header);
		}

		// Clear the content
		header.innerHTML = "";

		// We need this to fix America's weeks starting with a Sunday
		let day = calendar.show.getDay() == 0 ? 7 : calendar.show.getDay();

		// Append children containing a) the selected year or b) the selected date
		header.appendChild(createElement("div", "header-year", calendar.show.getFullYear()));
		header.appendChild(createElement("div", "header-day", `${calendar.days[day - 1]}, ${calendar.show.getDate()}. ${calendar.months[calendar.show.getMonth()]}`));
	}

	// Here we render the main part of the calendar
	let _renderContent = () => {
		const calendar = this;

		// Select the calendar body, or create a new one
		let content = calendar.element.querySelector(".calendar-content");

		if (!content) {
			content = document.createElement("div");
			content.className = "calendar-content";
			calendar.element.appendChild(content);
		}

		// Clear the content
		content.innerHTML = "";

		/* Toolbar */
		// The toolbar contains controls to select the month and the year
		let toolbar = createElement("div", "calendar-toolbar");
		content.appendChild(toolbar);

		toolbar.appendChild(createElement("span", "prev-month"));
		toolbar.appendChild(createElement("span", "curr-month", calendar.months[calendar.current.month]));
		toolbar.appendChild(createElement("span", "next-month"));

		toolbar.appendChild(createElement("span", "prev-year"));
		toolbar.appendChild(createElement("span", "curr-year", calendar.current.year));
		toolbar.appendChild(createElement("span", "next-year"));

		/* Week Days */
		// The week days are a list of two-letter abbreviations of day names
		let weekDays = createElement("div", "week-days");
		content.appendChild(weekDays);

		// Create a div for each week day
		calendar.days.forEach(day => {
			// Use the string found in calendar.days and cut it down to two letters
			weekDays.appendChild(createElement("span", "day", day.substr(0, 2)));
		});

		/* Calendar Days */
		// Now comes the fun part: creating the actual calendar

		// First, we create new Date objects based on the current date
		var first = new Date(calendar.current.year, calendar.current.month, 1);

		// Here we get the count of days in the last month
		let prevMonthDays = new Date(calendar.current.year, calendar.current.month, 0).getDate();

		// This variable is used to count added days. We modulo it by 7 so we can create new week rows
		var counter = 0;
		
		let year, month;

		// Create the actual days container
		let days = createElement("div", "days");
		content.appendChild(days);

		// Create the initial week row
		var daysRow = createElement("div", "days-row");
		days.appendChild(daysRow);

		// We need this to fix America's weeks starting with a Sunday
		let firstDay = (first.getDay() === 0) ? 6 : first.getDay() - 1;

		// Fix month and year bounds
		if (calendar.current.month - 1 < 0) {
			month = 11;
			year = calendar.current.year - 1;
		} else {
			month = calendar.current.month - 1;
			year = calendar.current.year;
		}

		// If we have one or more days of the week that belong to last month, we create disabled days
		for (var i = 0; i < firstDay; i++) {
			var v = prevMonthDays - firstDay + i + 1;
			let day = createElement("div", "day outside", v);
			daysRow.appendChild(day);

			// Increase the counter for every added day
			counter++;
		}

		// Deal with the current month
		while (first.getMonth() == calendar.current.month) {
			let day = createElement("div", "day", first.getDate());
			daysRow.appendChild(day);

			// Set the date attribute which can be used later
			day.setAttribute("date", first.getTime());

			// If the currently handled date equals today's date, add "today" class
			if (
				calendar.today.getFullYear() === first.getFullYear() &&
				calendar.today.getMonth() === first.getMonth() &&
				calendar.today.getDate() === first.getDate()
			) {
				day.classList.add("today");
			}

			// Ith ethe currently handled date equals the selected date, add "show" class"
			if (
				calendar.show.getFullYear() === first.getFullYear() &&
				calendar.show.getMonth() === first.getMonth() &&
				calendar.show.getDate() === first.getDate()
			) {
				day.classList.add("show");
			}

			// If we choose to hide days in the past and the currently handled date is behind todays date, add "outside" class
			if (calendar.options.hidePast) {
				if (
					first.getFullYear() < calendar.today.getFullYear() ||
					(first.getMonth() < calendar.today.getMonth() && first.getFullYear() == calendar.today.getFullYear()) ||
					(first.getDate() < calendar.today.getDate() && first.getMonth() == calendar.today.getMonth() && first.getFullYear() == calendar.today.getFullYear())
				) {
					day.classList.add("outside");
				}
			}

			// Increase the counter for every added day
			counter++;

			// If we have added 7 consecutive days, add a new row
			if (counter % 7 == 0) {
				daysRow = createElement("div", "days-row");
				days.appendChild(daysRow);
			}

			// Add 24 hours to the currently handled date and set the time to 00:00:00.000
			first.setDate(first.getDate() + 1);
			first.setHours(0, 0, 0, 0);
		}

		/** Days (next month) */

		// We need this to fix America's weeks starting with a Sunday
		firstDay = (first.getDay() === 0) ? 6 : first.getDay() - 1;

		// Fix month and year bounds
		if (calendar.current.month + 1 > 11) {
			month = 0;
			year = calendar.current.year + 1;
		} else {
			month = calendar.current.month + 1;
			year = calendar.current.year;
		}

		// Fill the remaining week days with days from the next month
		if (firstDay > 0) {
			for (var i = 0; i < 7 - firstDay; i++) {
				var v = prevMonthDays - firstDay + i + 1;
				let day = createElement("div", "day outside", i + 1);
				daysRow.appendChild(day);
			}
		}
	}

	// Here we bind events to the toolbar buttons and the calendar dates
	let _bindEvents = () => {
		const calendar = this;

		// Select all toolbar buttons and add a click listener
		calendar.element.querySelectorAll(".prev-month, .next-month, .prev-year, .next-year").forEach(item => {
			item.addEventListener("click", () => {
				let newDate;

				// Subtract one month
				if (item.classList.contains("prev-month")) {
					newDate = new Date(calendar.current.year, calendar.current.month - 1, 1);
				}

				// Add one month
				if (item.classList.contains("next-month")) {
					newDate = new Date(calendar.current.year, calendar.current.month + 1, 1);
				}

				// Subtract one year
				if (item.classList.contains("prev-year")) {
					newDate = new Date(calendar.current.year - 1, calendar.current.month, 1);
				}

				// Add one year
				if (item.classList.contains("next-year")) {
					newDate = new Date(calendar.current.year + 1, calendar.current.month, 1);
				}

				// Update the currently displayed month and year
				calendar.current = {
					year: newDate.getFullYear(),
					month: newDate.getMonth(),
					day: newDate.getDate()
				}

				// For some reason I'm using a timeout here before rendering
				// Anyways, it's working, so I don't care
				setTimeout(() => {
					_build();
				});
			});
		});

		// Select all the days that are not disabled and add a click listener
		calendar.element.querySelectorAll(".days .day:not(.outside)").forEach(item => {
			item.addEventListener("click", () => {
				// Set the currently selected date by parsing the "date" attribute (it's actually just a UNIX timestamp)
				calendar.show = new Date(parseInt(item.getAttribute("date")));

				// Build again
				_build();

				// If we have a callback function, trigger it while passing the currently selected date
				if (typeof calendar.options.onDateSelected === "function") {
					calendar.options.onDateSelected(calendar.show);
				}
			})
		})
	}

	// Render every component
	let _render = () => {
		calendar.element.innerHTML = "";
		_renderHeader();
		_renderContent();
	}

	// Render everything and bind events
	let _build = () => {
		_render();
		_bindEvents();
	}

	_build();
}