let footers = [
	"\uE822\uE81F",
	"\uE724",
	"\uE95E",
	"\uF161\uF163",
	"\uF1AD",
	"\uF093\uF094\uF096\uF095",
	"\uE81F\uEC5A\uEC81\uEC81"
];

let customFooter = document.querySelector("footer p.custom-footer span.weird-text");

if (customFooter) {
	customFooter.innerHTML = footers[Math.floor(Math.random() * footers.length)];
}