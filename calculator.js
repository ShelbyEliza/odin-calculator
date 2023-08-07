import equations from "./equations.js";

// to display the equation after submission since displayEl becomes the answer
const displayEl = document.querySelector(".display");
const operatorEls = document.querySelectorAll(".operator");
const numberEls = document.querySelectorAll(".number");
const helperEls = document.querySelectorAll(".helper");
const equalsEl = document.querySelector("#equals");

// calculator properties:
// for reset also always set displayEl to 'Display'
let submitted = false;
let selections = [];
let selectionsExample = [
	{ input: [9], type: "number" },
	{ input: [27], type: "numberGroup" },
	{ input: [55.97], type: "numberGroup" },
	{ input: "add", type: "operator" },
];

// set event listeners:
operatorEls.forEach((operator) => {
	operator.addEventListener("click", (e) => displayInput(e.target, "operator"));
});

numberEls.forEach((number) => {
	number.addEventListener("click", (e) => displayInput(e.target, "number"));
});

helperEls.forEach((helper) => {
	helper.addEventListener("click", (e) => {
		handleHelper(e.target.id, e.target);
	});
});

equalsEl.addEventListener("click", handleSubmit);

// handler functions:
function handleHelper(helperID, helperEl) {
	// clears all app data:
	if (helperID === "ac") {
		selections = [];
		displayEl.textContent = "Display";
		submitted = false;
		// delete last element from displayEl & selections Array:
	} else if (helperID === "back") {
		// make sure there is something to delete:
		if (selections.length > 0) {
			let lastIndex = selections.length - 1;
			let prevSelect = selections[lastIndex];
			if (prevSelect.type === "operator") {
				selections.pop();
			} else if (prevSelect.type === "number") {
				if (prevSelect.input.length === 0 || prevSelect.input.length === 1) {
					selections.pop();
				} else {
					prevSelect.input.pop();
				}
			}
			// if you hit back and erase all selections, reset displayEl:
			if (selections.length === 0) {
				displayEl.textContent = "Display";
			} else {
				displayEl.textContent = displayEl.textContent.slice(
					0,
					displayEl.textContent.length - 1
				);
			}
		} else {
			flashInvalid(helperEl);
		}
	}
}

/**
 * description: adds displayEl to input
 * @param {input: DOM Element, type: String}
 */
function displayInput(input, type) {
	// submit === false means calculator is ready:
	if (submitted === false) {
		let nInput;
		if (type === "number") {
			// convert to number / check for multiple decimals in number group:
			nInput = formatNumericInput(input.textContent);

			if (selections.length > 0) {
				let lastIndex = selections.length - 1;
				let prevSelect = selections[lastIndex];
				// if previous input is a number:
				if (prevSelect.type === "number") {
					// if current input is a decimal:
					if (nInput.isDecimal === true) {
						// if previous input is a decimal warn user, else add . to array:
						if (prevSelect.input.includes(".")) {
							flashInvalid(input);
						} else {
							prevSelect.input.push(nInput.input);
							displayEl.textContent = displayEl.textContent + input.textContent;
						}
						// if current input is a number, push to array:
					} else {
						prevSelect.input.push(nInput.input);
						displayEl.textContent = displayEl.textContent + input.textContent;
					}
					// previous selection was an operator, start new number group:
				} else {
					selections.push({ input: [nInput.input], type: "number" });
					displayEl.textContent = displayEl.textContent + input.textContent;
				}
			} else if (selections.length === 0) {
				selections.push({ input: [nInput.input], type: "number" });
				displayEl.textContent = input.textContent;
			}
		} else if (type === "operator") {
			nInput = displayOperator(input);
		}
	}
}

function displayOperator(operator) {
	if (selections.length > 0) {
		let lastIndex = selections.length - 1;
		let prevSelect = selections[lastIndex];
		if (prevSelect.type == "operator") {
			flashInvalid(operator);
		} else {
			selections.push({ input: operator.id, type: "operator" });
			displayEl.textContent = displayEl.textContent + operator.textContent;
		}
	} else {
		flashInvalid(operator);
	}
}

function formatNumericInput(input) {
	let nInput;
	let isDecimal;
	// if char is a number value, convert from string:
	input === "." ? (nInput = input) : (nInput = parseInt(input));
	if (input === ".") {
		nInput = input;
		isDecimal = true;
	} else {
		nInput = parseInt(input);
		isDecimal = false;
	}
	return { input: nInput, type: "number", isDecimal: isDecimal };
}

function flashInvalid(element) {
	element.classList.add("red");

	setTimeout(() => element.classList.remove("red"), 1000);
}

function handleSubmit() {
	submitted = true;

	let lastIndex = selections.length - 1;
	let prevSelect = selections[lastIndex];
	let isThereAnOperator = selections.some((selection) => {
		return selection.type == "operator";
	});
	if (isThereAnOperator && prevSelect.type != "operator") {
		let selectedArray = [];
		selections.forEach((selection) => {
			if (selection.type === "number") {
				selectedArray.push(Number(selection.input.join("")));
			} else {
				selectedArray.push(selection.input);
			}
		});
		let results;
		while (selectedArray.length > 1) {
			results = calculate(selectedArray[0], selectedArray[1], selectedArray[2]);
			// user attempted to divide by 0:
			if (results === null) {
				submitted = false;
				selections = [];
				displayEl.textContent = "Display";
				return;
			} else {
				selectedArray.splice(0, 3, results);
			}
		}
		// resets the display to calculated result:
		// sets selections array to only the result:
		let roundedResult = roundNumber(results);
		roundedResult = Number(roundedResult);
		displayEl.textContent = roundedResult;
		selections = [{ input: [roundedResult], type: "number" }];
		submitted = false;
	} else {
		flashInvalid(equalsEl);
	}
}

function calculate(a, operator, b) {
	let results;
	switch (operator) {
		case "add":
			results = equations.add(a, b);
			break;
		case "subtract":
			results = equations.subtract(a, b);
			break;
		case "multiply":
			results = equations.multiply(a, b);
			break;
		case "divide":
			results = equations.divide(a, b);
			break;
	}
	return results;
}
function roundNumber(number) {
	return Number.parseFloat(number).toFixed(2);
}
