// concated before outro.js
error     = utility.error;
bootstrap = function () {
	var cleanup, fn;

	if (typeof abaaso.bootstrap === "function") delete abaaso.bootstrap;

	// Describing the Client
	abaaso.client.size = client.size();
	client.version();
	client.mobile();
	client.tablet();

	// IE7 and older is not supported
	if (client.ie && client.version < 8) return;
	
	cleanup = function (obj) {
		var nodes = [];

		observer.remove(obj);
		if (obj.childNodes.length > 0) nodes = array.cast(obj.childNodes);
		if (nodes.length > 0) nodes.each(function (i) { cleanup(i); });
	};

	fn = function (e) {
		if (/complete|loaded/.test(document.readyState)) {
			if (typeof abaaso.init === "function") abaaso.init();
			return false;
		}
	};

	if (typeof Array.prototype.filter === "undefined") {
		Array.prototype.filter = function (fn) {
			if (this === void 0 || this === null || typeof fn !== "function") throw Error(label.error.invalidArguments);

			var i      = null,
			    t      = Object(this),
			    nth    = t.length >>> 0,
			    result = [],
			    prop   = arguments[1],
			    val    = null;

			for (i = 0; i < nth; i++) {
				if (i in t) {
					val = t[i];
					if (fn.call(prop, val, i, t)) result.push(val);
				}
			}

			return result;
		};
	}

	if (typeof Array.prototype.forEach === "undefined") {
		Array.prototype.forEach = function (callback, thisArg) {
			if (this === null || typeof callback !== "function") throw Error(label.error.invalidArguments);

			var T,
			    k   = 0,
			    O   = Object(this),
			    len = O.length >>> 0;

			if (thisArg) T = thisArg;

			while (k < len) {
				var kValue;
				if (k in O) {
					kValue = O[k];
					callback.call(T, kValue, k, O);
				}
				k++;
			}
		};
	}

	if (typeof Array.prototype.indexOf === "undefined") {
		Array.prototype.indexOf = function(obj, start) {
			for (var i = (start || 0), j = this.length; i < j; i++) {
				if (this[i] === obj) return i;
			}

			return -1;
		}
	}

	if (!server && typeof document.documentElement.classList === "undefined") {
		(function (view) {
			var ClassList, getter, proto, target, descriptor;

			if (!("HTMLElement" in view) && !("Element" in view)) return;

			ClassList = function (obj) {
				var classes = !obj.className.isEmpty() ? obj.className.explode(" ") : [],
				    self    = this;

				classes.each(function (i) { self.push(i); });
				this.updateClassName = function () { obj.className = this.join(" "); };
			};

			getter = function () {
				return new ClassList(this);
			};

			proto  = ClassList["prototype"] = [];
			target = (view.HTMLElement || view.Element)["prototype"];

			proto.add = function (arg) {
				if (!array.contains(this, arg)) {
					this.push(arg);
					this.updateClassName();
				}
			};

			proto.contains = function (arg) {
				return array.contains(this, arg);
			};

			proto.remove = function (arg) {
				if (array.contains(this, arg)) {
					array.remove(this, arg);
					this.updateClassName();
				}
			};

			proto.toggle = function (arg) {
				array[array.contains(this, arg) ? "remove" : "add"](this, arg);
				this.updateClassName();
			};

			if (Object.defineProperty) {
				descriptor = {
					get          : getter,
					enumerable   : !client.ie || client.version > 8 ? true : false,
					configurable : true
				};

				Object.defineProperty(target, "classList", descriptor);
			}
			else if (Object.prototype.__defineGetter__) target.__defineGetter__("classList", getter);
			else throw Error("Could not create classList shim");
		})(global);
	}

	if (typeof Function.prototype.bind === "undefined") {
		Function.prototype.bind = function (arg) {
			var fn    = this,
			    slice = Array.prototype.slice,
			    args  = slice.call(arguments, 1);
			
			return function () {
				return fn.apply(arg, args.concat(slice.call(arguments)));
			};
		};
	}

	// Cookie class is not relevant for server environment
	if (server) {
		delete abaaso.cookie;
		XMLHttpRequest = xhr();
	}

	// Binding helper & namespace to $
	$ = abaaso.$.bind($);
	utility.alias($, abaaso);
	delete $.$;
	delete $.bootstrap;
	delete $.callback;
	delete $.data;
	delete $.init;
	delete $.loading;

	// Creating route.initial after alias() so it's not assumed
	abaaso.route.initial = null;

	// Short cut to loading.create
	$.loading = abaaso.loading.create.bind($.loading);

	// Unbinding observer methods to maintain scope
	$.fire      = abaaso.fire;
	$.on        = abaaso.on;
	$.once      = abaaso.once;
	$.un        = abaaso.un;
	$.listeners = abaaso.listeners;

	// Setting initial application state
	abaaso.state._current = abaaso.state.current = "initial";
	$.state._current      = $.state.current      = abaaso.state.current;

	// Setting sugar
	if (!server) switch (true) {
		case typeof global.$ === "undefined" || global.$ === null:
			global.$ = $;
			break;
		default:
			global.a$ = $;
			abaaso.aliased = "a$";
	}

	// Hooking abaaso into native Objects
	utility.proto(Array, "array");
	if (typeof Element      !== "undefined") utility.proto(Element,      "element");
	if (typeof HTMLDocument !== "undefined") utility.proto(HTMLDocument, "element");
	utility.proto(Function, "function");
	utility.proto(Number, "number");
	utility.proto(String, "string");

	// Creating a singleton
	abaaso.constructor = abaaso;

	// Creating error log
	$.error.log = abaaso.error.log = [];

	// Setting events & garbage collection
	$.on(global, "error", function (e) { $.fire("error", e); }, "error", global, "all");
	if (!server) {
		$.on(global, "hashchange", function ()  { $.fire("beforeHash, hash, afterHash", location.hash); }, "hash", global, "all");
		$.on(global, "resize",     function ()  { $.client.size = abaaso.client.size = client.size(); $.fire("resize", abaaso.client.size); }, "resize", global, "all");
		$.on(global, "load",       function ()  { $.fire("render").un("render"); });
		$.on(global, "DOMNodeInserted", function (e) {
			var obj = e.target;
			if (typeof obj.id !== "undefined" && obj.id.isEmpty()) {
				utility.genId(obj);
				if (obj.parentNode instanceof Element) obj.parentNode.fire("afterCreate", obj);
				$.fire("afterCreate", obj);
			}
		}, "mutation", global, "all");
		$.on(global, "DOMNodeRemoved", function (e) { cleanup(e.target); }, "mutation", global, "all");

		// Routing listener
		$.on("hash", function (arg) { if ($.route.enabled || abaaso.route.enabled) route.load(arg); }, "route", abaaso.route, "all");
	}

	// abaaso.state.current getter/setter
	var getter, setter;
	getter = function () { return this._current; };
	setter = function (arg) {
		if (arg === null || typeof arg !== "string" || this.current === arg || arg.isEmpty()) throw Error(label.error.invalidArguments);

		abaaso.state.previous = abaaso.state._current;
		abaaso.state._current = arg;
		return abaaso.fire(arg);
	};

	switch (true) {
		case (!client.ie || client.version > 8):
			utility.property(abaaso.state, "current", {enumerable: true, get: getter, set: setter});
			utility.property($.state,      "current", {enumerable: true, get: getter, set: setter});
			break;
		default: // Pure hackery, only exists when needed
			abaaso.state.change = function (arg) { setter.call(abaaso.state, arg); return abaaso.state.current = arg; };
			$.state.change      = function (arg) { setter.call(abaaso.state, arg); return abaaso.state.current = arg; };
	}

	$.ready = true;

	// Preparing init()
	switch (true) {
		case server:
			abaaso.init();
			break;
		case typeof global.define === "function":
			global.define("abaaso", function () { return abaaso.init(); });
			break;
		case (/complete|loaded/.test(document.readyState)):
			abaaso.init();
			break;
		case typeof document.addEventListener === "function":
			document.addEventListener("DOMContentLoaded", abaaso.init, false);
			break;
		case typeof document.attachEvent === "function":
			document.attachEvent("onreadystatechange", fn);
			break;
		default:
			utility.timer.init = utility.repeat(fn);
	}
};
