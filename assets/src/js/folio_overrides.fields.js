(function($, Symphony) {
	"use strict";

	var initializeTagLists = function() {
		var fields, submit;

		var init = function() {
			fields = Symphony.Elements.contents.find(".field-taglist");
			fields.each(buildField);
		};

		var buildField = function(index, field) {
			console.log("[folio_overrides] initializeTagList > buildField");
			var hidden, display;

			// var $hidden, $display, $field;
			// $field = $(field);
			// $field.addClass("local-taglist");
			//
			// $hidden = $field.find("input[type=\"text\"]");
			// $hidden.attr("type", "hidden");
			// hidden = $hidden[0];

			// $display = $(display);
			// $display.attr("cols", 50);
			// $display.attr("rows", 5);
			// $display.appendTo($field.find("label"));
			// display = $display[0];

			field.className += " local-taglist";

			hidden = field.querySelector("input[type=\"text\"]");
			hidden.setAttribute("type", "hidden");

			display = document.createElement("textarea");
			display.cols = 50;
			display.rows = 5;
			hidden.parentElement.appendChild(display);

			$(hidden).on("change", function(ev) {
				ev.isDefaultPrevented() && ev.preventDefault();
				display.value = invert(hidden.value);
			});
			$(display).on("change", function(ev) {
				ev.isDefaultPrevented() && ev.preventDefault();
				hidden.value = invert(formatTags(display.value));
			});

			display.value = formatTags(invert(hidden.value));
		};
		var formatTags = function(s) {
			return s.replace(/ *\: */g, ":");
		};
		var invert = function(s) {
			return s.replace(/(\,|\;)/g, function(m) {
				return (m == ",") ? ";" : ",";
			});
		};

		init();
	};

	var initializeSelectBoxLinks = function() {
		var fields;

		var init = function() {
			fields = Symphony.Elements.contents.find(".field-selectbox_link");
			fields.each(buildField);
		};

		var buildField = function(index, field) {
			var $field, $hidden, hidden, $display, display;

			$field = $(field);
			$field.addClass("local-sbl");

			$hidden = $field.find("select:visible, input:visible");
			// hidden = $hidden.first();
			if ($hidden.length) {
				$hidden.selectize({
					sortField: [{
						field: "text",
						direction: "asc"
					}],
					hideSelected: true,
					plugins: {
						"remove_button": {
							label: "×",
							title: "Remove",
							className: "destructor"
						}
					},
					render: {
						item: renderItem,
						option: renderOption
					},
				});

				display = $hidden[0].selectize;
				display.$control_input.attr("placeholder", "Search and select …");
			}
		};

		var renderItem = function(data, escape) {
			return "<div class=\"item\" data-entry-id=\"" + data.id + "\"><span>" + data.text + "</span></div>";
		};

		var renderOption = function(data, escape) {
			return "<div class=\"option\"><span>" + data.text + "</span></div>";
		};

		init();
	};

	var initKeyboardShortcuts = function() {
		var saveEl, navEl, nextEl, prevEl;
		saveEl = document.querySelector('form input[name="action[save]"]');
		navEl = document.querySelector('.entry-nav');
		prevEl = document.querySelector('.entry-nav .button.entry-nav-prev');
		nextEl = document.querySelector('.entry-nav .button.entry-nav-next');
		// saveEl = Symphony.Elements.contents.find('> form').find('input, button').filter('[name="action[save]"]').first();
		document.addEventListener('keydown', function(event) {}, false);

		var keydownHandler = function(event) {
			var keyName = event.key;
			// debugHandler(event);
			if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
				[saveEl, navEl].forEach(function(el) {
					el.classList.add("keyfocused");
				});
				if (keyName === 's' && saveEl) {
					$(saveEl).click();
				} else if (keyName === 'ArrowLeft' && prevEl) {
					window.location.href = prevEl.href;
				} else if (keyName === 'ArrowRight' && nextEl) {
					window.location.href = nextEl.href;
				}
			}
		};
		var keyupHandler = function(event) {
			// debugHandler(event);
			if (!((event.ctrlKey || event.metaKey) && event.shiftKey)) {
				[saveEl, navEl].forEach(function(el) {
					el.classList.remove("keyfocused");
				});
			}
		};

		document.addEventListener('keydown', keydownHandler, false);
		document.addEventListener('keyup', keyupHandler, false);

		// DEBUG
		// var debugHandler = function(event) {
		// 	if (event.ctrlKey || event.metaKey || event.shiftKey) {
		// 		var keys = [],
		// 			keyName = event.key;
		// 		event.ctrlKey && keys.push("Ctrl");
		// 		event.metaKey && keys.push("Meta");
		// 		event.shiftKey && keys.push("Shift");
		// 		console.log("[%s] [%s]+[%s]", event.type, keys.join("+"), keyName);
		// 	}
		// };
		// console.log("[folio_overrides] initKeyboardShortcuts", saveEl, prevEl, nextEl);
		// document.addEventListener('keydown', debugHandler, false);
	};

	$(document).on("ready", function() {
		var isIOS = /iPad|iPhone/.test(window.navigator.userAgent);
		initializeTagLists();
		!isIOS && initializeSelectBoxLinks();
		initKeyboardShortcuts();
	});

})(window.jQuery, window.Symphony);