/*
* Copyright (c) 2016 NAVOMI (https://github.com/navomij/open-crm-connect)
* All rights reserved.
*
* All code below are shown as pseudo-code, not an actual working code
* This also assumes that the user of libraries understands the basics of nodeJS
* from setup to implementation.
* 
*/
// Load Salesforce Library
var sfObj = require('./connectors/salesforce');

// Salesforce Instance and Access Token
var access_token = "xxxxxxxxxx";
var sfInstance = "https://na4.salesforce.com";

// Goes into your router files
router.get('/some-url-path', function(req, res, next) {
	var keyword = req.query.keyword;
	
	var sf_obj = new sfObj(res, access_token, sfInstance);
	// For authentication
	sf_obj.check_auth();
	// For searching the CRM on certain keywords
	sf_obj.search_crm(keyword);
});