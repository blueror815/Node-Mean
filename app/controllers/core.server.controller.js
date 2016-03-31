'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

exports.welcome = function(req, res) {
	res.render('welcome',{
		request: req
	});
};