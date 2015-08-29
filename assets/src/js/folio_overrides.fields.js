(function($, Symphony) {
	"use strict";
	
	function initializeTagLists(){
		var fields, submit;
		
		var init = function() {
			fields = Symphony.Elements.contents.find(".field-taglist");
			fields.each(buildField);
			
			// submit = Symphony.Elements.contents.find(".actions input[type="submit"]");
			// submit.on("click", function() {
			// 	fields.each(function() {
			// 		console.log("SUBMIT");
			// 	});
			// });
		};
		var buildField = function() {
			var field, $hidden, hidden, $display, display;
			
			console.log("create textarea", arguments);
			
			field = $(this);
			field.addClass("local-taglist");
			
			$hidden = field.find("input[type=\"text\"]");
			$hidden.attr("type", "hidden");
			hidden = $hidden[0];
			
			display = document.createElement("textarea");
			display.setAttribute("cols", 50);
			display.setAttribute("rows", 5);
			$display = $(display);
			$display.appendTo($(this).find("label"));
			// display = $display[0];
			
			$hidden.on("change", function(ev) {
				ev.isDefaultPrevented() && ev.preventDefault();
				display.value = invert(hidden.value);
			});
			$display.on("change", function(ev) {
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
				return (m == ",")? ";":",";
			});
		};
		
		init();
	}
	
	function initializeSelectBoxLinks() {
		var fields;
		
		var init = function() {
			fields = Symphony.Elements.contents.find(".field-selectbox_link");
			fields.each(buildField);
		};
		
		var buildField = function() {
			var field, $hidden, hidden, $display, display;
			
			field = $(this);
			field.addClass("local-sbl");
			
			$hidden = field.find("select:visible, input:visible");
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
							label : "Remove",
							title : "Remove",
							className : "destructor"
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
	}

	$(document).on("ready", function() {
		initializeTagLists();
		initializeSelectBoxLinks();
	});

})(window.jQuery, window.Symphony);
