var cumulativeOffset = function (element) {
	var top = 0,
		left = 0;

	// Store the width and height of the first element
	var initialWidth = element.offsetWidth || 0;
	var initialHeight = element.offsetHeight || 0;

	do {
		// Check if the current element has the class 'slides'
		if (element.classList && element.classList.contains("slides")) {
			break; // Stop if the class 'slides' is found
		}

		// Accumulate top and left values
		top += element.offsetTop || 0;
		left += element.offsetLeft || 0;

		element = element.offsetParent;
	} while (element);

	// The bottom and right are based on the initial element's dimensions
	var bottom = top + initialHeight;
	var right = left + initialWidth;

	return {
		top: top,
		left: left,
		bottom: bottom,
		right: right,
	};
};

function positionArrowBetweenElements(startElem, endElem, arrowElem) {
	// Get the container element (#git-diagram)
	const container = document.getElementById("git-diagram");
	const containerOffset = cumulativeOffset(container);

	// Get positions of the two elements (in document coordinates)
	var posA = cumulativeOffset(startElem);
	var posB = cumulativeOffset(endElem);

	// Adjust positions so they're relative to the container
	posA.top -= containerOffset.top;
	posA.bottom -= containerOffset.top;
	posA.left -= containerOffset.left;
	posA.right -= containerOffset.left;

	posB.top -= containerOffset.top;
	posB.bottom -= containerOffset.top;
	posB.left -= containerOffset.left;
	posB.right -= containerOffset.left;

	// Calculate the vertical midpoint of the start element
	var middleY = (posA.top + posA.bottom) / 2;
	// Calculate horizontal distance between the two elements
	var distanceX = posB.left - posA.right;

	if (distanceX >= 0) {
		// Right-facing arrow
		arrowElem.style.width = distanceX + "px";
		arrowElem.style.left = posA.right + "px";
		arrowElem.style.top = middleY - arrowElem.offsetHeight / 2 + "px";
		arrowElem.classList.remove("left-arrow");
		arrowElem.classList.add("right-arrow");
	} else {
		// Left-facing arrow
		distanceX = posA.left - posB.right;
		arrowElem.style.width = distanceX + "px";
		arrowElem.style.left = posB.right + "px";
		arrowElem.style.top = middleY - arrowElem.offsetHeight / 2 + "px";
		arrowElem.classList.remove("right-arrow");
		arrowElem.classList.add("left-arrow");
	}
}

const arrows = [
	"git-add",
	"git-commit",
	"git-push",
	"git-fetch",
	"git-pull",
	"git-checkout",
	"git-merge-local",
	"git-merge-origin",
];

function updateArrows() {
	// Update arrows for each arrow element
	arrows.forEach(function (arrowName) {
		const arrow = document.getElementById(arrowName);
		const arrowStart = document.getElementById(arrowName + "-start");
		const arrowEnd = document.getElementById(arrowName + "-end");

		positionArrowBetweenElements(arrowStart, arrowEnd, arrow);
	});
}

// Initial positioning of the arrows
window.addEventListener("DOMContentLoaded", updateArrows);
window.addEventListener("scroll", updateArrows);
window.addEventListener("resize", updateArrows);

tippy("[data-tippy-content]", {
	theme: "material",
	animation: "scale",
	allowHTML: true,
});
