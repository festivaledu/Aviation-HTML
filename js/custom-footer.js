/**
 * custom-footer.js
 * FESTIVAL Aviation
 * 
 * Create a footer that contains random 
 * text every time it's displayed
 * 
 * @author Janik Schmidt (jani.schmidt@ostfalia.de)
 * @version 1.0
 */

// Store symbols found in Segoe MDL2 Assets
let footers = [
	"\uE822\uE81F",
	"\uE724",
	"\uE95E",
	"\uF161\uF163",
	"\uF1AD",
	"\uF093\uF094\uF096\uF095",
	"\uE81F\uEC5A\uEC81\uEC81"
];

// Create a reference to to footer DOM element
let customFooter = document.querySelector("footer p.custom-footer span.weird-text");

// If the footer exists, insert a random string from the array above
if (customFooter) {
	customFooter.innerHTML = footers[Math.floor(Math.random() * footers.length)];
}