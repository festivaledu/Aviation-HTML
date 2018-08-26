var createElement = (type, className, innerHTML) => {
	let element = document.createElement(type);
	element.className = className || "";
	element.innerHTML = innerHTML || "";
	
	return element;
}

var Calendar = function(element, options) {
	"use strict";
	
	const calendar = this;
	calendar.element = element;
	
	calendar.today = new Date();
	calendar.today.setHours(0,0,0,0);
	calendar.show = new Date();
	calendar.show.setHours(0,0,0,0);
	calendar.current = {
		year: calendar.show.getFullYear(),
		month: calendar.show.getMonth(),
		day: calendar.show.getDate()
	};
	
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
	
	calendar.options = {};
	Object.assign(calendar.options, options);
	
	let _renderHeader = () => {
		const calendar = this;
		let header = calendar.element.querySelector(".calendar-header");
		
		if (!header) {
			header = document.createElement("div");
			header.className = "calendar-header";
			calendar.element.appendChild(header);
		}
		
		header.innerHTML = "";
		
		let day = calendar.show.getDay() == 0 ? 7 : calendar.show.getDay();
		
		header.appendChild(createElement("div", "header-year", calendar.show.getFullYear()));
		header.appendChild(createElement("div", "header-day", `${calendar.days[day - 1]}, ${calendar.show.getDate()}. ${calendar.months[calendar.show.getMonth()]}`));
	}
	
	let _renderContent = () => {
		const calendar = this;
		let content = calendar.element.querySelector(".calendar-content");
		
		if (!content) {
			content = document.createElement("div");
			content.className = "calendar-content";
			calendar.element.appendChild(content);
		}
		
		content.innerHTML = "";
		
		/* Toolbar */
		let toolbar = createElement("div", "calendar-toolbar");
		content.appendChild(toolbar);
		
		toolbar.appendChild(createElement("span", "prev-month"));
		toolbar.appendChild(createElement("span", "curr-month", calendar.months[calendar.current.month]));
		toolbar.appendChild(createElement("span", "next-month"));
		
		toolbar.appendChild(createElement("span", "prev-year"));
		toolbar.appendChild(createElement("span", "curr-year", calendar.current.year));
		toolbar.appendChild(createElement("span", "next-year"));
		
		/* Week Days */
		let weekDays = createElement("div", "week-days");
		content.appendChild(weekDays);
		
		calendar.days.forEach(day => {
			weekDays.appendChild(createElement("span", "day", day.substr(0,2)));
		});
		
		var month, year;
		var first = new Date(calendar.current.year, calendar.current.month, 1);
		let prevMonthDays = new Date(calendar.current.year, calendar.current.month, 0).getDate();
		var counter = 0;
		
		let days = createElement("div","days");
		content.appendChild(days);
		var daysRow = createElement("div","days-row");
		days.appendChild(daysRow);
		
		let firstDay = (first.getDay() === 0) ? 6 : first.getDay() - 1;
		if (calendar.current.month - 1 < 0) {
			month = 11;
			year = calendar.current.year - 1;
		} else {
			month = calendar.current.month - 1;
			year = calendar.current.year;
		}
		
		for (var i=0; i<firstDay; i++) {
			var v = prevMonthDays - firstDay + i + 1;
			let day = createElement("div", "day outside",v);
			daysRow.appendChild(day);
			
			counter++;
		}
		
		while (first.getMonth() == calendar.current.month) {
			let day = createElement("div", "day", first.getDate());
			daysRow.appendChild(day);
			
			day.setAttribute("date", first.getTime());
			
			if (
                calendar.today.getFullYear() === first.getFullYear() &&
                calendar.today.getMonth() === first.getMonth() &&
                calendar.today.getDate() === first.getDate()
            ) {
                day.classList.add("today");
			}
			
			if (
                calendar.show.getFullYear() === first.getFullYear() &&
                calendar.show.getMonth() === first.getMonth() &&
                calendar.show.getDate() === first.getDate()
            ) {
                day.classList.add("show");
            }
			
			counter++;
			if (counter % 7 == 0) {
				daysRow = createElement("div", "days-row");
				days.appendChild(daysRow);
			}
			
			first.setDate(first.getDate() + 1);
			first.setHours(0,0,0,0);
		}
		
		/** Days (next month) */
		
		firstDay = (first.getDay() === 0) ? 6 : first.getDay() - 1;
		if (calendar.current.month + 1 > 11) {
			month = 0;
			year = calendar.current.year + 1;
		} else {
			month = calendar.current.month + 1;
			year = calendar.current.year;
		}
		
		if (firstDay > 0) {
			for (var i=0; i<7 - firstDay; i++) {
				var v = prevMonthDays - firstDay + i + 1;
				let day = createElement("div", "day outside", i+1);
				daysRow.appendChild(day);
			}
		}
	}
	
	let _bindEvents = () => {
		const calendar = this;
		calendar.element.querySelectorAll(".prev-month, .next-month, .prev-year, .next-year").forEach(item => {
			item.addEventListener("click", () => {
				let newDate;
				
				if (item.classList.contains("prev-month")) {
					newDate = new Date(calendar.current.year, calendar.current.month - 1, 1);
				}
				
				if (item.classList.contains("next-month")) {
					newDate = new Date(calendar.current.year, calendar.current.month + 1, 1);
				}
				
				if (item.classList.contains("prev-year")) {
					newDate = new Date(calendar.current.year - 1, calendar.current.month, 1);
				}
				
				if (item.classList.contains("next-year")) {
					newDate = new Date(calendar.current.year + 1, calendar.current.month, 1);
				}
				
				calendar.current = {
					year: newDate.getFullYear(),
					month: newDate.getMonth(),
					day: newDate.getDate()
				}
				
				setTimeout(() => {
					_build();
				});
			});
		});
		
		calendar.element.querySelectorAll(".day:not(.outside)").forEach(item => {
			item.addEventListener("click", () => {
				calendar.show = new Date(parseInt(item.getAttribute("date")));
				_build();
				
				if (typeof calendar.options.onDateSelected === "function") {
					console.log(calendar.show);
					calendar.options.onDateSelected(calendar.show);
				}
			})
		})
	}
	
	let _render = () => {
		calendar.element.innerHTML = "";
		_renderHeader();
		_renderContent();
	}
	
	let _build = () => {
		_render();
		_bindEvents();
	}
	
	_build();
}