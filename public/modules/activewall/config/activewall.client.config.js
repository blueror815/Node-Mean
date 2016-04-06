'use strict';

// Configuring the Articles module
angular.module('activewall').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('sidebar', 'Activewall', 'home', null, '/home', true, null, null, 'icon-home');
	}
]);