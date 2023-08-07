const add = function (a, b) {
	return a + b;
};

const subtract = function (a, b) {
	return a - b;
};

const multiply = function (a, b) {
	return a * b;
};

const divide = function (a, b) {
	if (b === 0) {
		alert("Warning! Attempting to divide by 0 is not allowed.");
		return null;
	}
	return a / b;
};

export default {
	add,
	subtract,
	multiply,
	divide,
};
