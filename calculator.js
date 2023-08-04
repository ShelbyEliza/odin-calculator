const displayEl = document.querySelector(".display");
const periodEl = document.querySelector(".period");
const operatorEls = document.querySelectorAll(".operator");
const numberEls = document.querySelectorAll(".number");
const helperEls = document.querySelectorAll(".helper");
const equationEl = document.querySelector(".equation");
const equalsEl = document.querySelector("#equals");

let submitted = false;
let selections = [];

operatorEls.forEach((operator) => {
	operator.addEventListener("click", (e) => displayOperator(e.target));
});

numberEls.forEach((number) => {
	number.addEventListener("click", (e) =>
		displayNumber(e.target.textContent, e)
	);
});

helperEls.forEach((helper) => {
	helper.addEventListener("click", (e) => {
		handleHelper(e.target.id);
	});
});

equalsEl.addEventListener("click", handleSubmit);

function handleSubmit() {
	submitted = true;

	let lastIndex = selections.length - 1;
	let prevSelect = selections[lastIndex];
	let isThereAnOperator = selections.some((input) => {
		return input.type == "operator";
	});
	if (isThereAnOperator && prevSelect.type != "operator") {
		console.log(selections);
		let selectedArray = [];
		selections.forEach((selection) => selectedArray.push(selection.input));
		console.log(selectedArray);
		calculate(...selectedArray);
	} else {
		flashInvalid(equalsEl);
	}
}

function handleHelper(helper) {
	if (helper === "ac") {
		selections = [];
		displayEl.textContent = "Display";
	} else if (helper === "back") {
		if (selections.length > 0) {
			delete selections.pop();
			displayEl.textContent = displayEl.textContent.slice(
				0,
				displayEl.textContent.length - 1
			);
		} else {
			flashInvalid();
		}
	}
	console.log(displayEl.textContent, selections);
}

function displayNumber(value, element) {
	if (submitted === false) {
		let nValue;
		value === "." ? (nValue = value) : (nValue = parseInt(value));
		if (displayEl.textContent === "Display") {
			displayEl.textContent = nValue;
			selections = [{ input: nValue, type: "number" }];
		} else {
			if (displayEl.textContent.includes(".") && nValue === ".") {
				flashInvalid(periodEl);
				console.log("Only one decimal allowed per integer.");
				return;
			}
			let lastIndex = selections.length - 1;
			let prevSelect = selections[lastIndex];
			if (prevSelect.type == "number") {
				prevSelect.input = parseInt(
					prevSelect.input.toString() + nValue.toString()
				);
				displayEl.textContent = displayEl.textContent + nValue;
			} else {
				displayEl.textContent = displayEl.textContent + nValue;
				selections.push({ input: nValue, type: "number" });
			}
		}
	}
	// else {
	// 	flashInvalid(element);
	// }
}

function displayOperator(operator) {
	if (selections.length > 0) {
		let lastIndex = selections.length - 1;
		let prevSelect = selections[lastIndex];
		if (prevSelect.type == "operator") {
			flashInvalid(operator);
			console.log("Not a number.");
		} else {
			selections.push({ input: operator.id, type: "operator" });
			displayEl.textContent = displayEl.textContent + operator.textContent;
		}
	} else {
		flashInvalid(operator);
		console.log("Select a number value before selecting an operator.");
		return;
	}
}

function flashInvalid(element, msg) {
	element.classList.add("red");
	// switch (msg) {
	//   case
	// }
	setTimeout(() => element.classList.remove("red"), 1000);
}

const add = function (a, b) {
	return a + b;
};

const subtract = function (a, b) {
	return a - b;
};

const sum = function (array) {
	return array.reduce((sum, current) => sum + current, 0);
};

const multiply = function (array) {
	return array.reduce((total, current) => total * current);
};

const divide = function (a, b) {
	return a / b;
};

function calculate(a, operator, b) {
	console.log(a, operator, b);
	let results;
	switch (operator) {
		case "add":
			results = add(a, b);
			break;
		case "subtract":
			results = subtract(a, b);
			break;
		case "sum":
			results = sum(a, b);
			break;
		case "multiply":
			results = multiply(a, b);
			break;
		case "divide":
			results = divide(a, b);
			break;
	}
	displayEl.textContent = results;
	selections = [];
	console.log(results);
}
