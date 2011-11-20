/**
 * abaaso API dashboard
 *
 * Creates a RESTful GUI with 1 application state
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @version 2.0
 */
var dashboard = (function(){
	// Wordpress
	var blog = {id: "blog"};

	// API widget
	var api = {
		id: "api",

		/**
		 * Collection of methods to add to prototypes
		 * Managed manually because these are hidden in closure
		 */
		prototypes : {
			array   : ["contains", "diff", "first", "index", "indexed", "keys", "last", "on", "remove", "total"],
			element : ["create", "disable", "enable", "get", "hide", "isAlphaNum", "isBoolean", "isDate", "isDomain", "isEmail", "isEmpty", "isIP", "isInt", "isNumber", "isPhone", "isString", "loading", "on", "position", "show", "text", "update", "validate"],
			number  : ["isEven", "isOdd", "on"],
			shared  : ["clear", "destroy", "fire", "genId", "listeners", "un"],
			string  : ["capitalize", "isAlphaNum", "isBoolean", "isDate", "isDomain", "isEmail", "isEmpty", "isIP", "isInt", "isNumber", "isPhone", "isString", "on", "trim"]
		},

		/**
		 * Iterates an object and executes generate() on the children,
		 * supports 3 levels deep
		 *
		 * @param s {object} The object to iterate
		 */
		elements : function(s) {
			try {
				var i, x, y;

				for (i in s) {
					if (!s.hasOwnProperty(i)) continue;
					this.generate(i, i, "apis");
					for (x in s[i]) {
						if (/bind|prototype/.test(x) || i === "$") continue;

						var id  = i+"-"+x,
							key = i+"."+x;

						if (typeof $("#"+i+"-sub") === "undefined" && typeof $("#"+i) !== "undefined") {
							$("#"+i).style.listStyleType = "square";
							$("#"+i).create("ul", {id: i+"-sub", "class": "sub"}).hide();
						}
						this.generate(x, key, i+"-sub", id);
						for (y in s[i][x]) {
							if (y === "prototype") continue;

							var id  = i+"-"+x+"-"+y,
								key = i+"."+x+"."+y;

							if (typeof $("#"+i+"-"+x+"-sub") === "undefined" && typeof $("#"+i+"-"+x) !== "undefined") {
								$("#"+i+"-"+x).style.listStyleType = "square";
								$("#"+i+"-"+x).create("ul", {id: i+"-"+x+"-sub", "class": "sub"}).hide();
							}
							this.generate(y, key, i+"-"+x+"-sub", id);
						}
					}
				}
			}
			catch (e) {
				$.error(e, arguments, this);
			}
		},

		/**
		 * Generates the HTML elements for the API widget
		 *
		 * @param item {object} The item to add to the tree
		 * @param key {string} The record key
		 * @param target {string} The target element to add the item to
		 */
		generate : function(item, key, target, id){
			if (typeof $("#"+target) === "undefined") return;
			id = id || item.replace(/(\&|,|(\s)|\/)/gi,"").toLowerCase();
			if (id === "$") id = "helper";

			$("#"+target).create("li", {id: id})
			             .create("a", {id: id+"-anchor", innerHTML: item, "class": "nav"})
						 .on("click", function(){
							var list   = $("#"+this.parentNode.id+"-sub"),
								record = dashboard.api.data.get(key),
								panel;

							if (typeof list !== "undefined") {
								switch ($.el.hidden(list)) {
									case true:
										this.parentNode.style.listStyleType = "circle";
										list.show();
										break;
									case false:
										this.parentNode.style.listStyleType = "square";
										list.hide();
										break;
								}
							}
							$("#stage").clear();
							panel = $("#stage").create("article");
							if (typeof record !== "undefined") {
								panel.create("h2").text(record.key);
								panel.create("h3").text(record.data.type);
								panel.create("p").text(record.data.description.replace(/\n/g, "<br />"));
								if (record.data.sample !== null) {
									panel.create("h4").text("Sample");
									panel.create("code").text(record.data.sample.replace(/\n/g, "<br />"));
								};
							}
							else { panel.create("h2").text("Could not find the requested record"); }
						});
		},

		/**
		 * Creates the API widget using abaaso
		 */
		render : function() {
			this.elements({prototypes: this.structure(this.prototypes)});
			this.elements(this.structure(abaaso));
		},

		/**
		 * Returns the abaaso library structure with API URIs as a property
		 *
		 * @returns {object}
		 */
		structure : function(s) {
			var structure, getChildren;

			/**
			 * Finds the children of o
			 *
			 * @param o {object} The object to iterate
			 * @returns {object}
			 */
			getChildren = function(o, x) {
				x = x || 1;
				var i, m = 3, c = {};

				// Max recusion is 3 levels
				if (x >= m) return;

				if (o instanceof Array) {
					o.each(function(i) {
						c[i] = typeof o[i] === "object" ? getChildren(o[i], (x + 1)) : {};
					});
				}
				else {
					for (i in o) {
						if (!o.hasOwnProperty(i)) continue;
						c[i] = o[i] instanceof Object ? getChildren(o[i], (x + 1)) : {};
					}
				}

				return c;
			};

			structure = getChildren(s);

			// Cleaning up the object
			if (s === abaaso) {
				structure.id              = {};
				structure.hidden          = {};
				structure.ready           = {};
				structure.version         = {};
				structure.data.uri        = {};
				structure.data.callback   = {};
				structure.data.key        = {};
				structure.data.keys       = {};
				structure.data.parentNode = {};
				structure.data.records    = {};
				structure.data.source     = {};
				structure.data.total      = {};
				structure.data.views      = {};
				structure.state.current   = {};
				delete structure.callback;
				delete structure.data.methods;
				delete structure.data._uri;
				delete structure.state._current;
				delete structure.dashboard;
				delete structure.error.log;
				delete structure.fx;
				delete structure.timer;
			}

			return structure;
		}
	};

	/**
	 * Loads the hash into the view
	 * 
	 * @param  {String} arg Route to load
	 * @return {Undefined} undefined
	 */
	var load = function(arg) {
		arg = arg.replace(/\#\!\//, "");
		if (!routes.hasOwnProperty(arg)) arg = "error";
		routes[arg]();
	};

	/**
	 * Routes
	 * 
	 * @type {Object}
	 */
	var routes = {
		api : function() {
			$("#api").removeClass("hide");
			$("#stage").addClass("share").get("views/api.htm");
		},
		blog     : function() {
			$("#api").addClass("hide");

			var stage = $("#stage"),
			    items = blog.data.get(),
			    c, d, o;

			stage.clear();

			items.each(function(item) {
				c = item.data.content.split(/\r/);
				d = new Date(item.data.date);
				o = stage.create("article");

				o.create("h3").text(item.data.title.replace("&#8217;", "'"));
				o.create("p").text($.label.months[d.getMonth()]+" "+d.getDate()+", "+d.getFullYear());

				c.each(function(p) { if (!p.isEmpty()) o.create("p").text(p.replace("&#8217;", "'")); });
			});

			stage.create("p").create("a", {innerHTML: "Read more on attack.io", href: "http://attack.io"});
		},
		download : function() {
			$("#api").addClass("hide");
			$("#stage").removeClass("share").get("views/download.htm");
		},
		error : function() {
			$("#api").addClass("hide");
			$("#stage").removeClass("share").get("views/error.htm");
		},
		main : function() {
			$("#api").addClass("hide");
			$("#stage").removeClass("share").get("views/intro.htm");
		}
	};

	/**
	 * Retrieves the latest tweet from @abaaso
	 */
	var twitter = function() {
		if (typeof dashboard.twitter.tweet === "undefined") {
			$("#twitter").loading();
			"http://search.twitter.com/search.json?callback=?&from=abaaso".jsonp(function(arg) {
				dashboard.twitter.tweet = arg.results[0].text || $.label.error.serverError;
				$("#twitter").text(dashboard.twitter.tweet);
			});
		}
		else $("#twitter").text(dashboard.twitter.tweet);
	};

	return {
		api     : api,
		blog    : blog,
		load    : load,
		twitter : twitter
	}
})();

// abaaso listeners
$.on("render", function() {
	$("body").css("opacity", 1);
	$("year").text(new Date().getFullYear());

	if (!/\w/.test(document.location.hash)) document.location.hash = "#!/main";
	else dashboard.load(document.location.hash);
});

$.on("ready", function() {
	$.on("hash", function(arg) { dashboard.load(arg); });

	this.loading.url = "assets/loading.gif";

	$("version")[0].text($.version);
	$("year")[0].text(new Date().getFullYear());

	$("#stage").on("beforeGet", function() { this.loading(); }, "loading")
	           .on("afterGet", function() { if (typeof $("#twitter") !== "undefined") dashboard.twitter(); }, "twitter");

	$.store(dashboard.blog);
	dashboard.blog.data.key      = "id";
	dashboard.blog.data.callback = "jsonp";
	typeof dashboard.blog.data.setUri === "function" ? dashboard.blog.data.setUri("http://attack.io/category/abaaso/?feed=json&jsonp=?") : dashboard.blog.data.uri = "http://attack.io/category/abaaso/?feed=json&jsonp=?";

	$.store(dashboard.api);
	dashboard.api.data.key = "name";
	dashboard.api.on("afterDataSync", function(){ this.render(); });
	typeof dashboard.api.data.setUri === "function" ? dashboard.api.data.setUri("http://api.abaaso.com?callback=") : dashboard.api.data.uri = "http://api.abaaso.com";
});
