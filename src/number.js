/**
 * Number methods
 *
 * @class number
 * @namespace abaaso
 */
var number = {
	/**
	 * Returns the difference of arg
	 *
	 * @method odd
	 * @param {Number} arg Number to compare
	 * @return {Number}    The absolute difference
	 */
	diff : function (num1, num2) {
		if (isNaN(num1) || isNaN(num2)) throw Error(label.error.expectedNumber);

		return Math.abs(num1 - num2);
	},

	/**
	 * Tests if an number is even
	 *
	 * @method even
	 * @param {Number} arg Number to test
	 * @return {Boolean}   True if even, or undefined
	 */
	even : function (arg) {
		return arg % 2 === 0;
	},

	/**
	 * Formats a Number to a delimited String
	 * 
	 * @method format
	 * @param  {Number} arg       Number to format
	 * @param  {String} delimiter [Optional] String to delimit the Number with
	 * @param  {String} every     [Optional] Position to insert the delimiter, default is 3
	 * @return {String}           Number represented as a comma delimited String
	 */
	format : function (arg, delimiter, every) {
		if (isNaN(arg)) throw Error(label.error.expectedNumber);

		arg       = arg.toString();
		delimiter = delimiter || ",";
		every     = every     || 3;

		var d = arg.indexOf(".") > -1 ? "." + arg.replace(/.*\./, "") : "",
		    a = arg.replace(/\..*/, "").split("").reverse(),
		    p = Math.floor(a.length / every),
		    i = 1, n, b;

		for (b = 0; b < p; b++) {
			n = i === 1 ? every : (every * i) + (i === 2 ? 1 : (i - 1));
			a.splice(n, 0, delimiter);
			i++;
		}

		a = a.reverse().join("");
		if (a.charAt(0) === delimiter) a = a.substring(1);
		return a + d;
	},

	/**
	 * Returns half of a, or true if a is half of b
	 * 
	 * @param  {Number} a Number to divide
	 * @param  {Number} b [Optional] Number to test a against
	 * @return {Mixed}    Boolean if b is passed, Number if b is undefined
	 */
	half : function (a, b) {
		return typeof b !== "undefined" ? ((a / b) === .5) : (a / 2);
	},

	/**
	 * Tests if a number is odd
	 *
	 * @method odd
	 * @param {Number} arg Number to test
	 * @return {Boolean}   True if odd, or undefined
	 */
	odd : function (arg) {
		return !(arg % 2 === 0);
	},

	/**
	 * Parses the number
	 * 
	 * @param  {Mixed} arg Number to parse
	 * @return {Number}    Integer or float
	 */
	parse : function (arg) {
		return String(arg).indexOf(".") < 0 ? parseInt(arg) : parseFloat(arg);
	},

	/**
	 * Rounds a number up or down
	 * 
	 * @param  {Number} arg       Float to round
	 * @param  {String} direction [Optional] "up" or "down", defaults to "down"
	 * @return {Number}           Rounded interger
	 */
	round : function (arg, direction) {
		if (String(arg).indexOf(".") < 0) return arg;
		if (!/down|up/.test(direction)) direction = "down";
		return Math[direction === "down" ? "floor" : "ceil"](arg);
	}
};
