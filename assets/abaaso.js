/**
 * Copyright (c) 2010 - 2012, Jason Mulligan <jason.mulligan@avoidwork.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of abaaso nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL JASON MULLIGAN BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * abaaso
 *
 * Events: init           Fires when abaaso is ready; register modules on this event
 *         ready          Fires when the DOM is available
 *         render         Fires when the window resources have loaded
 *         resize         Fires when the window resizes; parameter for listeners is abaaso.client.size
 *         afterCreate    Fires after an Element is created; parameter for listeners is the (new) Element
 *         afterDestroy   Fires after an Element is destroyed; parameter for listeners is the (removed) Element.id value
 *         beforeCreate   Fires when an Element is about to be created; parameter for listeners is the (new) Element.id value
 *         beforeDestroy  Fires when an Element is about to be destroyed; parameter for listeners is the (to be removed) Element
 *         error          Fires when an Error is caught; parameter for listeners is the logged Object (abaaso.error.log[n])
 *         hash           Fires when window.location.hash changes; parameter for listeners is the hash value
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @link http://abaaso.com/
 * @module abaaso
 * @version 1.8.1
 */
 if (typeof $ === "undefined") var $ = null;
 if (typeof abaaso === "undefined") var abaaso = (function () {
	"use strict";

	var $;

	/**
	 * Array methods
	 *
	 * @class array
	 * @namespace abaaso
	 */
	var array = {
		/**
		 * Returns an Object (NodeList, etc.) as an Array
		 *
		 * @method cast
		 * @param  {Object}  obj Object to cast
		 * @param  {Boolean} key [Optional] Returns key or value, only applies to Objects without a length property
		 * @return {Array}   Object as an Array
		 */
		cast : function (obj, key) {
			if ((!client.safari && typeof obj !== "object") || (client.safari && typeof obj !== "function"))
				throw Error(label.error.expectedObject);

			key   = (key === true);
			var o = [], i, nth;

			switch (true) {
				case !isNaN(obj.length):
					if (!client.ie || client.version > 8) o = Array.prototype.slice.call(obj);
					else for (i = 0, nth = obj.length; i < nth; i++) { o.push(obj[i]); }
					break;
				default:
					for (i in obj) { o.push(key ? i : obj[i]); }
			}
			return o;
		},

		/**
		 * Clones an Array
		 * @param  {Array} obj Array to clone
		 * @return {Array} Clone of Array
		 */
		clone : function (obj) {
			return utility.clone(obj);
		},

		/**
		 * Finds the index of arg(s) in instance
		 *
		 * @method contains
		 * @param  {Array}  obj  Array to search
		 * @param  {String} arg  Comma delimited string of search values
		 * @return {Mixed}  Integer or an array of integers representing the location of the arg(s)
		 */
		contains : function (obj, arg) {
			if (arg.indexOf(",") > -1 ) arg = arg.explode();
			if (arg instanceof Array) {
				var indexes = [],
				    nth     = args.length,
				    i       = null;

				for (i = 0; i < nth; i++) { indexes[i] = obj.index(arg[i]); }
				return indexes;
			}
			return obj.index(arg);
		},

		/**
		 * Finds the difference between array1 and array2
		 *
		 * @method diff
		 * @param  {Array} array1 Source Array
		 * @param  {Array} array2 Comparison Array
		 * @return {Array} Array of the differences
		 */
		diff : function (array1, array2) {
			var a = array1.length > array2.length ? array1 : array2,
			    b = a === array1 ? array2 : array1;

			return a.filter(function (key) { if (b.indexOf(key) === -1) return true; });
		},

		/**
		 * Returns the first Array node
		 *
		 * @method first
		 * @param  {Array} obj The array
		 * @return {Mixed} The first node of the array
		 */
		first : function (obj) {
			return obj[0];
		},

		/**
		 * Finds the index of arg in instance. Use contains() for multiple arguments
		 *
		 * @method index
		 * @param  {Array} obj Array to search
		 * @param  {Mixed} arg Value to find index of
		 * @return {Integer} The position of arg in instance
		 */
		index : function (obj, arg) {
			var i = obj.length;

			while (i--) { if (obj[i] === arg) return i; }
			return -1;
		},

		/**
		 * Returns an Associative Array as an Indexed Array
		 *
		 * @method indexed
		 * @param  {Array} obj Array to index
		 * @return {Array} Indexed Array
		 */
		indexed : function (obj) {
			var o, indexed = [];

			for (o in obj) { if (obj.hasOwnProperty(o)) indexed.push(!(obj[o] instanceof Array) ? obj[o] : obj[o].indexed()); }
			return indexed;
		},

		/**
		 * Finds the intersections between array1 and array2
		 *
		 * @method intersect
		 * @param  {Array} array1 Source Array
		 * @param  {Array} array2 Comparison Array
		 * @return {Array} Array of the intersections
		 */
		intersect : function (array1, array2) {
			var a = array1.length > array2.length ? array1 : array2,
			    b = a === array1 ? array2 : array1;

			return a.filter(function (key) { if (b.indexOf(key) > -1) return true; });
		},

		/**
		 * Returns the keys in an Associative Array
		 *
		 * @method keys
		 * @param  {Array} obj Array to extract keys from
		 * @return {Array} Array of the keys
		 */
		keys : function (obj) {
			var i, keys = [];

			for (i in obj) { if (obj.hasOwnProperty(i) && isNaN(i)) keys.push(i); }
			return keys;
		},

		/**
		 * Returns the last node of the array
		 *
		 * @method last
		 * @param  {Array} obj Array
		 * @return {Mixed} Last node of Array
		 */
		last : function (obj) {
			var nth = obj.length;
			return nth > 1 ? obj[(nth - 1)] : obj.first();
		},

		/**
		 * Removes indexes from an Array without recreating it
		 *
		 * @method remove
		 * @param  {Array}   obj   Array to remove from
		 * @param  {Integer} start Starting index
		 * @param  {Integer} end   [Optional] Ending index
		 * @return {Array} Modified Array
		 */
		remove : function (obj, start, end) {
			if (typeof start === "string") {
				start = obj.index(start);
				if (start === -1) return obj;
			}
			else start = start || 0;

			var length    = obj.length,
			    remaining = obj.slice((end || start) + 1 || length);

			obj.length = start < 0 ? (length + start) : start;
			obj.push.apply(obj, remaining);
			return obj;
		},

		/**
		 * Gets the total keys in an Array
		 *
		 * @method
		 * @param  {Array} obj Array to find the length of
		 * @return {Integer} Number of keys in Array
		 */
		total : function (obj) {
			return obj.indexed().length;
		},

		/**
		 * Casts an Array to Object
		 * 
		 * @param  {Array} ar Array to transform
		 * @return {Object} New object
		 */
		toObject : function (ar) {
			var obj = {},
			    i   = ar.length;

			while (i--) obj[i.toString()] = ar[i];
			return obj;
		}
	};

	/**
	 * Cache for RESTful behavior
	 *
	 * @class cache
	 * @namespace abaaso
	 * @private
	 */
	var cache = {
		// Collection URIs
		items : {},

		/**
		 * Garbage collector for the cached items
		 *
		 * @method clean
		 * @return {Undefined} undefined
		 */
		clean : function () {
			var i;
			for (i in cache.items) { if (cache.expired(i)) cache.expire(i); }
		},

		/**
		 * Expires a URI from the local cache
		 * 
		 * Events: expire    Fires when the URI expires
		 *
		 * @method expire
		 * @param  {String}  uri    URI of the local representation
		 * @param  {Boolean} silent [Optional] If 'true', the event will not fire
		 * @return {Undefined} undefined
		 */
		expire : function (uri, silent) {
			silent = (silent === true);
			if (typeof cache.items[uri] !== "undefined") {
				delete cache.items[uri];
				if (!silent) uri.fire("expire");
				return true;
			}
			else return false;
		},

		/**
		 * Determines if a URI has expired
		 *
		 * @method expired
		 * @param  {Object} uri Cached URI object
		 * @return {Boolean} True if the URI has expired
		 */
		expired : function (uri) {
			var item = cache.items[uri];
			return typeof item !== "undefined" && typeof item.expires !== "undefined" && item.expires < new Date();
		},

		/**
		 * Returns the cached object {headers, response} of the URI or false
		 *
		 * @method get
		 * @param  {String}  uri    URI/Identifier for the resource to retrieve from cache
		 * @param  {Boolean} expire [Optional] If 'false' the URI will not expire
		 * @param  {Boolean} silent [Optional] If 'true', the event will not fire
		 * @return {Mixed} URI Object {headers, response} or False
		 */
		get : function (uri, expire) {
			expire = (expire !== false);
			if (typeof cache.items[uri] === "undefined") return false;
			if (expire && cache.expired(uri)) {
				cache.expire(uri);
				return false;
			}
			return cache.items[uri];
		},

		/**
		 * Sets, or updates an item in cache.items
		 *
		 * @method set
		 * @param  {String} uri      URI to set or update
		 * @param  {String} property Property of the cached URI to set
		 * @param  {Mixed} value     Value to set
		 * @return {Mixed} URI Object {headers, response} or undefined
		 */
		set : function (uri, property, value) {
			if (typeof cache.items[uri] === "undefined") {
				cache.items[uri] = {};
				cache.items[uri].permission = 0;
			}
			property === "permission" ? cache.items[uri].permission |= value
			                          : (property === "!permission" ? cache.items[uri].permission &= ~value
			                                                        : cache.items[uri][property]   =  value);
			return cache.items[uri];
		}
	};

	/**
	 * Client properties and methods
	 *
	 * @class client
	 * @namespace abaaso
	 */
	var client = {
		android : (function () { return (typeof navigator !== "undefined") && /android/i.test(navigator.userAgent); })(),
		blackberry : (function () { return (typeof navigator !== "undefined") && /blackberry/i.test(navigator.userAgent); })(),
		chrome  : (function () { return (typeof navigator !== "undefined") && /chrome/i.test(navigator.userAgent); })(),
		css3    : (function () {
			switch (true) {
				case this.mobile:
				case this.tablet:
				case this.chrome  && this.version > 5:
				case this.firefox && this.version > 2:
				case this.ie      && this.version > 8:
				case this.opera   && this.version > 8:
				case this.safari  && this.version > 4:
					this.css3 = true;
					return true;
				default:
					this.css3 = false;
					return false;
			}
			}),
		expire  : 0,
		firefox : (function () { return (typeof navigator !== "undefined") && /firefox/i.test(navigator.userAgent); })(),
		ie      : (function () { return (typeof navigator !== "undefined") && /msie/i.test(navigator.userAgent); })(),
		ios     : (function () { return (typeof navigator !== "undefined") && /ipad|iphone/i.test(navigator.userAgent); })(),
		linux   : (function () { return (typeof navigator !== "undefined") && /linux|bsd|unix/i.test(navigator.userAgent); })(),
		mobile  : (function () { return (typeof navigator !== "undefined") && /android|blackberry|ipad|iphone|meego|webos/i.test(navigator.userAgent); })(),
		playbook: (function () { return (typeof navigator !== "undefined") && /playbook/i.test(navigator.userAgent); })(),
		opera   : (function () { return (typeof navigator !== "undefined") && /opera/i.test(navigator.userAgent); })(),
		osx     : (function () { return (typeof navigator !== "undefined") && /macintosh/i.test(navigator.userAgent); })(),
		safari  : (function () { return (typeof navigator !== "undefined") && /safari/i.test(navigator.userAgent.replace(/chrome.*/i, "")); })(),
		server  : (function () { return (typeof navigator === "undefined"); })(),
		tablet  : (function () { abaaso.client.tablet = this.tablet = (typeof navigator !== "undefined") && /android|ipad|playbook|webos/i.test(navigator.userAgent) && (abaaso.client.size.x >= 1000 || abaaso.client.size.y >= 1000); }),
		webos   : (function () { return (typeof navigator !== "undefined") && /webos/i.test(navigator.userAgent); })(),
		windows : (function () { return (typeof navigator !== "undefined") && /windows/i.test(navigator.userAgent); })(),
		version : (function () {
			var version = 0;
			switch (true) {
				case this.chrome:
					version = navigator.userAgent.replace(/(.*chrome\/|safari.*)/gi, "");
					break;
				case this.firefox:
					version = navigator.userAgent.replace(/(.*firefox\/)/gi, "");
					break;
				case this.ie:
					version = navigator.userAgent.replace(/(.*msie|;.*)/gi, "");
					break;
				case this.opera:
					version = navigator.userAgent.replace(/(.*opera\/|\(.*)/gi, "");
					break;
				case this.safari:
					version = navigator.userAgent.replace(/(.*version\/|safari.*)/gi, "");
					break;
				default:
					version = (typeof navigator !== "undefined") ? navigator.appVersion : 0;
			}
			version      = !isNaN(parseInt(version)) ? parseInt(version) : 0;
			this.version = version;
			return version;
		}),

		/**
		 * Quick way to see if a URI allows a specific command
		 *
		 * @method allows
		 * @param  {String} uri     URI to query
		 * @param  {String} command Command to query for
		 * @return {Boolean} True if the command is allowed
		 */
		allows : function (uri, command) {
			try {
				if (uri.isEmpty() || command.isEmpty())
					throw Error(label.error.invalidArguments);

				if (!cache.get(uri, false)) return undefined;

				command = command.toLowerCase();
				var result;

				switch (true) {
					case command === "delete":
						result = !((uri.permissions(command).bit & 1) === 0);
						break;
					case command === "get":
						result = !((uri.permissions(command).bit & 4) === 0);
						break;
					case (/post|put/.test(command)):
						result = !((uri.permissions(command).bit & 2) === 0);
						break;
					default:
						result = false;
				}
				return result;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Gets bit value based on args
		 *
		 * 1 --d delete
		 * 2 -w- write
		 * 3 -wd write and delete
		 * 4 r-- read
		 * 5 r-x read and delete
		 * 6 rw- read and write
		 * 7 rwx read, write and delete
		 *
		 * @method bit
		 * @param  {Array} args Array of commands the URI accepts
		 * @return {Integer} To be set as a bit
		 * @private
		 */
		bit : function (args) {
			var result = 0;

			args.each(function (a) {
				switch (a.toLowerCase()) {
					case "get":
						result |= 4;
						break;
					case "post":
					case "put":
						result |= 2;
						break;
					case "delete":
						result |= 1;
						break;
				}
			});
			return result;
		},

		/**
		 * Caches the headers from the XHR response
		 * 
		 * @method headers
		 * @param  {Object} xhr  XMLHttpRequest Object
		 * @param  {String} uri  URI to request
		 * @param  {String} type Type of request
		 * @return {Object} Cached URI representation
		 * @private
		 */
		headers : function (xhr, uri, type) {
			var headers = String(xhr.getAllResponseHeaders()).split("\n"),
			    items   = {},
			    o       = {},
			    allow   = null,
			    expires = new Date(),
			    header, value;

			headers.each(function (h) {
				if (!h.isEmpty()) {
					header        = h.toString();
					value         = header.substr((header.indexOf(':') + 1), header.length).replace(/\s/, "");
					header        = header.substr(0, header.indexOf(':')).replace(/\s/, "");
					items[header] = value;
					if (/allow|access-control-allow-methods/i.test(header)) allow = value;
				}
			});

			switch (true) {
				case typeof items["Cache-Control"] !== "undefined" && /no/.test(items["Cache-Control"]):
				case typeof items["Pragma"] !== "undefined" && /no/.test(items["Pragma"]):
					break;
				case typeof items["Cache-Control"] !== "undefined" && /\d/.test(items["Cache-Control"]):
					expires = expires.setSeconds(expires.getSeconds() + parseInt(/\d{1,}/.exec(items["Cache-Control"])[0]));
					break;
				case typeof items["Expires"] !== "undefined":
					expires = new Date(items["Expires"]);
					break;
				default:
					expires = expires.setSeconds(expires.getSeconds() + $.expires);
			}

			o.expires    = expires;
			o.headers    = items;
			o.permission = client.bit(allow !== null ? allow.explode() : [type]);

			if (type !== "head") {
				cache.set(uri, "expires",    o.expires);
				cache.set(uri, "headers",    o.headers);
				cache.set(uri, "permission", o.permission);
			}

			return o;
		},

		/**
		 * Returns the permission of the cached URI
		 *
		 * @method permissions
		 * @param  {String} uri URI to query
		 * @return {Object} Contains an Array of available commands, the permission bit and a map
		 */
		permissions : function (uri) {
			var cached = cache.get(uri, false),
			    bit    = !cached ? 0 : cached.permission,
				result = {allows: [], bit: bit, map: {read: 4, write: 2, "delete": 1}};

			if (bit & 1) result.allows.push("DELETE");
			if (bit & 2) (function () { result.allows.push("PUT"); result.allows.push("PUT"); })();
			if (bit & 4) result.allows.push("GET");
			return result;
		},

		/**
		 * Creates a JSONP request if CORS is not supported, otherwise a GET request is made
		 *
		 * Events: beforeJSONP     Fires before the SCRIPT is made
		 *         afterJSONP      Fires after the SCRIPT is received
		 *         failedJSONP     Fires on error
		 *         timeoutJSONP    Fires 30s after SCRIPT is made
		 *
		 * @method jsonp
		 * @param  {String}   uri     URI to request
		 * @param  {Function} success A handler function to execute when an appropriate response been received
		 * @param  {Function} failure [Optional] A handler function to execute on error
		 * @param  {Mixed}    args    Custom JSONP handler parameter name, default is "callback"; or custom headers for GET request (CORS)
		 * @return {String} URI to query
		 */
		jsonp : function (uri, success, failure, args) {
			var curi = new String(uri).toString(),
			    guid = utility.guid(true),
			    callback, cbid, s;

			switch (true) {
				case typeof args === "undefined":
				case args === null:
				case args instanceof Object && (args.callback === null || typeof args.callback === "undefined"):
				case typeof args === "string" && args.isEmpty():
					callback = "callback";
					break;
				case args instanceof Object && typeof args.callback !== "undefined":
					callback = args.callback;
					break;
				default:
					callback = "callback";
			}

			curi = curi.replace(callback+"=?", "");

			curi.on("failedGet", function () {
				this.un("failedGet", guid)
				    .on("afterJSONP", function (arg) {
				    	this.un("afterJSONP", guid)
				    	    .un("failedJSONP", guid);
				    	if (typeof success === "function") success(arg);
				    }, guid)
				    .on("failedJSONP", function () {
				    	this.un("afterJSONP", guid)
				    	    .un("failedJSONP", guid);
				    	if (typeof failure === "function") failure();
				    }, guid);

				do cbid = utility.genId().slice(0, 10);
				while (typeof abaaso.callback[cbid] !== "undefined");

				uri = uri.replace(callback + "=?", callback + "=abaaso.callback." + cbid);

				abaaso.callback[cbid] = function (arg) {
					$.destroy(s);
					clearTimeout(abaaso.timer[cbid]);
					delete abaaso.timer[cbid];
					delete abaaso.callback[cbid];
					curi.fire("afterJSONP", arg);
				};

				s = el.create("script", {src: uri, type: "text/javascript"}, $("head")[0]);
				abaaso.timer[cbid] = setTimeout(function () { curi.fire("failedJSONP"); }, 30000);
			}, guid);

			switch (true) {
				case args instanceof Object && typeof args.Accept === "undefined":
					args.Accept = "application/json"
				case args instanceof Object && typeof args.Accept !== "undefined":
					break;
				default:
					args = {Accept: "application/json"}
			}

			return curi.get(success, failure, args);
		},

		/**
		 * Creates an XmlHttpRequest to a URI (aliased to multiple methods)
		 *
		 * Events: beforeXHR       Fires before the XmlHttpRequest is made
		 *         before[type]    Fires before the XmlHttpRequest is made, type specific
		 *         failed[type]    Fires on error
		 *         progress[type]  Fires on progress (CORS)
		 *         received[type]  Fires on XHR readystate 2, clears the timeout only!
		 *         timeout[type]   Fires 30s after XmlHttpRequest is made
		 *
		 * @method request
		 * @param  {String}   uri     URI to query
		 * @param  {String}   type    Type of request (DELETE/GET/POST/PUT/HEAD)
		 * @param  {Function} success A handler function to execute when an appropriate response been received
		 * @param  {Function} failure [Optional] A handler function to execute on error
		 * @param  {Mixed}    args    Data to send with the request, or custom headers for GETs
		 * @return {String} URI to query
		 * @private
		 */
		request : function (uri, type, success, failure, args) {
			try {
				if (/post|put/i.test(type) && typeof args === "undefined")
					throw Error(label.error.invalidArguments);

				type = type.toLowerCase();
				var l       = document.location,
				    cors    = (uri.indexOf(l.protocol + "//" + l.host) !== 0),
				    xhr     = (client.ie && client.version < 10 && cors && type === "get") ? new XDomainRequest() : new XMLHttpRequest(),
				    payload = /post|put/i.test(type) ? args : null,
				    headers = type === "get" && args instanceof Object ? args : null,
				    cached  = type === "head" ? false : cache.get(uri),
				    typed   = type.capitalize(),
				    guid    = utility.guid(true),
				    i, timer, fail;

				timer = function () {
					clearTimeout(abaaso.timer[typed + "-" + uri]);
					delete abaaso.timer[typed + "-" + uri];
					uri.un("received" + typed, guid).un("timeout"  + typed, guid);
				};

				fail = function () {
					uri.fire("failed" + typed, guid).un("failed" + typed, guid);
				};

				if (type === "delete") {
					uri.on("afterDelete", function () {
						cache.expire(uri);
						uri.un("afterDelete", guid);
					}, guid);
				}

				uri.on("received" + typed, timer, guid)
				   .on("timeout"  + typed, function (){ timer(); fail(); }, guid)
				   .on("after"    + typed, function (arg) {
				   		uri.un("received" + typed, guid)
				   		   .un("timeout" + typed, guid)
				   		   .un("after" + typed, guid)
				   		   .un("failed" + typed, guid);
				   		if (typeof success === "function") success(arg);
					}, guid)
				   .on("failed"   + typed, function () {
				   		timer();
				   		uri.un("after" + typed, guid)
				   		   .un("failed" + typed, guid);
				   		if (typeof failure === "function") failure();
					}, guid)
				   .fire("before" + typed)
				   .fire("beforeXHR");

				if (type !== "head" && uri.allows(type) === false) {
					timer();
					uri.fire("failed" + typed);
					return uri;
				}

				if (type === "get" && Boolean(cached)) uri.fire("afterGet", utility.clone(cached.response));
				else {
					abaaso.timer[typed + "-" + uri] = setTimeout(function () { uri.fire("timeout" + typed); }, 30000);
					xhr[cors && client.ie ? "onload" : "onreadystatechange"] = function () { client.response(xhr, uri, type); };

					if (client.ie && cors && client.version <= 9) {
						if (l.protocol === "http:") xhr.open(type.toUpperCase(), uri);
						else return uri.fire("failed" + typed);
					}
					else xhr.open(type.toUpperCase(), uri, true);

					if (payload !== null) {
						switch (true) {
							case typeof payload.xml !== "undefined":
								payload = payload.xml;
							case payload instanceof Document:
								payload = xml.decode(payload);
							case typeof payload === "string" && /<[^>]+>[^<]*]+>/.test(payload):
								if (typeof xhr.setRequestHeader !== "undefined") xhr.setRequestHeader("Content-type", "application/xml");
								break;
							case payload instanceof Object:
								if (typeof xhr.setRequestHeader !== "undefined") xhr.setRequestHeader("Content-type", "application/json");
								payload = json.encode(payload);
								break;
							default:
								if (typeof xhr.setRequestHeader !== "undefined") xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
						}
					}

					if (typeof xhr.setRequestHeader !== "undefined") {
						if (headers instanceof Object) {
							if (typeof headers.callback !== "undefined") delete headers.callback;
							if (typeof headers.withCredentials !== "undefined") delete headers.withCredentials;
						}
						if (headers !== null) for (i in headers) { xhr.setRequestHeader(i, headers[i]); }
						if (typeof cached === "object" && typeof cached.headers.ETag !== "undefined") xhr.setRequestHeader("ETag", cached.headers.ETag);
					}

					// Cross Origin Resource Sharing (CORS)
					if (typeof xhr.withCredentials === "boolean" && args instanceof Object && typeof args.withCredentials === "boolean") xhr.withCredentials = args.withCredentials;
					if (typeof xhr.onprogress === "object") xhr.onprogress = function (e) { uri.fire("progress" + typed, e); };

					xhr.send(payload);
				}

				return uri;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Caches the URI headers & response if received, and fires the relevant events
		 *
		 * If abaaso.state.header is set, an application state change is possible
		 *
		 * Permissions are handled if the ACCEPT header is received; a bit is set on the cached
		 * resource
		 *
		 * Events: afterXHR     Fires after the XmlHttpRequest response is received
		 *         after[type]  Fires after the XmlHttpRequest response is received, type specific
		 *         reset        Fires if a 206 response is received
		 *         moved        Fires if a 301 response is received
		 *         success      Fires if a 400 response is received
		 *         failure      Fires if an exception is thrown
		 *
		 * @method response
		 * @param  {Object} xhr  XMLHttpRequest Object
		 * @param  {String} uri  URI to query
		 * @param  {String} type Type of request
		 * @return {String} uri  URI to query
		 * @private
		 */
		response : function (xhr, uri, type) {
			try {
				var typed = type.toLowerCase().capitalize(),
				    l = document.location;

				switch (true) {
					case xhr.readyState === 2:
						uri.fire("received" + typed);
						break;
					case xhr.readyState === 4:
						switch (xhr.status) {
							case 200:
							case 204:
							case 205:
							case 301:
								var state = null,
								    s = abaaso.state,
								    o = client.headers(xhr, uri, type),
								    r, t, x;

								uri.fire("afterXHR");

								if (type === "head") return uri.fire("afterHead", o.headers);

								if (type !== "delete" && /200|301/.test(xhr.status)) {
									t = typeof o.headers["Content-Type"] !== "undefined" ? o.headers["Content-Type"] : "";
									switch (true) {
										case (/json|plain/.test(t) || t.isEmpty()) && Boolean(x = json.decode(/[\{\[].*[\}\]]/.exec(xhr.responseText))):
											r = x;
											break;
										case (/xml/.test(t) && String(xhr.responseText).isEmpty() && xhr.responseXML !== null):
											r = xml.decode(typeof xhr.responseXML.xml !== "undefined" ? xhr.responseXML.xml : xhr.responseXML);
											break;
										case (/<[^>]+>[^<]*]+>/.test(xhr.responseText)):
											r = xml.decode(xhr.responseText);
											break;
										default:
											r = xhr.responseText;
									}

									if (typeof r === "undefined")
										throw Error(label.error.serverError);

									cache.set(uri, "response", (o.response = r));
								}

								// Application state change triggered by hypermedia (HATEOAS)
								if (s.header !== null && Boolean(state = o.headers[s.header]) && s.current !== state) typeof s.change === "function" ? s.change(state) : s.current = state;

								switch (xhr.status) {
									case 200:
										uri.fire("after" + typed, utility.clone(o.response));
										break;
									case 205:
										uri.fire("reset");
										break;
									case 301:
										uri.fire("moved", o.response);
										break;
								}
								break;
							case 401:
								throw Error(label.error.serverUnauthorized);
								break;
							case 403:
								cache.set(uri, "!permission", client.bit(type));
								throw Error(label.error.serverForbidden);
								break;
							case 405:
								cache.set(uri, "!permission", client.bit(type));
								throw Error(label.error.serverInvalidMethod);
								break
							case 0:
								uri.fire("failed" + typed);
								break;
							default:
								throw Error(label.error.serverError);
						}
						break;
					case client.ie && uri.indexOf(l.protocol + "//" + l.host) !== 0 && typed === "Get": // IE XDomainRequest
						var r, x;

						switch (true) {
							case Boolean(x = json.decode(/[\{\[].*[\}\]]/.exec(xhr.responseText))):
								r = x;
								break;
							case (/<[^>]+>[^<]*]+>/.test(xhr.responseText)):
								r = xml.decode(xhr.responseText);
								break;
							default:
								r = xhr.responseText;
						}

						cache.set(uri, "permission", client.bit(["get"]));
						cache.set(uri, "response", r);
						uri.fire("afterGet", r);
						break;
				}
			}
			catch (e) {
				error(e, arguments, this, true);
				uri.fire("failed" + typed);
			}
			return uri;
		},


		/**
		 * Returns the visible area of the View
		 *
		 * @method size
		 * @return {Object} Describes the View {x: ?, y: ?}
		 */
		size : function () {
			var x = 0,
			    y = 0;

			if (!client.server) {
				x = document.compatMode === "CSS1Compat" && !client.opera ? document.documentElement.clientWidth  : document.body.clientWidth;
			    y = document.compatMode === "CSS1Compat" && !client.opera ? document.documentElement.clientHeight : document.body.clientHeight;
			}

			return {x: x, y: y};
		}
	};

	/**
	 * Cookie methods
	 *
	 * @class cookie
	 * @namespace abaaso
	 */
	var cookie = {
		/**
		 * Expires a cookie if it exists
		 *
		 * @method expire
		 * @param  {String} name Name of the cookie to expire
		 * @return {String} Name of the expired cookie
		 */
		expire : function (name) {
			if (typeof this.get(name) !== "undefined") this.set(name, "", "-1s");
			return name;
		},

		/**
		 * Gets a cookie
		 *
		 * @method get
		 * @param  {String} name Name of the cookie to get
		 * @return {Mixed} Cookie or undefined
		 */
		get : function (name) {
			return this.list()[name];
		},

		/**
		 * Gets the cookies for the domain
		 *
		 * @method list
		 * @return {Object} Collection of cookies
		 */
		list : function () {
			var result = {},
			    item, items;

			if (!client.server && typeof document.cookie !== "undefined" && !document.cookie.isEmpty()) {
				items = document.cookie.split(';');
				items.each(function (i) {
					item = i.split("=");
					result[decodeURIComponent(item[0].toString().trim())] = decodeURIComponent(item[1].toString().trim());
				});
			}
			return result;
		},

		/**
		 * Creates a cookie
		 *
		 * The offset specifies a positive or negative span of time as day, hour, minute or second
		 *
		 * @method set
		 * @param  {String} name   Name of the cookie to create
		 * @param  {String} value  Value to set
		 * @param  {String} offset A positive or negative integer followed by "d", "h", "m" or "s"
		 * @return {Object} The new cookie
		 */
		set : function (name, value, offset) {
			offset = offset.toString() || "";
			var expire = "",
			    span   = null,
			    type   = null,
			    types  = ["d", "h", "m", "s"],
			    i      = types.length;

			if (!offset.isEmpty()) {
				while (i--) {
					if (new RegExp(types[i]).test(offset)) {
						type = types[i];
						span = parseInt(offset);
						break;
					}
				}

				if (isNaN(span))
					throw Error(label.error.invalidArguments);

				expire = new Date();
				switch (type) {
					case "d":
						expire.setDate(expire.getDate() + span);
						break;
					case "h":
						expire.setHours(expire.getHours() + span);
						break;
					case "m":
						expire.setMinutes(expire.getMinutes() + span);
						break;
					case "s":
						expire.setSeconds(expire.getSeconds() + span);
						break;
				}
			}
			if (!expire.isEmpty()) expire = "; expires=" + expire.toUTCString();
			document.cookie = name.toString().trim() + "=" + value + expire + "; path=/";
			return this.get(name);
		}
	};

	/**
	 * Template data store, use $.store(obj), abaaso.store(obj) or abaaso.data.register(obj)
	 * to register it with an Object
	 *
	 * RESTful behavior is supported, by setting the 'key' & 'uri' properties
	 *
	 * Do not use this directly!
	 *
	 * @class data
	 * @namespace abaaso
	 */
	var data = {
		// Inherited by data stores
		methods : {
			/**
			 * Batch sets or deletes data in the store
			 *
			 * Events: beforeDataBatch  Fires before the batch is queued
			 *         afterDataBatch   Fires after the batch is queued
			 *
			 * @method batch
			 * @param  {String}  type Type of action to perform
			 * @param  {Mixed}   data Array of keys or indexes to delete, or Object containing multiple records to set
			 * @param  {Boolean} sync [Optional] Syncs store with data, if true everything is erased
			 * @return {Object} Data store
			 */
			batch : function (type, data, sync) {
				try {
					type = type.toString().toLowerCase() || undefined;
					sync = (sync === true);

					if (!/^(set|del)$/.test(type) || typeof data !== "object")
						throw Error(label.error.invalidArguments);

					var obj = this.parentNode,
					    i, nth, key;

					obj.fire("beforeDataBatch");
					if (sync) this.clear(true);
					if (data instanceof Array) {
						for (i = 0, nth = data.length; i < nth; i++) {
							if (type === "set") {
								if (this.key !== null && typeof data[i][this.key] !== "undefined") {
									key = data[i][this.key];
									delete data[i][this.key];
								}
								else key = i.toString();
								this.set(key, data[i], sync);
							}
							else this.del(data[i], false, sync);
						}
					}
					else {
						for (i in data) {
							if (type === "set") {
								if (this.key !== null && typeof data[i][this.key] !== "undefined") {
									key = data[i][this.key];
									delete data[i][this.key];
								}
								else key = i.toString();
								this.set(key, data[i], sync);
							}
							else this.del(data[i], false, sync);
						}
					}
					if (type === "del") this.reindex();
					obj.fire("afterDataBatch");
					return this;
				}
				catch (e) {
					error(e, arguments, this);
					return undefined;
				}
			},

			/**
			 * Clears the data object, unsets the uri property
			 *
			 * Events: beforeDataClear  Fires before the data is cleared
			 *         afterDataClear   Fires after the data is cleared
			 *
			 * @method clear
			 * @param {Boolean} sync [Optional] Boolean to limit clearing of properties
			 * @return {Object} Data store
			 */
			clear : function (sync) {
				sync    = (sync === true);
				var obj = this.parentNode;

				if (!sync) {
					obj.fire("beforeDataClear");
					this.callback    = null;
					this.credentials = null;
					this.expires     = null;
					this._expires    = null;
					this.key         = null;
					this.keys        = {};
					this.records     = [];
					this.source      = null;
					this.total       = 0;
					this.views       = {};
					this.uri         = null;
					this._uri        = null;
					obj.fire("afterDataClear");
				}
				else {
					this.keys        = {};
					this.records     = [];
					this.total       = 0;
					this.views       = {};
				}
				return this;
			},

			/**
			 * Deletes a record based on key or index
			 *
			 * Events: beforeDataDelete  Fires before the record is deleted
			 *         afterDataDelete   Fires after the record is deleted
			 *         syncDataDelete    Fires when the local store is updated
			 *         failedDataDelete  Fires if the store is RESTful and the action is denied
			 *
			 * @method del
			 * @param  {Mixed}   record  Record key or index
			 * @param  {Boolean} reindex Default is true, will re-index the data object after deletion
			 * @param  {Boolean} sync    [Optional] True if called by data.sync
			 * @return {Object} Data store
			 */
			del : function (record, reindex, sync) {
				if (typeof record === "undefined" || (typeof record !== "number" && typeof record !== "string"))
					throw Error(label.error.invalidArguments);

				reindex  = (reindex !== false);
				sync     = (sync === true);
				var obj  = this.parentNode,
				    p    = {},
				    r    = new RegExp("true|undefined"),
				    key, args, uri;

				switch (typeof record) {
					case "string":
						key    = record;
						record = this.keys[key];
						if (typeof key === "undefined") throw Error(label.error.invalidArguments);
						record = record.index;
						break;
					default:
						key = this.records[record];
						if (typeof key === "undefined") throw Error(label.error.invalidArguments);
						key = key.key;
				}

				args   = {key: key, record: record, reindex: reindex};
				uri    = this.uri + "/" + key;
				p.uri  = uri.allows("delete");
				p.data = this.uri.allows("delete");

				obj.fire("beforeDataDelete", args);
				switch (true) {
					case sync:
					case this.uri === null:
						obj.fire("syncDataDelete", args);
						break;
					case r.test(p.data) && r.test(p.uri):
						uri.del(function () { obj.fire("syncDataDelete", args); }, function () { obj.fire("failedDataDelete", args); });
						break;
					default:
						obj.fire("failedDataDelete", args);

				}
				return this;
			},

			/**
			 * Finds needle in the haystack
			 *
			 * Events: beforeDataFind  Fires before the search begins
			 *         afterDataFind   Fires after the search has finished
			 *
			 * @method find
			 * @param  {Mixed} needle   String, Number or Pattern to test for
			 * @param  {Mixed} haystack [Optional] The field(s) to search
			 * @return {Array} Array of results
			 */
			find : function (needle, haystack) {
				try {
					if (typeof needle === "undefined")
						throw Error(label.error.invalidArguments);

					var h      = [],
					    n      = typeof needle === "string" ? needle.explode() : needle,
					    result = [],
					    nth,
					    nth2   = n.length,
					    obj    = this.parentNode,
					    keys   = {},
					    x, y, f, r, s, p, i, a;

					obj.fire("beforeDataFind");

					r = this.records.first();
					switch (true) {
						case typeof haystack === "string":
							h = haystack.explode()
							i = h.length;
							while (i--) { if (!r.data.hasOwnProperty(h[i])) throw Error(label.error.invalidArguments); }
							break;
						default:
							for (i in r.data) { h.push(i); }
					}

					nth = h.length;
					a   = this.total;

					for (i = 0; i < a; i++) {
						for (x = 0; x < nth; x++) {
							for (y = 0; y < nth2; y++) {
								f = h[x];
								p = n[y];
								r = new RegExp(p, "gi");
								s = this.records[i].data[f];
								if (!keys[this.records[i].key] && r.test(s)) {
									keys[this.records[i].key] = i;
									result.push(this.records[i]);
								}
							}
						}
					}

					obj.fire("afterDataFind", keys);
					return result;
				}
				catch (e) {
					error(e, arguments, this);
					return undefined;
				}
			},

			/**
			 * Transforms a record to a Form for editing
			 * 
			 * If record is null, an empty form based on the first record is generated.
			 * The submit action is data.set() which triggers a POST or PUT
			 * from the data store.
			 * 
			 * @param  {Mixed}   record null, record, key or index
			 * @param  {Object}  target Target HTML Element
			 * @param  {Boolean} test   [Optional] Test form before setting values
			 * @return {Object} Generated HTML form
			 */
			form : function (record, target, test) {
				try {
					var empty = (record === null),
					    self  = this,
					    entity, obj, handler, structure, key, data;

					switch (true) {
						case empty:
							record = this.get(0);
							break;
						case !(record instanceof Object):
							record = this.get(record);
							break;
					}

					switch (true) {
						case typeof record === "undefined":
							throw Error(label.error.invalidArguments);
						case this.uri !== null && !this.uri.allows("post"): // POST & PUT are interchangable for this bit
							throw Error(label.error.serverInvalidMethod);
					}

					key  = record.key;
					data = record.data;

					if (typeof target !== "undefined") target = utility.object(target);
					entity = this.uri.replace(/.*\//, "").replace(/\?.*/, "")
					if (entity.isDomain()) entity = entity.replace(/\..*/g, "");

					/**
					 * Button handler
					 * 
					 * @param  {Object} event Window event
					 * @return {Undefined} undefined
					 */
					handler = function (event) {
						var form    = event.srcElement.parentNode,
						    nodes   = $("#" + form.id + " input"),
						    entity  = nodes[0].name.match(/(.*)\[/)[1],
						    result  = true,
						    newData = {};

						self.parentNode.fire("beforeDataFormSubmit");

						if (test) result = form.validate();

						switch (result) {
							case false:
								self.parentNode.fire("failedDataFormSubmit");
								break;
							case true:
								nodes.each(function (i) { utility.define(i.name.replace("[", ".").replace("]", ""), i.value, newData); });
								self.set(key, newData[entity]);
								break;
						}

						self.parentNode.fire("afterDataFormSubmit", key);
					};

					/**
					 * Data structure in micro-format
					 * 
					 * @param  {Object} record Data store record
					 * @param  {Object} obj    [description]
					 * @param  {String} name   [description]
					 * @return {Undefined} undefined
					 */
					structure = function (record, obj, name) {
						var i, x, id;
						for (i in record) {
							switch (true) {
								case record[i] instanceof Array:
									x = 0;
									record[i].each(function (o) { structure(o, obj, name + "[" + i + "][" + (x++) + "]"); });
									break;
								case record[i] instanceof Object:
									structure(record[i], obj, name + "[" + i + "]");
									break;
								default:
									id = (name + "[" + i + "]").replace(/\[|\]/g, "");
									obj.create("label", {"for": id}).html(i.capitalize());
									obj.create("input", {id: id, name: name + "[" + i + "]", type: "text", value: empty ? "" : record[i]});
							}
						}
					};

					this.parentNode.fire("beforeDataForm");
					obj = el.create("form", {style: "display:none;"}, target);
					structure(data, obj, entity);
					obj.create("input", {type: "button", value: label.common.submit}).on("click", function(e) { handler(e); });
					obj.create("input", {type: "reset", value: label.common.reset});
					obj.css("display", "inherit");
					this.parentNode.fire("afterDataForm", obj);
					return obj;
				}
				catch (e) {
					error(e, arguments, this);
					return undefined;
				}
			},

			/**
			 * Retrieves a record based on key or index
			 *
			 * If the key is an integer, cast to a string before sending as an argument!
			 *
			 * Events: beforeDataGet  Fires before getting the record
			 *         afterDataGet   Fires after getting the record
			 *
			 * @method get
			 * @param  {Mixed} record Key, index or Array of pagination start & end
			 * @return {Mixed} Individual record, or Array of records
			 */
			get : function (record) {
				var r   = [],
				    obj = this.parentNode,
				    i, start, end;

				obj.fire("beforeDataGet");

				switch (true) {
					case typeof record === "undefined" || String(record).length === 0:
						r = this.records;
						break;
					case typeof record === "string" && typeof this.keys[record] !== "undefined":
						r = this.records[this.keys[record].index];
						break;
					case typeof record === "number":
						r = this.records[record];
						break;
					case record instanceof Array:
						if (!!isNaN(record[0]) || !!isNaN(record[1]))
							throw Error(label.error.invalidArguments);

						start = record[0] - 1;
						end   = record[1] - 1;
						for (i = start; i < end; i++) { if (typeof this.records[i] !== "undefined") r.push(this.records[i]); }
						break;
					default:
						r = undefined;
				}

				obj.fire("afterDataGet", r);
				return r;
			},

			/**
			 * Reindexes the data store
			 *
			 * Events: beforeDataReindex  Fires before reindexing the data store
			 *         afterDataReindex   Fires after reindexing the data store
			 *
			 * @method reindex
			 * @return {Object} Data store
			 */
			reindex : function () {
				var nth = this.total,
				    obj = this.parentNode,
				    i;

				obj.fire("beforeDataReindex");
				this.views = {};
				for(i = 0; i < nth; i++) {
					if (this.records[i].key.isNumber()) {
						delete this.keys[this.records[i].key];
						this.keys[i.toString()] = {};
						this.records[i].key = i.toString();
					}
					this.keys[this.records[i].key].index = i;
				}
				obj.fire("afterDataReindex");
				return this;
			},

			/**
			 * Creates or updates an existing record
			 *
			 * If a POST is issued, and the data.key property is not set the
			 * first property of the response object will be used as the key
			 *
			 * Events: beforeDataSet  Fires before the record is set
			 *         afterDataSet   Fires after the record is set, the record is the argument for listeners
			 *         syncDataSet    Fires when the local store is updated
			 *         failedDataSet  Fires if the store is RESTful and the action is denied
			 *
			 * @method set
			 * @param  {Mixed}   key  Integer or String to use as a Primary Key
			 * @param  {Object}  data Key:Value pairs to set as field values
			 * @param  {Boolean} sync [Optional] True if called by data.sync
			 * @return {Object} The data store
			 */
			set : function (key, data, sync) {
				key  = key === null ? undefined : key.toString();
				sync = (sync === true);

				switch (true) {
					case (typeof key === "undefined" || key.isEmpty()) && this.uri === null:
					case typeof data === "undefined":
					case data instanceof Array:
					case data instanceof Number:
					case data instanceof String:
					case typeof data !== "object":
						throw Error(label.error.invalidArguments);
				}

				var record = typeof this.keys[key] === "undefined" && typeof this.records[key] === "undefined" ? undefined : this.get(key),
				    obj    = this.parentNode,
				    method = typeof key === "undefined" ? "post" : "put",
				    args   = {data: data, key: key, record: record},
				    uri    = this.uri + "/" + key,
				    p      = {},
				    r      = new RegExp("true|undefined");

				p.uri  = uri.allows(method);
				p.data = this.uri.allows(method);

				obj.fire("beforeDataSet");
				switch (true) {
					case sync:
					case this.uri === null:
						obj.fire("syncDataSet", args);
						break;
					case r.test(p.data) && r.test(p.uri):
						uri[method](function (arg) { args["result"] = arg; obj.fire("syncDataSet", args); }, function () { obj.fire("failedDataSet"); }, data);
						break;
					default:
						obj.fire("failedDataSet", args);
				}
				return this;
			},

			/**
			 * Returns a view, or creates a view and returns it
			 *
			 * Events: beforeDataSort  Fires before the record is set
			 *         afterDataSort   Fires after the record is set, the record is the argument for listeners
			 *
			 * @method sort
			 * @param  {String} query   Single column sort
			 * @param  {String} create  [Optional, default is true] Boolean determines whether to recreate a view if it exists
			 * @return {Array} View of data
			 */
			sort : function (query, create) {
				try {
					if (typeof query === "undefined" || String(query).isEmpty())
						throw Error(label.error.invalidArguments);

					create      = (create === true);
					var obj     = this.parentNode,
					    view    = query.toCamelCase().replace(/Asc$/, ""),
					    order   = [],
					    records = [],
					    needle, desc, value, index;

					if (!create && this.views[view] instanceof Array) return this.views[view];
					if (this.total === 0) return this.records;

					desc   = new RegExp("\\s+desc", "i");
					needle = query.replace(/\s.*$/, "");

					if (!this.records[0].data.hasOwnProperty(needle))
						throw Error(label.error.invalidArguments);

					obj.fire("beforeDataSort");

					this.records.each(function (rec) {
						value = String(rec.data[needle]).trim() + ":::" + rec.key;
						order.push(value);
					});

					order.sort();
					if (desc.test(query)) order.reverse();

					needle = new RegExp(":::(.*)$");
					order.each(function (rec) {
						index = obj.data.keys[needle.exec(rec)[1]].index;
						records.push(obj.data.records[index]);
					});

					this.views[view] = records;
					obj.fire("afterDataSort", view);
					return records;
				}
				catch (e) {
					error(e, arguments, this);
					return undefined;
				}
			},

			/**
			 * Syncs the data store with a URI representation
			 *
			 * Events: beforeDataSync  Fires before syncing the data store
			 *         afterDataSync   Fires after syncing the data store
			 *
			 * @method sync
			 * @param {Boolean} reindex [Optional] True will reindex the data store
			 * @return {Object} Data store
			 */
			sync : function (reindex) {
				try {
					if (this.uri === null || this.uri.isEmpty())
						throw Error(label.error.invalidArguments);

					reindex  = (reindex === true);
					var self = this,
					    obj  = self.parentNode,
					    guid = utility.guid(true),
					    success, failure;

					success = function (arg) {
						try {
							if (typeof arg !== "object")
								throw Error(label.error.expectedObject);

							var i, data = [];

							if (self.source !== null && typeof arg[self.source] !== "undefined") arg = arg[self.source];

							if (arg instanceof Array) data = arg;
							else {
								for (i in arg) {
									if (arg[i] instanceof Array) {
										data = data.concat(arg[i]);
										break;
									}
								}
							}

							self.batch("set", data, true);
							if (reindex) self.reindex();
							obj.fire("afterDataSync", arg);
						}
						catch (e) {
							error(e, arguments, this);
							obj.fire("failedDataSync");
						}
					};

					failure = function () { obj.fire("failedDataSync"); };

					obj.fire("beforeDataSync");
					this.uri.jsonp(success, failure, {callback: this.callback, withCredentials: this.credentials});
					return this;
				}
				catch (e) {
					error(e, arguments, this);
					return this;
				}
			}
		},

		/**
		 * Registers a data store on an Object
		 *
		 * Events: beforeDataStore  Fires before registering the data store
		 *         afterDataStore   Fires after registering the data store
		 *
		 * @method register
		 * @param  {Object} obj  Object to register with
		 * @param  {Mixed}  data [Optional] Data to set with this.batch
		 * @return {Object} Object registered with
		 */
		register : function (obj, data) {
			if (obj instanceof Array) return obj.each(function (i) { data.register(i, data); });

			var methods = {
				expires : {
					getter : function () { return this._expires; },
					setter : function (arg) {
						try {
							if (this.uri === null || (arg !== null && (isNaN(arg) || typeof arg === "boolean")))
								throw Error(label.error.invalidArguments);

							if (this._expires === arg) return;
							this._expires = arg;

							var id      = this.parentNode.id + "DataExpire",
							    expires = this.expires,
							    uri     = this.uri;

							if (arg === null) {
								clearTimeout($.repeating[id]);
								delete $.repeating[id];
							}
							else $.defer(function () { $.repeat(function () { if (!cache.expire(uri)) uri.fire("expire"); }, expires, id) }, expires);
						}
						catch (e) {
							error(e, arguments, this);
							return undefined;
						}
					}
				},
				uri : {
					getter : function () { return this._uri; },
					setter : function (arg) {
						try {
							if (arg !== null && arg.isEmpty())
								throw Error(label.error.invalidArguments);

							switch (true) {
								case this._uri === arg:
									return;
								case this.uri !== null:
									this.uri.un("expire", "dataSync");
									cache.expire(this.uri, true);
								default:
									this._uri = arg;
							}

							switch (true) {
								case arg !== null:
									this.uri.on("expire", function () { this.sync(true); }, "dataSync", this);
									cache.expire(arg, true);
									this.sync();
									break;
								default:
									this.clear(true);
							}
						}
						catch (e) {
							error(e, arguments, this);
							return undefined;
						}
					}
				}
			};

			obj = utility.object(obj);
			$.genId(obj);

			// Hooking observer if not present in prototype chain
			switch (true) {
				case typeof obj.fire === "undefined":
					obj.fire = function (event, arg) { return $.fire.call(this, event, arg); };
				case typeof obj.listeners === "undefined":
					obj.listeners = function (event) { return $.listeners.call(this, event); };
				case typeof obj.on === "undefined":
					obj.on = function (event, listener, id, scope, standby) { return $.on.call(this, event, listener, id, scope, standby); };
				case typeof obj.un === "undefined":
					obj.un = function (event, id) { return $.un.call(this, event, id); };
			}

			obj.fire("beforeDataStore");

			obj.data = $.extend(this.methods);
			obj.data.parentNode = obj; // Recursion, useful
			obj.data.clear();          // Setting properties

			obj.on("syncDataDelete", function (data) {
				var record = this.get(data.record);
				this.records.remove(data.record);
				delete this.keys[data.key];
				this.total--;
				this.views = {};
				if (data.reindex) this.reindex();
				this.parentNode.fire("afterDataDelete", record);
				return this.parentNode;
			}, utility.guid(true), obj.data);

			obj.on("syncDataSet", function (data) {
				var record;
				if (typeof data.record === "undefined") {
					var index = this.total;
					this.total++;
					if (typeof data.key === "undefined") {
						if (typeof data.result === "undefined") {
							this.fire("failedDataSet");
							throw Error(label.error.expectedObject);
						}
						data.key = this.key === null ? array.cast(data.result).first() : data.result[this.key];
						data.key = data.key.toString();
					}
					if (typeof data.data[data.key] !== "undefined") data.key = data.data[data.key];
					this.keys[data.key] = {};
					this.keys[data.key].index = index;
					this.records[index] = {};
					record = this.records[index];
					record.data = utility.clone(data.data);
					record.key  = data.key;
					if (this.key !== null && this.records[index].data.hasOwnProperty(this.key)) delete this.records[index].data[this.key];
				}
				else {
					data.record.data = utility.clone(data.data);
					record = data.record;
				}
				this.views = {};
				this.parentNode.fire("afterDataSet", record);
			}, utility.guid(true), obj.data);

			// Getters & setters
			switch (true) {
				case (!client.ie || client.version > 8) && typeof Object.defineProperty === "function":
					Object.defineProperty(obj.data, "uri", {get: methods.uri.getter, set: methods.uri.setter});
					Object.defineProperty(obj.data, "expires", {get: methods.expires.getter, set: methods.expires.setter});
					break;
				case typeof obj.data.__defineGetter__ === "function":
					obj.data.__defineGetter__("expires", methods.expires.getter);
					obj.data.__defineSetter__("expires", methods.expires.setter);
					obj.data.__defineGetter__("uri", methods.uri.getter);
					obj.data.__defineSetter__("uri", methods.uri.setter);
					break;
				default: // Only exists when no getters/setters (IE8)
					obj.data.setExpires = function (arg) {
						obj.data.expires = arg;
						methods.expires.setter.call(obj.data, arg);
					};
					obj.data.setUri = function (arg) {
						obj.data.uri = arg;
						methods.uri.setter.call(obj.data, arg);
					};
			}

			if (typeof data === "object") obj.data.batch("set", data);
			obj.fire("afterDataStore");
			return obj;
		}
	};

	/**
	 * Element methods
	 *
	 * @class el
	 * @namespace abaaso
	 */
	var el = {
		/**
		 * Adds or removes a CSS class
		 *
		 * Events: beforeClassChange  Fires before the Object's class is changed
		 *         afterClassChange   Fires after the Object's class is changed
		 *
		 * @method clear
		 * @param  {Mixed}   obj Element or Array of Elements or $ queries
		 * @param  {String}  arg Class to add or remove (can be a wildcard)
		 * @param  {Boolean} add Boolean to add or remove, defaults to true
		 * @return {Mixed} Element or Array of Elements
		 */
		klass : function (obj, arg, add) {
			try {
				if (obj instanceof Array) return obj.each(function (i) { el.klass(i, arg, add); });

				obj = utility.object(obj);
				add = (add !== false);

				if (obj instanceof Element !== true || String(arg).isEmpty())
					throw Error(label.error.invalidArguments);

				obj.fire("beforeClassChange");

				var classes = obj.className.split(" "),
				    nth     = classes.length,
				    i;

				switch (true) {
					case add:
						if (classes.index(arg) < 0) classes.push(arg);
						break;
					case !add:
						arg === "*" ? classes = [] : classes.remove(arg);
						break;
				}

				classes = classes.join(" ");
				client.ie && client.version < 9 ? obj.className = classes : obj.setAttribute("class", classes);

				obj.fire("afterClassChange");
				return obj;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Clears an object's innerHTML, or resets it's state
		 *
		 * Events: beforeClear  Fires before the Object is cleared
		 *         afterClear   Fires after the Object is cleared
		 *
		 * @method clear
		 * @param  {Mixed} obj Element or Array of Elements or $ queries
		 * @return {Mixed} Element or Array of Elements
		 */
		clear : function (obj) {
			try {
				if (obj instanceof Array) return obj.each(function (i) { el.clear(i); });

				obj = utility.object(obj);

				if (!obj instanceof Element)
					throw Error(label.error.invalidArguments);

				obj.fire("beforeClear");
				switch (true) {
					case typeof obj.reset === "function":
						obj.reset();
						break;
					case typeof obj.value !== "undefined":
						obj.update({innerHTML: "", value: ""});
						break;
					default:
						obj.update({innerHTML: ""});
				}
				obj.fire("afterClear");
				return obj;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Creates an Element in document.body or a target Element
		 *
		 * An id is generated if not specified with args
		 *
		 * Events: beforeCreate  Fires after the Element has been created, but not set
		 *         afterCreate   Fires after the Element has been appended to it's parent
		 *
		 * @method create
		 * @param  {String} type   Type of Element to create
		 * @param  {Object} args   [Optional] Collection of properties to apply to the new element
		 * @param  {Mixed}  target [Optional] Target object or element.id value to append to
		 * @param  {Mixed} pos     [Optional] "first", "last" or Object describing how to add the new Element, e.g. {before: referenceElement}
		 * @return {Object} Element that was created or undefined
		 */
		create : function (type, args, target, pos) {
			try {
				if (typeof type === "undefined" || String(type).isEmpty())
					throw Error(label.error.invalidArguments);

				var obj, uid;

				switch (true) {
					case typeof target !== "undefined":
						target = utility.object(target);
						break;
					case typeof args !== "undefined" && (typeof args === "string" || typeof args.childNodes !== "undefined"):
						target = utility.object(args);
						break;
					default:
						target = document.body;
				}

				if (typeof target === "undefined")
					throw Error(label.error.invalidArguments);

				uid = typeof args !== "undefined"
				       && typeof args !== "string"
				       && typeof args.childNodes === "undefined"
				       && typeof args.id !== "undefined"
				       && typeof $("#"+args.id) === "undefined" ? args.id : utility.genId();

				if (typeof args !== "undefined" && typeof args.id !== "undefined") delete args.id;

				$.fire("beforeCreate", uid);
				uid.fire("beforeCreate");
				obj = document.createElement(type);
				obj.id = uid;
				if (typeof args === "object" && typeof args.childNodes === "undefined") obj.update(args);
				switch (true) {
					case typeof pos === "undefined":
					case pos === "last":
						target.appendChild(obj);
						break;
					case pos === "first":
						target.prependChild(obj);
						break;
					case typeof pos.after !== "undefined":
						target.insertBefore(obj, pos.after.nextSibling);
						break;
					case typeof pos.before !== "undefined":
						target.insertBefore(obj, pos.before);
						break;
					default:
						target.appendChild(obj);
				}
				obj.fire("afterCreate");
				$.fire("afterCreate", obj);
				return obj;
			}
			catch(e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Creates a CSS stylesheet in the View
		 *
		 * @method css
		 * @param  {String} content CSS to put in a style tag
		 * @return {Object} Element created or undefined
		 */
		css : function (content) {
			var ss, css;
			ss = $.create("style", {type: "text/css"}, $("head")[0]);
			if (ss.styleSheet) ss.styleSheet.cssText = content;
			else {
				css = document.createTextNode(content);
				ss.appendChild(css);
			}
			return ss;
		},

		/**
		 * Destroys an Element
		 *
		 * Events: beforeDestroy  Fires before the destroy starts
		 *         afterDestroy   Fires after the destroy ends
		 *
		 * @method destroy
		 * @param  {Mixed} obj Element or Array of Elements or $ queries
		 * @return {Mixed} Element, Array of Elements or undefined
		 */
		destroy : function (obj) {
			try {
				if (obj instanceof Array) {
					var i = !isNaN(obj.length) ? obj.length : obj.total();
					while (i--) { this.destroy(obj[i]); }
					return obj;
				}

				obj = utility.object(obj);

				if (!obj instanceof Element)
					throw Error(label.error.invalidArguments);

				$.fire("beforeDestroy", obj);
				obj.fire("beforeDestroy");
				observer.remove(obj.id);
				if (obj.parentNode !== null) obj.parentNode.removeChild(obj);
				obj.fire("afterDestroy");
				$.fire("afterDestroy", obj.id);
			}
			catch(e) {
				error(e, arguments, this);
			}
			return undefined;
		},

		/**
		 * Disables an Element
		 *
		 * Events: beforeDisable  Fires before the disable starts
		 *         afterDisable   Fires after the disable ends
		 *
		 * @method disable
		 * @param  {Mixed} obj Element or Array of Elements or $ queries
		 * @return {Mixed} Element, Array of Elements or undefined
		 */
		disable : function (obj) {
			try {
				if (obj instanceof Array) {
					var i = !isNaN(obj.length) ? obj.length : obj.total();
					while (i--) { this.disable(obj[i]); }
					return obj;
				}

				obj = utility.object(obj);

				if (!obj instanceof Element)
					throw Error(label.error.invalidArguments);

				if (typeof obj.disabled === "boolean" && !obj.disabled) {
					obj.fire("beforeDisable");
					obj.disabled = true;
					obj.fire("afterDisable");
				}
				return obj;
			}
			catch(e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Enables an Element
		 *
		 * Events: beforeEnable  Fires before the enable starts
		 *         afterEnable   Fires after the enable ends
		 *
		 * @method enable
		 * @param  {Mixed} obj Element or Array of Elements or $ queries
		 * @return {Mixed} Element, Array of Elements or undefined
		 */
		enable : function (obj) {
			try {
				if (obj instanceof Array) {
					var i = !isNaN(obj.length) ? obj.length : obj.total();
					while (i--) { this.enable(obj[i]); }
					return obj;
				}

				obj = utility.object(obj);

				if (!obj instanceof Element)
					throw Error(label.error.invalidArguments);

				if (typeof obj.disabled === "boolean" && obj.disabled) {
					obj.fire("beforeEnable");
					obj.disabled = false;
					obj.fire("afterEnable");
				}
				return obj;
			}
			catch(e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Hides an Element if it's visible
		 *
		 * Events: beforeHide  Fires before the object is hidden
		 *         afterHide   Fires after the object is hidden
		 *
		 * @method hide
		 * @param  {Mixed} obj Element or Array of Elements or $ queries
		 * @return {Mixed} Element, Array of Elements or undefined
		 */
		hide : function (obj) {
			try {
				if (obj instanceof Array) return obj.each(function (i) { el.hide(i); });

				obj = utility.object(obj);

				if (!obj instanceof Element)
					throw Error(label.error.invalidArguments);

				obj.fire("beforeHide");
				switch (true) {
					case typeof obj.hidden === "boolean":
						obj.hidden = true;
						break;
					default:
						obj["data-display"] = obj.style.display;
						obj.style.display = "none";
				}
				obj.fire("afterHide");
				return obj;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Returns a Boolean indidcating if the Object is hidden
		 *
		 * @method hidden
		 * @param  {Mixed} obj Element or $ query
		 * @return {Mixed} Boolean indicating if Object is hidden
		 */
		hidden : function (obj) {
			try {
				obj = utility.object(obj);

				if (!obj instanceof Element)
					throw Error(label.error.invalidArguments);

				return obj.style.display === "none" || (typeof obj.hidden === "boolean" && obj.hidden);
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Finds the position of an element
		 *
		 * @method position
		 * @param  {Mixed} obj Element or $ query
		 * @return {Object} Object {left: n, top: n}
		 */
		position : function (obj) {
			try {
				obj = utility.object(obj);

				if (!obj instanceof Element)
					throw Error(label.error.invalidArguments);

				var left, top, height, width;

				left   = top = 0;
				width  = obj.offsetWidth;
				height = obj.offsetHeight;

				if (obj.offsetParent) {
					top    = obj.offsetTop;
					left   = obj.offsetLeft;

					while (obj = obj.offsetParent) {
						left += obj.offsetLeft;
						top  += obj.offsetTop;
					}
				}

				return {
					top    : top,
					right  : document.documentElement.clientWidth  - (left + width),
					bottom : document.documentElement.clientHeight + window.scrollY - (top + height),
					left   : left
				};
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Prepends an Element to an Element
		 * 
		 * @param  {Object} obj   Target Element
		 * @param  {Object} child Child Element
		 * @return {Object} Target Element
		 */
		prependChild : function (obj, child) {
			try {
				obj = utility.object(obj);

				if (!obj instanceof Element || !child instanceof Element)
					throw Error(label.error.invalidArguments);
				
				return obj.childNodes.length === 0 ? obj.appendChild(child) : obj.insertBefore(child, obj.childNodes[0]);
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Shows an Element if it's not visible
		 *
		 * Events: beforeEnable  Fires before the object is visible
		 *         afterEnable   Fires after the object is visible
		 *
		 * @method show
		 * @param  {Mixed} obj Element or Array of Elements or $ queries
		 * @return {Mixed} Element, Array of Elements or undefined
		 */
		show : function (obj) {
			try {
				if (obj instanceof Array) return obj.each(function (i) { el.show(i); });

				obj = utility.object(obj);

				if (!obj instanceof Element)
					throw Error(label.error.invalidArguments);

				obj.fire("beforeShow");
				switch (true) {
					case typeof obj.hidden === "boolean":
						obj.hidden = false;
						break;
					default:
						obj.style.display = typeof obj["data-display"] !== "undefined" && !obj["data-display"].isEmpty() ? obj["data-display"] : "inherit";
				}
				obj.fire("afterShow");
				return obj;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Returns the size of the Object
		 *
		 * @method size
		 * @param obj {Mixed} Instance, Array of Instances of $() friendly ID
		 * @return {Object} Size {x:, y:}, Array of sizes or undefined
		 */
		size : function (obj) {
			try {
				if (obj instanceof Array) {
					var result = [];
					obj.each(function (i) { result.push(el.size(i)); });
					return result;
				}

				obj = utility.object(obj);

				if (!obj instanceof Element)
					throw Error(label.error.invalidArguments);

				/**
				 * Casts n to a number or returns zero
				 *
				 * @param  {Mixed} n The value to cast
				 * @return {Integer} The casted value or zero
				 */
				var num = function (n) {
					return !isNaN(parseInt(n)) ? parseInt(n) : 0;
				};

				var x = obj.offsetHeight + num(obj.style.paddingTop)  + num(obj.style.paddingBottom) + num(obj.style.borderTop)  + num(obj.style.borderBottom),
					y = obj.offsetWidth  + num(obj.style.paddingLeft) + num(obj.style.paddingRight)  + num(obj.style.borderLeft) + num(obj.style.borderRight);

				return {x:x, y:y};
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Updates an Element
		 *
		 * Events: beforeUpdate  Fires before the update starts
		 *         afterUpdate   Fires after the update ends
		 *
		 * @method update
		 * @param  {Mixed}  obj  Element or Array of Elements or $ queries
		 * @param  {Object} args Collection of properties
		 * @return {Mixed} Element, Array of Elements or undefined
		 */
		update : function (obj, args) {
			try {
				obj  = utility.object(obj);
				args = args || {};

				if (obj instanceof Array) return obj.each(function (i) { el.update(i, args); });

				if (!obj instanceof Element)
					throw Error(label.error.invalidArguments);

				obj.fire("beforeUpdate");

				var i;
				for (i in args) {
					if (!args.hasOwnProperty(i)) continue;
					switch(i) {
						case "innerHTML":
						case "type":
						case "src":
							obj[i] = args[i];
							break;
						case "class":
							!args[i].isEmpty() ? obj.addClass(args[i]) : obj.removeClass("*");
							break;
						case "id":
							var o = observer.listeners;
							if (typeof o[obj.id] !== "undefined") {
								o[args[i]] = utility.clone(o[obj.id]);
								delete o[obj.id];
							}
						default:
							obj.setAttribute(i, args[i]);
							break;
					}
				}

				obj.fire("afterUpdate");
				return obj;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		}
	};

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
		 * @return {Number} The absolute difference
		 */
		diff : function (arg) {
			try {
				if (typeof arg !== "number" || typeof this !== "number")
					throw Error(label.error.expectedNumber);

				return Math.abs(this - arg);
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Formats a Number to a delimited String
		 * 
		 * @param  {Number} arg       Number to format
		 * @param  {String} delimiter [Optional] String to delimit the Number with
		 * @param  {String} every     [Optional] Position to insert the delimiter, default is 3
		 * @return {String} Number represented as a comma delimited String
		 */
		format : function (arg, delimiter, every) {
			try {
				if (typeof arg !== "number")
					throw Error(label.error.expectedNumber);

				arg       = arg.toString();
				delimiter = delimiter || ",";
				every     = every || 3;

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
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Tests if an number is even
		 *
		 * @method even
		 * @param {Number} arg Number to test
		 * @return {Boolean} True if even, or undefined
		 */
		even : function (arg) {
			return arg % 2 === 0;
		},

		/**
		 * Tests if a number is odd
		 *
		 * @method odd
		 * @param {Number} arg Number to test
		 * @return {Boolean} True if odd, or undefined
		 */
		odd : function (arg) {
			return !(arg % 2 === 0);
		}
	};

	/**
	 * JSON methods
	 *
	 * @class json
	 * @namespace abaaso
	 */
	var json = {
		/**
		 * Decodes the argument
		 *
		 * @method decode
		 * @param  {String} arg String to parse
		 * @param  {Boolean} silent [Optional] Silently fail
		 * @return {Mixed} Entity resulting from parsing JSON, or undefined
		 */
		decode : function (arg, silent) {
			try {
				return JSON.parse(arg);
			}
			catch (e) {
				if (silent !== true) error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Encodes the argument as JSON
		 *
		 * @method encode
		 * @param  {Mixed}   arg    Entity to encode
		 * @param  {Boolean} silent [Optional] Silently fail
		 * @return {String} JSON, or undefined
		 */
		encode : function (arg, silent) {
			try {
				return JSON.stringify(arg);
			}
			catch (e) {
				if (silent !== true) error(e, arguments, this);
				return undefined;
			}
		}
	};

	/**
	 * Labels for localization
	 *
	 * Override this with another language pack
	 *
	 * @class label
	 * @namespace abaaso
	 */
	var label = {
		// Common labels
		common : {
			back    : "Back",
			cancel  : "Cancel",
			clear   : "Clear",
			close   : "Close",
			cont    : "Continue",
			del     : "Delete",
			edit    : "Edit",
			find    : "Find",
			gen     : "Generate",
			go      : "Go",
			loading : "Loading",
			next    : "Next",
			login   : "Login",
			ran     : "Random",
			reset   : "Reset",
			save    : "Save",
			search  : "Search",
			submit  : "Submit"
		},

		// Error messages
		error : {
			databaseNotOpen       : "Failed to open the Database, possibly exceeded Domain quota",
			databaseNotSupported  : "Client does not support local database storage",
			databaseWarnInjection : "Possible SQL injection in database transaction, use the &#63; placeholder",
			elementNotCreated     : "Could not create the Element",
			elementNotFound       : "Could not find the Element",
			expectedArray         : "Expected an Array",
			expectedArrayObject   : "Expected an Array or Object",
			expectedBoolean       : "Expected a Boolean value",
			expectedNumber        : "Expected a Number",
			expectedObject        : "Expected an Object",
			invalidArguments      : "One or more arguments is invalid",
			invalidDate           : "Invalid Date",
			invalidFields         : "The following required fields are invalid: ",
			propertyNotFound      : "Could not find the requested property",
			serverError           : "Server error has occurred",
			serverForbidden       : "Forbidden to access URI",
			serverInvalidMethod   : "Method not allowed",
			serverUnauthorized    : "Authorization required to access URI"
		},

		// Months of the Year
		month : {
			0  : "January",
			1  : "February",
			2  : "March",
			3  : "April",
			4  : "May",
			5  : "June",
			6  : "July",
			7  : "August",
			8  : "September",
			9  : "October",
			10 : "November",
			11 : "December"
		}
	};

	/**
	 * Messaging between iframes
	 *
	 * @class abaaso
	 */
	var message = {
		/**
		 * Clears the message listener
		 *
		 * @method clear
		 * @return {Object} abaaso
		 */
		clear : function () {
			return $.un(window, "message");
		},

		/**
		 * Posts a message to the target
		 *
		 * @method send
		 * @param  {Object} target Object to receive message
		 * @param  {Mixed}  arg    Entity to send as message
		 * @return {Object} target
		 */
		send : function (target, arg) {
			try {
				target.postMessage(arg, "*");
				return target;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Sets a handler for recieving a message
		 *
		 * @method recv
		 * @param  {Function} fn  Callback function
		 * @return {Object} abaaso
		 */
		recv : function (fn) {
			return $.on(window, "message", fn);
		}
	};

	/**
	 * Mouse tracking
	 *
	 * @class mouse
	 * @namespace abaaso
	 */
	var mouse = {
		//Indicates whether mouse tracking is enabled
		enabled : false,

		// Indicates whether to try logging co-ordinates to the console
		log : false,

		// Mouse coordinates
		diff : {x: null, y: null},
		pos  : {x: null, y: null},
		prev : {x: null, y: null},

		/**
		 * Enables or disables mouse co-ordinate tracking
		 *
		 * @method track
		 * @param  {Mixed} n Boolean to enable/disable tracking, or Mouse Event
		 * @return {Object} abaaso.mouse
		 */
		track : function (e) {
			var m = abaaso.mouse;
			switch (true) {
				case typeof e === "object":
					var x = e.pageX ? e.pageX : ((client.ie && client.version < 9 ? document.documentElement.scrollLeft : document.body.scrollLeft) + n.clientX),
					    y = e.pageY ? e.pageY : ((client.ie && client.version < 9 ? document.documentElement.scrollTop  : document.body.scrollTop)  + n.clientY),
					    c = false;

					if (m.pos.x !== x) c = true;
					$.mouse.prev.x = m.prev.x = Number(m.pos.x);
					$.mouse.pos.x  = m.pos.x  = x;
					$.mouse.diff.x = m.diff.x = m.pos.x - m.prev.x;

					if (m.pos.y !== y) c = true;
					$.mouse.prev.y = m.prev.y = Number(m.pos.y);
					$.mouse.pos.y  = m.pos.y  = y;
					$.mouse.diff.y = m.diff.y = m.pos.y - m.prev.y;

					if (c && m.log) utility.log(m.pos.x + " [" + m.diff.x + "], " + m.pos.y + " [" + m.diff.y + "]");
					break;
				case typeof e === "boolean":
					e ? observer.add(document, "mousemove", abaaso.mouse.track) : observer.remove(document, "mousemove");
					$.mouse.enabled = m.enabled = e;
					break;
			}
			return m;
		}
	};

	/**
	 * Global Observer wired to a State Machine
	 *
	 * @class observer
	 */
	var observer = {
		// Collection of listeners
		listeners : {},

		// Boolean indicating if events are logged to the console
		log : false,

		/**
		 * Adds a handler to an event
		 *
		 * @method add
		 * @param  {Mixed}    obj   Entity or Array of Entities or $ queries
		 * @param  {String}   event Event being fired
		 * @param  {Function} fn    Event handler
		 * @param  {String}   id    [Optional / Recommended] The id for the listener
		 * @param  {String}   scope [Optional / Recommended] The id of the object or element to be set as 'this'
		 * @param  {String}   state [Optional] The state the listener is for
		 * @return {Mixed} Entity, Array of Entities or undefined
		 */
		add : function (obj, event, fn, id, scope, state) {
			try {
				obj   = utility.object(obj);
				scope = scope || abaaso;
				state = state || "active";

				if (obj instanceof Array) return obj.each(function (i) { observer.add(i, event, fn, id, scope, state); });

				if (typeof id === "undefined" || !/\w/.test(id)) id = utility.guid(true);

				var instance = null,
				    l = observer.listeners,
				    o = this.id(obj),
				    efn, item;

				if (typeof o === "undefined" || typeof event === "undefined" || typeof fn !== "function")
					throw Error(label.error.invalidArguments);

				switch (true) {
					case typeof l[o] === "undefined":
						l[o] = {};
					case typeof l[o][event] === "undefined":
						l[o][event] = {};
					case typeof l[o][event].active === "undefined":
						l[o][event].active = {};
					case typeof l[o][event][state] === "undefined":
						l[o][event][state] = {};
				}

				item = {fn: fn, scope: scope};
				l[o][event][state][id] = item;

				if (state === "active")	{
					switch (true) {
						case (/body|document|window/i.test(o)):
							instance = obj;
							break;
						default:
							instance = !/\//g.test(o) && o !== "abaaso" ? $("#"+o) : null;
					}
					efn = function (e) {
						if (event.indexOf("key") !== 0) {
							if (!e) e = window.event;
							if (typeof e.cancelBubble !== "undefined") e.cancelBubble = true;
							if (typeof e.preventDefault === "function") e.preventDefault();
							if (typeof e.stopPropagation === "function") e.stopPropagation();
						}
						typeof instance.fire === "function" ? instance.fire(event, e) : observer.fire(obj, event, e);
					};
					if (instance !== null && event.toLowerCase() !== "afterjsonp" && typeof instance !== "undefined")
						typeof instance.addEventListener === "function" ? instance.addEventListener(event, efn, false) : instance.attachEvent("on" + event, efn);
				}

				return obj;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Gets the Observer id of arg
		 *
		 * @method id
		 * @param  {Mixed} Object or String
		 * @return {String} Observer id
		 * @private
		 */
		id : function (arg) {
			var x;
			switch (true) {
				case arg === abaaso:
					x = "abaaso";
					break;
				case arg === document:
					x = "document";
					break;
				case arg === document.body:
					x = "body";
					break;
				case arg === window:
					x = "window";
					break;
				default:
					x = typeof arg.id !== "undefined" ? arg.id : (typeof arg.toString === "function" ? arg.toString() : arg);
			}
			return x;
		},

		/**
		 * Fires an event
		 *
		 * @method fire
		 * @param  {Mixed}  obj   Entity or Array of Entities or $ queries
		 * @param  {String} event Event being fired
		 * @param  {Mixed}  arg   [Optional] Argument supplied to the listener
		 * @return {Mixed} Entity, Array of Entities or undefined
		 */
		fire : function (obj, event, arg) {
			try {
				obj = utility.object(obj);

				if (obj instanceof Array) return obj.each(function (i) { observer.fire(obj[i], event, arg); });

				var o = this.id(obj), c, i, l;

				if (typeof o === "undefined" || String(o).isEmpty() || typeof obj === "undefined" || typeof event === "undefined")
						throw Error(label.error.invalidArguments);

				if ($.observer.log || abaaso.observer.log) utility.log("[" + new Date().toLocaleTimeString() + " - " + o + "] " + event);
				l = this.list(obj, event).active;
				for (i in l) { l[i].fn.call(l[i].scope, arg); }
				$.observer.fired++;
				return obj;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Gets the listeners for an event
		 *
		 * @method list
		 * @param  {Mixed}  obj   Entity or Array of Entities or $ queries
		 * @param  {String} event Event being queried
		 * @return {Array} Array of listeners for the event
		 */
		list : function (obj, event) {
			obj   = utility.object(obj);
			var l = this.listeners,
			    o = this.id(obj),
			    r;

			switch (true) {
				case typeof l[o] === "undefined" && typeof event === "undefined":
					r = {};
					break;
				case typeof l[o] !== "undefined" && (typeof event === "undefined" || String(event).isEmpty()):
					r = l[o];
					break;
				case typeof l[o] !== "undefined" && typeof l[o][event] !== "undefined":
					r = l[o][event];
					break;
				default:
					r = {active: {}};
			}
			return r;
		},

		/**
		 * Removes an event listener, or Array of event listeners
		 *
		 * @method remove
		 * @param  {Mixed}  obj   Entity or Array of Entities or $ queries
		 * @param  {String} event Event being fired
		 * @param  {String} id    [Optional] Listener id
		 * @param  {String} state [Optional] The state the listener is for
		 * @return {Mixed}  Entity, Array of Entities or undefined
		 */
		remove : function (obj, event, id, state) {
			obj   = utility.object(obj);
			state = state || "active";

			if (obj instanceof Array) return obj.each(function (i) { observer.remove(i, event, id, state); });

			var instance = null,
			    l = observer.listeners,
			    o = this.id(obj),
			    fn, efn;

			switch (true) {
				case typeof o === "undefined":
				case typeof event === "undefined":
				case typeof l[o] === "undefined":
				case typeof l[o][event] === "undefined":
					return obj;
			}

			typeof id === "undefined" ? l[o][event][state] = {} : delete l[o][event][state][id];

			if (state === "active") {
				switch (true) {
					case (/body|document|window/i.test(o)):
						instance = obj;
						break;
					default:
						instance = !/\//g.test(o) && o !== "abaaso" ? $("#"+o) : null;
				}

				efn = function (e) {
					if (event.indexOf("key") !== 0) {
						if (!e) e = window.event;
						if (typeof e.cancelBubble !== "undefined") e.cancelBubble = true;
						if (typeof e.preventDefault === "function") e.preventDefault();
						if (typeof e.stopPropagation === "function") e.stopPropagation();
					}
					typeof instance.fire === "function" ? instance.fire(event) : observer.fire(obj, event, e);
				};

				if (instance !== null && event.toLowerCase() !== "afterjsonp" && typeof instance !== "undefined")
					typeof instance.removeEventListener === "function" ? instance.removeEventListener(event, efn, false) : instance.detachEvent("on" + event, efn);
			}

			return obj;
		},

		/**
		 * Triggers an Observer state change
		 *
		 * @method state
		 * @param  {String} arg Application state
		 * @return {Object} abaaso
		 */
		state : function (arg) {
			var l = this.listeners,
			    p = $.state.previous,
			    i, e;

			for (i in l) {
				if (!l.hasOwnProperty(i)) continue;
				for (e in l[i]) {
					if (!l[i].hasOwnProperty(e)) continue;
					l[i][e][p]     = l[i][e].active;
					l[i][e].active = l[i][e][arg] || {};
					if (typeof l[i][e][arg] !== "undefined") delete l[i][e][arg];
				}
			}
			$.fire(arg);
			return abaaso;
		}
	};

	/**
	 * Utility methods
	 *
	 * @class utility
	 * @namespace abaaso
	 */
	var utility = {
		/**
		 * Queries the DOM using CSS selectors and returns an Element or Array of Elements
		 * 
		 * Accepts comma delimited queries
		 *
		 * @method $
		 * @param  {String}  arg      Comma delimited string of target #id, .class, tag or selector
		 * @param  {Boolean} nodelist [Optional] True will return a NodeList (by reference) for tags & classes
		 * @return {Mixed} Element or Array of Elements
		 */
		$ : function (arg, nodelist) {
			arg      = arg.trim();
			nodelist = (nodelist === true);

			// Recursive processing, ends up below
			if (arg.indexOf(",") > -1) arg = arg.explode();
			if (arg instanceof Array) {
				var result = [];
				arg.each(function (i) { result.push($(i, nodelist)); });
				return result;
			}

			// Getting Element(s)
			var obj, sel;

			switch (true) {
				case (/\s|>/.test(arg)):
					sel = arg.split(" ").filter(function (i) { if (i.trim() !== "" && i !== ">") return true; }).last();
					obj = document[sel.indexOf("#") > -1 && sel.indexOf(":") === -1 ? "querySelector" : "querySelectorAll"](arg);
					break;
				case arg.indexOf("#") === 0 && arg.indexOf(":") === -1:
					obj = isNaN(arg.charAt(1)) ? document.querySelector(arg) : document.getElementById(arg.substring(1));
					break;
				case arg.indexOf("#") > -1 && arg.indexOf(":") === -1:
					obj = document.querySelector(arg);
					break;
				default:
					obj = document.querySelectorAll(arg);
			}

			// Transforming obj if required
			if (obj !== null && !(obj instanceof Element) && !nodelist) obj = array.cast(obj);
			if (obj === null) obj = undefined;

			return obj;
		},

		/**
		 * Aliases origin onto obj
		 *
		 * @method alias
		 * @param  {Object} obj    Object receiving aliasing
		 * @param  {Object} origin Object providing structure to obj
		 * @return {Object} Object receiving aliasing
		 */
		alias : function (obj, origin) {
			var i;
			for (i in origin) {
				(function () {
					var b = i, getter, setter;
					if (origin.hasOwnProperty(b)) {
						switch (true) {
							case typeof origin[b] === "function" && (!(client.ios) || !(origin[b] instanceof RegExp)):
								obj[b] = origin[b].bind(obj[b]);
								break;
							case !(origin[b] instanceof Array) && origin[b] instanceof Object && !(origin[b] instanceof RegExp):
								if (typeof obj[b] === "undefined") obj[b] = {};
								utility.alias(obj[b], origin[b]);
								break;
							default:
								getter = function () { return origin[b]; },
								setter = function (arg) { origin[b] = arg; };

								switch (true) {
									case (!client.ie || client.version > 8) && typeof Object.defineProperty === "function":
										Object.defineProperty(obj, b, {get: getter, set: setter});
										break;
									case typeof obj.__defineGetter__ === "function":
										obj.__defineGetter__(b, getter);
										obj.__defineSetter__(b, setter);
										break;
									default:
										obj[b] = origin[b];
								}
						}
					}
				})();
			}
			return obj;
		},

		/**
		 * Clones an Object
		 *
		 * @method clone
		 * @param {Object}  obj     Object to clone
		 * @return {Object} Clone of obj
		 */
		clone : function (obj) {
			var clone;

			switch (true) {
				case typeof obj === "boolean":
					clone = Boolean(obj);
					break;
				case typeof obj === "function":
					clone = obj;
					break;
				case typeof obj === "number":
					clone = Number(obj);
					break;
				case typeof obj === "string":
					clone = String(obj);
					break;
				case obj instanceof Document:
					clone = xml.decode(xml.encode(obj));
					break;
				case obj instanceof Array:
					clone = [].concat(obj);
					break;
				case obj instanceof Object:
					clone = json.decode(json.encode(obj));
					if (typeof clone === "undefined") clone = obj;
					break;
				default:
					clone = obj;
			}

			if (obj.hasOwnProperty("constructor")) clone.constructor = obj.constructor;
			if (obj.hasOwnProperty("prototype"))   clone.prototype   = obj.prototype;
			return clone;
		},

		/**
		 * Allows deep setting of properties without knowing
		 * if the structure is valid
		 *
		 * @method define
		 * @param  {String} args  Dot delimited string of the structure
		 * @param  {Mixed}  value Value to set
		 * @param  {Object} obj   Object receiving value
		 * @return {Object} Object receiving value
		 */
		define : function (args, value, obj) {
			args  = args.split(".");
			obj   = obj || this;
			value = value || null;
			if (typeof obj === "undefined" || obj === $) obj = abaaso;

			var p = obj,
			    n = args.length;

			args.each(function (i) {
				var idx = args.index(i),
				    nth = n,
				    num = idx + 1 < nth && !isNaN(parseInt(args[idx + 1])),
				    val = value;

				if (!isNaN(parseInt(i))) i = parseInt(i);
				
				// Creating or casting
				switch (true) {
					case typeof p[i] === "undefined":
						p[i] = num ? [] : {};
						break;
					case p[i] instanceof Object && num:
						p[i] = array.cast(p[i]);
						break;
					case p[i] instanceof Array && !num:
						p[i] = p[i].toObject();
						break;
					default:
						p[i] = {};
				}

				// Setting reference or value
				switch (true) {
					case idx + 1 === nth:
						p[i] = val;
						break;
					default:
						p = p[i];
				}
			});

			return obj;
		},

		/**
		 * Defers the execution of Function by at least the supplied milliseconds
		 * Timing may vary under "heavy load" relative to the CPU & client JavaScript engine
		 *
		 * @method defer
		 * @param  {Function} fn Function to defer execution of
		 * @param  {Integer}  ms Milliseconds to defer execution
		 * @return {Object} undefined
		 */
		defer : function (fn, ms) {
			var id = utility.guid(true),
			    op = function () {
					delete abaaso.timer[id];
					fn();
				};
			abaaso.timer[id] = setTimeout(op, ms);
			return undefined;
		},

		/**
		 * Encodes a GUID to a DOM friendly ID
		 *
		 * @method domId
		 * @param  {String} GUID
		 * @return {String} DOM friendly ID
		 * @private
		 */
		domId : function (arg) {
			return "a" + arg.replace(/-/g, "").slice(1);
		},

		/**
		 * Error handling, with history in .log
		 *
		 * @method error
		 * @param  {Mixed}   e        Error object or message to display
		 * @param  {Array}   args     Array of arguments from the callstack
		 * @param  {Mixed}   scope    Entity that was "this"
		 * @param  {Boolean} warning  [Optional] Will display as console warning if true
		 * @return {Object} undefined
		 */
		error : function (e, args, scope, warning) {
			if (typeof e === "undefined")
				return;
			
			warning = (warning === true);
			var o = {
				arguments : args,
				message   : typeof e.message !== "undefined" ? e.message : e,
				number    : typeof e.number !== "undefined" ? (e.number & 0xFFFF) : undefined,
				scope     : scope,
				timestamp : new Date().toUTCString(),
				type      : typeof e.type !== "undefined" ? e.type : "TypeError"
			};

			if (typeof console !== "undefined") console[!warning ? "error" : "warn"](o.message);
			$.error.log.push(o);
			$.fire("error", o);
			return undefined;
		},

		/**
		 * Creates a class extending obj, with optional decoration
		 *
		 * @method extend
		 * @param  {Object} obj Object to extend
		 * @param  {Object} arg [Optional] Object for decoration
		 * @return {Object} Decorated obj
		 */
		extend : function (obj, arg) {
			try {
				if (typeof obj === "undefined")
					throw Error(label.error.invalidArguments);

				if (typeof arg === "undefined") arg = {};

				var i, o, f = function () {};

				f.prototype = obj;
				o = new f();
				for (i in arg) { if (arg.hasOwnProperty(i)) o[i] = arg[i]; }
				return o;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Generates an ID value
		 *
		 * @method genId
		 * @param  {Mixed} obj [Optional] Object to receive id
		 * @return {Mixed} Object or id
		 */
		genId : function (obj) {
			switch (true) {
				case obj instanceof Array:
				case obj instanceof String:
				case typeof obj === "string":
				case typeof obj !== "undefined" && typeof obj.id !== "undefined" && /\w/.test(obj.id):
					return obj;
			}

			var id;

			do id = utility.domId(utility.guid(true));
			while (typeof $("#" + id) !== "undefined");

			if (typeof obj === "object") {
				obj.id = id;
				return obj;
			}
			else { return id; }
		},

		/**
		 * Generates a GUID
		 *
		 * @method guid
		 * @param {Boolean} safe [Optional] Strips - from GUID
		 * @return {String} GUID
		 */
		guid : function (safe) {
			safe  = (safe === true);
			var s = function () { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); },
			    o;

			o = (s() + s() + "-" + s() + "-4" + s().substr(0,3) + "-" + s() + "-" + s() + s() + s()).toLowerCase();
			if (safe) o = o.replace(/-/gi, "");
			return o;
		},

		/**
		 * Renders a loading icon in a target element,
		 * with a class of "loading"
		 *
		 * @method loading
		 * @param  {Mixed} obj Entity or Array of Entities or $ queries
		 * @return {Mixed} Entity, Array of Entities or undefined
		 */
		loading : function (obj) {
			try {
				if (obj instanceof Array) return obj.each(function (i) { utility.loading(i); });

				var l = $.loading;

				if (l.url === null)
					throw Error(label.error.elementNotFound);

				obj = utility.object(obj);

				if (typeof obj === "undefined")
					throw Error(label.error.invalidArguments);

				// Setting loading image
				if (typeof l.image === "undefined") {
					l.image     = new Image();
					l.image.src = l.url;
				}

				// Clearing target element
				obj.clear();

				// Creating loading image in target element
				obj.create("div", {"class": "loading"})
				   .create("img", {alt: label.common.loading, src: l.image.src});

				return obj;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Writes argument to the console
		 *
		 * @method log
		 * @param  {String} arg String to write to the console
		 * @return undefined;
		 * @private
		 */
		log : function (arg) {
			try {
				console.log(arg);
			}
			catch (e) {
				error(e, arguments, this);
			}
			return undefined;
		},

		
		/**
		 * Registers a module in the abaaso namespace
		 * 
		 * @method module
		 * @param  {String} arg Module name
		 * @param  {Object} obj Module structure
		 * @return {Object}
		 */
		module : function (arg, obj) {
			try {
				if (typeof $[arg] !== "undefined" || typeof abaaso[arg] !== "undefined" || !obj instanceof Object)
					throw Error(label.error.invalidArguments);
				
				abaaso[arg] = obj;
				$[arg] = {};
				return $.alias($[arg], abaaso[arg]);
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Returns argument, or instance based on #object.id value
		 *
		 * @method object
		 * @param  {Mixed} obj Entity or $ query
		 * @returns {Mixed} Entity
		 * @private
		 */
		object : function (obj) {
			return typeof obj === "object" ? obj : (obj.toString().charAt(0) === "#" ? $(obj) : obj);
		},

		/**
		 * Sets methods on a prototype object
		 *
		 * @method proto
		 * @param  {Object} obj Object receiving prototype extension
		 * @param  {String} type Identifier of obj, determines what Arrays to apply
		 * @return {Object} obj or undefined
		 * @private
		 */
		proto : function (obj, type) {
			// Collection of methods to add to prototypes
			var i,
			    methods = {
				array   : {addClass : function (arg) { return this.each(function (i) { i.addClass(arg); }); },
				           contains : function (arg) { return array.contains(this, arg); },
				           create   : function (type, args, position) { return this.each(function (i) { i.create(type, args, position); }); },
				           clone    : function () { return utility.clone(this); },
				           css      : function (key, value) { return this.each(function (i) { i.css(key, value); }); },
				           diff     : function (arg) { return array.diff(this, arg); },
				           disable  : function () { return this.each(function (i) { i.disable(); }); },
				           each     : function (arg) { this.forEach(arg); return this; },
				           enable   : function () { return this.each(function (i) { i.enable(); }); },
				           first    : function () { return array.first(this); },
				           hide     : function () { return this.each(function (i){ i.hide(); }); },
				           html     : function (arg) { return this.each(function (i){ i.html(arg); }); },
				           index    : function (arg) { return array.index(this, arg); },
				           indexed  : function () { return array.indexed(this); },
				           intersect: function (arg) { return array.intersect(this, arg); },
				           isAlphaNum: function () { var a = []; this.each(function (i) { a.push(i.isAlphaNum()); }); return a; },
				           isBoolean: function () { var a = []; this.each(function (i) { a.push(i.isBoolean()); }); return a; },
				           isDate   : function () { var a = []; this.each(function (i) { a.push(i.isDate()); }); return a; },
				           isDomain : function () { var a = []; this.each(function (i) { a.push(i.isDomain()); }); return a; },
				           isEmail  : function () { var a = []; this.each(function (i) { a.push(i.isEmail()); }); return a; },
				           isIP     : function () { var a = []; this.each(function (i) { a.push(i.isIP()); }); return a; },
				           isInt    : function () { var a = []; this.each(function (i) { a.push(i.isInt()); }); return a; },
				           isNumber : function () { var a = []; this.each(function (i) { a.push(i.isNumber()); }); return a; },
				           isPhone  : function () { var a = []; this.each(function (i) { a.push(i.isPhone()); }); return a; },
				           isString : function () { var a = []; this.each(function (i) { a.push(i.isAlphaNum()); }); return a; },
				           keys     : function () { return array.keys(this); },
				           last     : function (arg) { return array.last(this); },
				           loading  : function () { return this.each(function (i) { i.loading(); }); },
				           on       : function (event, listener, id, scope, state) { return this.each(function (i) { i.on(event, listener, id, typeof scope !== "undefined" ? scope : i, state); }); },
				           position : function () { var a = []; this.each(function (i) { a.push(i.position()); }); return a; },
				           remove   : function (arg) { return array.remove(this, arg); },
				           removeClass: function (arg) { return this.each(function (i) { i.removeClass(arg); }); },
				           show     : function () { return this.each(function (i){ i.show(); }); },
				           size     : function () { var a = []; this.each(function (i) { a.push(i.size()); }); return a; },
				           text     : function (arg) {
				           		return this.each(function (node) {
				           			if (typeof node !== "object") node = utility.object(node);
				           			if (typeof node.text === "function") node.text(arg);
				           		});
				           },
				           total    : function () { return array.total(this); },
				           toObject : function () { return array.toObject(this); },
				           un       : function (event, id, state) { return this.each(function (i) { i.un(event, id, state); }); },
				           update   : function (arg) { return this.each(function (i) { el.update(i, arg); }); },
				           validate : function () {
				           	var result = [];
				           		this.each(function (i) { if (typeof i.validate === "function") result.push(i.validate()); });
				           		return result;
					       }},
				element : {addClass : function (arg) {
				           		this.genId();
				           		return el.klass(this, arg, true);
				           },
				           append   : function (type, args) {
				           		this.genId();
				           		return el.create(type, args, this, "first");
				           },
				           create   : function (type, args, position) {
				           		this.genId();
				           		return el.create(type, args, this, position);
				           },
				           css       : function (key, value) {
				           		var i;
				           		this.genId();
				           		if (!client.chrome && (i = key.indexOf("-")) && i > -1) {
				           			key = key.replace("-", "");
				           			key = key.slice(0, i) + key.charAt(i).toUpperCase() + key.slice(i + 1, key.length);
				           		}
				           		this.style[key] = value;
				           		return this;
				           },
				           disable   : function () { return el.disable(this); },
				           enable    : function () { return el.enable(this); },
				           get       : function (uri, headers) {
				           		this.fire("beforeGet");
				           		var cached = cache.get(uri),
				           		    guid   = utility.guid(true),
				           		    self   = this;

				           		!cached ? uri.get(function (a) { self.text(a).fire("afterGet"); }, null, headers)
				           		        : this.text(cached.response).fire("afterGet");

				           		return this;
				           },
				           hide     : function () {
				           		this.genId();
				           		return el.hide(this);
				           },
				           html     : function (arg) {
				           		this.genId();
				           		return this.update({innerHTML: arg});
				           },
				           isAlphaNum: function () { return this.nodeName === "FORM" ? false : validate.test({alphanum: typeof this.value !== "undefined" ? this.value : this.innerText}).pass; },
				           isBoolean: function () { return this.nodeName === "FORM" ? false : validate.test({"boolean": typeof this.value !== "undefined" ? this.value : this.innerText}).pass; },
				           isDate   : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isDate()   : this.innerText.isDate(); },
				           isDomain : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isDomain() : this.innerText.isDomain(); },
				           isEmail  : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isEmail()  : this.innerText.isEmail(); },
				           isEmpty  : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isEmpty()  : this.innerText.isEmpty(); },
				           isIP     : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isIP()     : this.innerText.isIP(); },
				           isInt    : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isInt()    : this.innerText.isInt(); },
				           isNumber : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isNumber() : this.innerText.isNumber(); },
				           isPhone  : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isPhone()  : this.innerText.isPhone(); },
				           isString : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isString() : this.innerText.isString(); },
				           jsonp    : function (uri, property, callback) {
				           		var target = this,
				           		    arg    = property, fn;

				           		fn = function (response) {
				           			var self = target,
				           			    node = response,
				           			    prop = arg,
				           			    i, nth, result;

				           			try {
				           				if (typeof prop !== "undefined") {
				           					prop = prop.replace(/]|'|"/g, "").replace(/\./g, "[").split("[");
				           					prop.each(function (i) {
				           						node = node[!!isNaN(i) ? i : parseInt(i)];
				           						if (typeof node === "undefined") throw Error(label.error.propertyNotFound);
				           					});
				           					result = node;
				           				}
				           				else result = response;
				           			}
				           			catch (e) {
				           				result = label.error.serverError;
				           				error(e, arguments, this);
				           			}

				           			self.text(result);
				           		};
				           		client.jsonp(uri, fn, function () { target.text(label.error.serverError); }, callback);
				           		return this;
				           },
				           loading  : function () { return $.loading.create(this); },
				           on       : function (event, listener, id, scope, state) {
				           		this.genId();
				           		return $.on.call(this, event, listener, id, scope, state);
				           },
				           prepend  : function (type, args) {
				           		this.genId();
				           		return el.create(type, args, this, "first");
				           },
				           prependChild: function (child) {
				           		this.genId();
				           		return el.prependChild(this, child);
				           },
				           position : function () {
				           		this.genId();
				           		return el.position(this);
				           },
				           removeClass : function (arg) {
				           		this.genId();
				           		return el.klass(this, arg, false);
				           },
				           show     : function () {
				           		this.genId();
				           		return el.show(this);
				           },
				           size     : function () {
				           		this.genId();
				           		return el.size(this);
				           },
				           text     : function (arg) {
				           		var args = {};

				           		this.genId();
				           		if (typeof this.value !== "undefined") args.value = arg;
				           		args.innerHTML = arg;
				           		return this.update(args);
				           },
				           un       : function (event, id, state) {
				           		this.genId();
				           		return $.un.call(this, event, id, state);
				           },
				           update   : function (args) {
				           		this.genId();
				           		return el.update(this, args);
				           },
				           validate : function () { return this.nodeName === "FORM" ? validate.test(this).pass : typeof this.value !== "undefined" ? !this.value.isEmpty() : !this.innerText.isEmpty(); }},
				"function": {reflect: function () { return utility.reflect(this); }},
				number  : {diff     : function (arg) { return number.diff.call(this, arg); },
				           format   : function (delimiter, every) { return number.format(this, delimiter, every); },
				           isEven   : function () { return number.even(this); },
				           isOdd    : function () { return number.odd(this); },
				           on       : function (event, listener, id, scope, state) { return $.on.call(this, event, listener, id, scope, state); },
				           un       : function (event, id, state) { return $.un.call(this, event, id, state); }},
				shared  : {clear    : function () {
				           		this.genId();
				           		this instanceof String ? this.constructor = new String("") : el.clear(this);
				           		return this;
				           },
				           destroy  : function () { el.destroy(this); },
				           fire     : function (event, args) {
				           		this.genId();
				           		return $.fire.call(this, event, args);
				           },
				           genId    : function () { return utility.genId(this); },
				           listeners: function (event) {
				           		this.genId();
				           		return $.listeners.call(this, event);
				           }},
				string  : {allows   : function (arg) { return $.allows(this, arg); },
				           capitalize: function () { return this.charAt(0).toUpperCase() + this.slice(1); },
				           del      : function (success, failure) { return client.request(this, "DELETE", success, failure); },
				           explode  : function (arg) { if (typeof arg === "undefined" || arg.toString() === "") arg = ","; return this.split(new RegExp("\\s*" + arg + "\\s*")); },
				           get      : function (success, failure, headers) { return client.request(this, "GET", success, failure, headers); },
				           isAlphaNum: function () { return validate.test({alphanum: this}).pass; },
				           isBoolean: function () { return validate.test({"boolean": this}).pass; },
				           isDate   : function () { return validate.test({date: this}).pass; },
				           isDomain : function () { return validate.test({domain: this}).pass; },
				           isEmail  : function () { return validate.test({email: this}).pass; },
				           isEmpty  : function () { return !validate.test({notEmpty: this}).pass; },
				           isIP     : function () { return validate.test({ip: this}).pass; },
				           isInt    : function () { return validate.test({integer: this}).pass; },
				           isNumber : function () { return validate.test({number: this}).pass; },
				           isPhone  : function () { return validate.test({phone: this}).pass; },
				           isString : function () { return validate.test({string: this}).pass; },
				           jsonp    : function (success, failure, callback) { return client.jsonp(this, success, failure, callback); },
				           post     : function (success, failure, args) { return client.request(this, "POST", success, failure, args); },
				           put      : function (success, failure, args) { return client.request(this, "PUT", success, failure, args); },
				           on       : function (event, listener, id, scope, state) { return $.on.call(this, event, listener, id, scope, state); },
				           headers  : function (success, failure) { return client.request(this, "HEAD", success, failure); },
				           permissions: function () { return $.permissions(this); },
				           toCamelCase: function () {
				           		var s = this.toLowerCase().split(" "),
				           		    r = "",
				           		    i, nth;

				           		for (i = 0, nth = s.length; i < nth; i++) { r += i === 0 ? s[i] : String(s[i]).capitalize(); }
				           		return r.replace(/\W/g, "");
				           },
				           trim     : function () { return this.replace(/^\s+|\s+$/g, ""); },
				           un       : function (event, id, state) { return $.un.call(this, event, id, state); }}
			};

			// Applying the methods
			for (i in methods[type])  { obj.prototype[i] = methods[type][i];  }
			if (type !== "function") for (i in methods.shared) { obj.prototype[i] = methods.shared[i]; }
			return obj;
		},

		/**
		 * Returns an Object containing 1 or all key:value pairs from the querystring
		 *
		 * @method queryString
		 * @param  {String} arg [Optional] Key to find in the querystring
		 * @return {Object} Object of 1 or all key:value pairs in the querystring
		 */
		queryString : function (arg) {
			arg        = arg || ".*";
			var obj    = {},
			    result = window.location.search.isEmpty() ? null : window.location.search.replace("?", ""),
			    item;

			if (result !== null) {
				result = result.split("&");
				result.each(function (prop) {
					item = prop.split("=");

					switch (true) {
						case item[1].isNumber():
							item[1] = Number(item[1]);
							break;
						case item[1].isBoolean():
							item[1] = (item[1] === "true");
							break;
					}

					switch (true) {
						case typeof obj[item[0]] === "undefined":
							obj[item[0]] = item[1];
							break;
						case !(obj[item[0]] instanceof Array):
							obj[item[0]] = [obj[item[0]]];
						default:
							obj[item[0]].push(item[1]);
					}
				});
			}
			return obj;
		},

		/**
		 * Returns an Array of parameters of a function
		 * 
		 * @param  {Function} arg Function to reflect
		 * @return {Array} Array of parameters
		 */
		reflect : function (arg) {
			switch (true) {
				case typeof arg === "undefined":
					arg = this;
				case typeof arg === "undefined":
					arg = $;
			}
			arg = arg.toString().match(/function\s+\w*\s*\((.*?)\)/)[1];
			return arg !== "" ? arg.explode() : [];
		},

		/**
		 * Creates a recursive function
		 * 
		 * Return false from the function to halt recursion
		 * 
		 * @method repeat
		 * @param  {Function} fn      Function to execute repeatedly
		 * @param  {Number}   timeout Milliseconds to stagger the execution
		 * @param  {String}   id      [Optional] Timeout ID
		 * @return {String} Timeout ID
		 */
		repeat : function (fn, timeout, id) {
			id = id || utility.guid(true);
			var r = function (fn, timeout, id) {
				var r = this;
				if (fn() !== false) $.repeating[id] = setTimeout(function () { r.call(r, fn, timeout, id); }, timeout);
				else delete $.repeating[id];
			};
			r.call(r, fn, timeout, id);
			return id;
		},

		/**
		 * Transforms JSON to HTML and appends to Body or target Element
		 *
		 * @method create
		 * @param  {Object} data   JSON Object describing HTML
		 * @param  {Mixed}  target [Optional] Target Element or Element.id to receive the HTML
		 * @return {Object} Target Element
		 */
		tpl : function (arg, target) {
			try {
				switch (true) {
					case typeof arg !== "object":
					case !(/object|undefined/.test(typeof target)) && typeof (target = target.charAt(0) === "#" ? $(target) : $(target)[0]) === "undefined":
						throw Error(label.error.invalidArguments);
				}

				if (typeof target === "undefined") target = $("body")[0];

				var frag = document.createDocumentFragment(),
				    i;

				switch (true) {
					case arg instanceof Array:
						arg.each(function (i) { $.create(array.cast(i, true)[0], frag).text(array.cast(i)[0]); });
						break;
					default:
						for (i in arg) {
							switch (true) {
								case typeof arg[i] === "string":
									$.create(i, frag).text(arg[i]);
									break;
								case arg[i] instanceof Object:
									$.tpl(arg[i], $.create(i, frag));
									break;
							}
						}
				}

				target.appendChild(frag);
				return target;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		}
	};

	/**
	 * Validation methods and patterns
	 *
	 * @class validate
	 * @namespace abaaso
	 */
	var validate = {
		// Regular expression patterns to test against
		pattern : {
			alphanum : /^[a-zA-Z0-9]*$/,
			"boolean": /^(0|1|true|false)?$/,
			domain   : /^[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/,
			email    : /[a-zA-Z0-9.!#$%&'*+-/=?\^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*/,
			ip       : /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.) {3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/,
			integer  : /(^-?\d\d*$)/,
			notEmpty : /\w{1,}/,
			number   : /(^-?\d\d*\.\d*$)|(^-?\d\d*$)|(^-?\.\d\d*$)/,
			phone    : /^\([1-9]\d{2}\)\s?\d{3}\-\d{4}$/,
			string   : /\w/
		},

		/**
		 * Validates args based on the type or pattern specified
		 *
		 * @method test
		 * @param  {Object} args Object to test {(pattern[name] || /pattern/) : (value || #object.id)}
		 * @return {Object} Results
		 */
		test : function (args) {
			var exception = false,
			    invalid   = [],
			    value     = null;

			if (typeof args.nodeName !== "undefined" && args.nodeName === "FORM") {
				var i, p, v, c, o, x, t = {}, nth, result, invalid = [], tracked = {};

				if (args.id.isEmpty()) args.genId();
				c = $("#" + args.id + " > input").concat($("#" + args.id + " > select"));
				c.each(function (i) {
					v = null;
					p = validate.pattern[i.nodeName.toLowerCase()] ? validate.pattern[i.nodeName.toLowerCase()]
					                                               : ((!i.id.isEmpty() && validate.pattern[i.id.toLowerCase()]) ? validate.pattern[i.id.toLowerCase()]
					                                                                                                            : "notEmpty");
					switch (true) {
						case (/radio|checkbox/gi.test(i.type)):
							if (i.name in tracked) return;
							o   = $(i.name);
							nth = o.length;
							for (x = 0; x < nth; x++) {
								if (o[x].checked) {
									v = o[x].value;
									tracked[i.name] = true;
									continue;
								}
							}
							break;
						case (/select/gi.test(i.type)):
							v = i.options[i.selectedIndex].value;
							break;
						default:
							v = typeof i.value !== "undefined" ? i.value : i.innerText;
					}
					if (v === null) v = "";
					t[p] = v;
				});
				result = this.test(t);
				return result;
			}
			else {
				var i;
				for (i in args) {
					if (typeof i === "undefined" || typeof args[i] === "undefined") {
						invalid.push({test: i, value: args[i]});
						exception = true;
						continue;
					}
					value = args[i].charAt(0) === "#" ? (typeof $(args[i]) !== "undefined" ? (($(args[i]).value) ? $(args[i]).value
					                                                                                             : $(args[i]).innerHTML)
					                                                                       : "")
					                                  : args[i];
					switch (i) {
						case "date":
							if (isNaN(new Date(value).getYear())) {
								invalid.push({test: i, value: value});
								exception = true;
							}
							break;
						case "domain":
							if (!validate.pattern.domain.test(value.replace(/.*\/\//, ""))) {
								invalid.push({test: i, value: value});
								exception = true;
							}
							break;
						case "domainip":
							if (!validate.pattern.domain.test(value.replace(/.*\/\//, "")) || !validate.pattern.ip.test(value)) {
								invalid.push({test: i, value: value});
								exception = true;
							}
							break;
						default:
							var p = typeof validate.pattern[i] !== "undefined" ? validate.pattern[i] : i;
							if (!p.test(value)) {
								invalid.push({test: i, value: value});
								exception = true;
							}
					}
				}
				return {pass: !exception, invalid: invalid};
			}
		}
	};

	/**
	 * XML methods
	 *
	 * @class xml
	 * @namespace abaaso
	 */
	var xml = {
		/**
		 * Returns XML (Document) Object from a String
		 *
		 * @method decode
		 * @param  {String} arg XML String
		 * @return {Object} XML Object or undefined
		 */
		decode : function (arg) {
			try {
				if (typeof arg !== "string" || arg.isEmpty())
					throw Error(label.error.invalidArguments);

				var xml;

				if (client.ie) {
					xml = new ActiveXObject("Microsoft.XMLDOM");
					xml.async = "false";
					xml.loadXML(arg);
				}
				else { xml = new DOMParser().parseFromString(arg, "text/xml"); }
				return xml;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Returns XML String from an Object or Array
		 *
		 * @method encode
		 * @param  {Mixed} arg Object or Array to cast to XML String
		 * @return {String} XML String or undefined
		 */
		encode : function (arg, wrap) {
			try {
				if (typeof arg === "undefined")
					throw Error(label.error.invalidArguments);

				switch (true) {
					case arg !== null && typeof arg.xml !== "undefined":
						xml = arg.xml;
						break;
					case arg instanceof Document:
						xml = (new XMLSerializer()).serializeToString(arg);
						break;
					default:
						wrap = !(wrap === false);
						var xml  = wrap ? "<xml>" : "",
						    top  = arguments[2] === false ? false : true,
						    node, i;

						node = function (name, value) {
							var output = "<n>v</n>";
							if (/\&|\<|\>|\"|\'|\t|\r|\n|\@|\$/g.test(value)) output = output.replace(/v/, "<![CDATA[v]]>");
							return output.replace(/n/g, name).replace(/v/, value);
						}

						switch (true) {
							case typeof arg === "boolean":
							case typeof arg === "number":
							case typeof arg === "string":
								xml += node("item", arg);
								break
							case typeof arg === "object":
								for (i in arg) { xml += $.xml.encode(arg[i], (typeof arg[i] === "object"), false).replace(/item|xml/g, !isNaN(i) ? "item" : i); }
								break;
						}

						xml += wrap ? "</xml>" : "";
						if (top) xml = "<?xml version=\"1.0\" encoding=\"UTF8\"?>" + xml;
				}
				return xml;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		}
	};

	var error = utility.error;

	return {
		// Classes
		array           : array,
		callback        : {},
		client          : {
			// Properties
			android : client.android,
			blackberry : client.blackberry,
			css3    : false,
			chrome  : client.chrome,
			expire  : client.expire,
			firefox : client.firefox,
			ie      : client.ie,
			ios     : client.ios,
			linux   : client.linux,
			mobile  : client.mobile,
			opera   : client.opera,
			osx     : client.osx,
			playbook: client.playbook,
			safari  : client.safari,
			tablet  : client.tablet,
			size    : {x: 0, y: 0},
			version : 0,
			webos   : client.webos,
			windows : client.windows,

			// Methods
			del     : function (uri, success, failure) { return client.request(uri, "DELETE", success, failure); },
			get     : function (uri, success, failure, headers) { return client.request(uri, "GET", success, failure, headers); },
			headers : function (uri, success, failure) { return client.request(uri, "HEAD", success, failure); },
			post    : function (uri, success, failure, args) { return client.request(uri, "POST", success, failure, args); },
			put     : function (uri, success, failure, args) { return client.request(uri, "PUT", success, failure, args); },
			jsonp   : function (uri, success, failure, callback) { return client.jsonp(uri, success, failure, callback); },
			permission : client.permission
		},
		cookie          : cookie,
		data            : data,
		el              : el,
		json            : json,
		label           : label,
		loading         : {
			create  : utility.loading,
			url     : null
		},
		message         : message,
		mouse           : mouse,
		number          : number,
		observer        : {
			log     : observer.log,
			add     : observer.add,
			fire    : observer.fire,
			fired   : 0,
			list    : observer.list,
			remove  : observer.remove
		},
		state           : {
			_current    : null,
			header      : null,
			previous    : null
		},
		validate        : validate,
		xml             : xml,

		// Methods & Properties
		$               : utility.$,
		alias           : utility.alias,
		allows          : client.allows,
		append          : function (type, args, obj) {
			if (obj instanceof Element) obj.genId();
			return el.create(type, args, obj, "last");
		},
		bootstrap       : function () {
			if (typeof Array.prototype.filter === "undefined") {
				Array.prototype.filter = function (fn) {
					"use strict";
					if (this === void 0 || this === null || typeof fn !== "function")
						throw Error(label.error.invalidArguments);

					var i      = null,
						t      = Object(this),
						nth    = t.length >>> 0,
						result = [],
						prop   = arguments[1]
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
					"use strict";

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

			if (typeof Function.prototype.bind === "undefined") {
				Function.prototype.bind = function (arg) {
					"use strict";

					var fn    = this,
					    slice = Array.prototype.slice,
					    args  = slice.call(arguments, 1);
					
					return function () {
						return fn.apply(arg, args.concat(slice.call(arguments)));
					};
				};
			}

			// Describing the Client
			abaaso.client.size = client.size();
			client.version();
			client.css3();
			client.tablet();

			// Binding helper & namespace to $
			$ = abaaso.$.bind($);
			utility.alias($, abaaso);
			delete $.$;
			delete $.bootstrap;
			delete $.init;
			delete $.data;

			// Unbinding observer methods to maintain scope
			$.fire           = abaaso.fire;
			$.on             = abaaso.on;
			$.un             = abaaso.un;
			$.listeners      = abaaso.listeners;

			// Setting initial application state
			abaaso.state._current = abaaso.state.current = "initial";
			$.state._current      = $.state.current      = abaaso.state.current;

			switch (true) {
				case window["$"] === null:
					window["$"] = $;
					break;
				default:
					window["a$"] = $;
					abaaso.aliased = "a$";
			}

			switch (true) {
				case client.server:
					abaaso.init();
					break;
				case typeof document.addEventListener === "function":
					document.addEventListener("DOMContentLoaded", function () { abaaso.init(); }, false);
					break;
				default:
					abaaso.timer.init = setInterval(function () {
						if (/loaded|complete/.test(document.readyState)) {
							clearInterval(abaaso.timer.init);
							delete abaaso.timer.init;
							if (typeof abaaso.init === "function") abaaso.init();
						}
					}, 10);
			}
		},
		clear           : el.clear,
		clone           : utility.clone,
		create          : el.create,
		css             : el.css,
		decode          : json.decode,
		defer           : utility.defer,
		define          : utility.define,
		del             : function (uri, success, failure) { return client.request(uri, "DELETE", success, failure); },
		destroy         : el.destroy,
		encode          : json.encode,
		error           : utility.error,
		expire          : cache.clean,
		expires         : 120000,
		extend          : utility.extend,
		fire            : function (obj, event, arg) {
			var all = typeof arg !== "undefined",
			    o, e, a;

			o = all ? obj   : this;
			e = all ? event : obj;
			a = all ? arg   : event;

			if (typeof o === "undefined" || o === $) o = abaaso;
			return observer.fire.call(observer, o, e, a);
		},
		genId           : utility.genId,
 		get             : function (uri, success, failure, headers) { return client.request(uri, "GET", success, failure, headers); },
		guid            : utility.guid,
		headers         : function (uri, success, failure) { return client.request(uri, "HEAD", success, failure); },
		hidden          : el.hidden,
		id              : "abaaso",
		init            : function () {
			// Stopping multiple executions
			delete abaaso.init;
			delete abaaso.bootstrap;

			// Hooking abaaso into native Objects
			utility.proto(Array, "array");
			if (typeof Element !== "undefined") utility.proto(Element, "element");
			if (client.ie && client.version === 8) utility.proto(HTMLDocument, "element");
			utility.proto(Function, "function");
			utility.proto(Number, "number");
			utility.proto(String, "string");

			// Creating a singleton
			abaaso.constructor = abaaso;

			// Creating error log
			$.error.log = abaaso.error.log = [];

			// Setting events & garbage collection
			if (!client.server) {
				$.on(window, "hashchange", function () { $.fire("hash", location.hash); });
				$.on(window, "resize", function () { $.client.size = abaaso.client.size = client.size(); $.fire("resize", abaaso.client.size); });
			}

			// Setting up cache expiration
			var expiration = function () {
				var expiration = this;
				$.timer.expire = setTimeout(function () {
					cache.clean();
					expiration.call(expiration);
				}, $.expires);
			}
			expiration.call(expiration);

			// abaaso.state.current getter/setter
			var getter, setter;
			getter = function () { return this._current; };
			setter = function (arg) {
				try {
					if (arg === null || typeof arg !== "string" || this.current === arg || arg.isEmpty())
							throw Error(label.error.invalidArguments);

					abaaso.state.previous = abaaso.state._current;
					abaaso.state._current = arg;
					return observer.state(arg);
				}
				catch (e) {
					error(e, arguments, this);
					return undefined;
				}
			};

			switch (true) {
				case (!client.ie || client.version > 8) && typeof Object.defineProperty === "function":
					Object.defineProperty(abaaso.state, "current", {get: getter, set: setter});
					Object.defineProperty($.state, "current", {get: getter, set: setter});
					break;
				case typeof abaaso.state.__defineGetter__ === "function":
					abaaso.state.__defineGetter__("current", getter);
					abaaso.state.__defineSetter__("current", setter);
					$.state.__defineGetter__("current", getter);
					$.state.__defineSetter__("current", setter);
					break;
				default:
					// Pure hackery, only exists when needed
					abaaso.state.change = function (arg) { abaaso.state.current = arg; return setter.call(abaaso.state, arg); };
					$.state.change = function (arg) { abaaso.state.current = arg; return setter.call(abaaso.state, arg); };
			}

			$.fire("init").un("init");
			$.ready = true;
			$.fire("ready").un("ready");

			// Setting render event
			if (!client.server) {
				$.timer.render = setInterval(function () {
					if (/loaded|complete/.test(document.readyState)) {
						clearInterval($.timer.render);
						delete $.timer.render;
						$.fire("render").un("render");
					}
				}, 10);
			}
			else $.fire("render").un("render");

			return abaaso;
		},
		jsonp           : function (uri, success, failure, callback) { return client.jsonp(uri, success, failure, callback); },
		listeners       : function (event) {
			var obj = this;

			if (typeof obj === "undefined" || obj === $) obj = abaaso;
			return observer.list.call(observer, obj, event);
		},
		module          : utility.module,
		aliased         : "$",
		on              : function (obj, event, listener, id, scope, state) {
			var all = typeof listener === "function",
			    o, e, l, i, s, st;

			o  = all ? obj      : this;
			e  = all ? event    : obj;
			l  = all ? listener : event;
			i  = all ? id       : listener;
			s  = all ? scope    : id;
			st = all ? state    : scope;

			if (typeof o === "undefined" || o === $) o = abaaso;
			if (typeof s === "undefined") s = o;
			return observer.add.call(observer, o, e, l, i, s, st);
		},
		permissions     : client.permissions,
		position        : el.position,
		post            : function (uri, success, failure, args) { return client.request(uri, "POST", success, failure, args); },
		prepend         : function (type, args, obj) {
			if (obj instanceof Element) obj.genId();
			return el.create(type, args, obj, "first");
		},
		put             : function (uri, success, failure, args) { return client.request(uri, "PUT", success, failure, args); },
		queryString     : utility.queryString,
		ready           : false,
		reflect         : utility.reflect,
		repeat          : utility.repeat,
		repeating       : {},
		store           : function (arg, args) { return data.register.call(data, arg, args); },
		timer           : {},
		tpl             : utility.tpl,
		un              : function (obj, event, id, state) {
			var all = typeof id !== "undefined",
			    o, e, i, s;

			o = all ? obj   : this;
			e = all ? event : obj;
			i = all ? id    : event;
			s = all ? state : id;

			if (typeof o === "undefined" || o === $) o = abaaso;
			return observer.remove.call(observer, o, e, i, s);
		},
		update          : el.update,
		version         : "1.8.1"
	};
})();
if (typeof abaaso.bootstrap === "function") abaaso.bootstrap();
