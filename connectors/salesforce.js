/*
* Copyright (c) 2016 NAVOMI (https://github.com/navomij/open-crm-connect)
* All rights reserved.
*/
var libHelper = require('./libHelper');

var instance = "";
var _res = null;
// URI Constants for the object
var account_set = "/services/data/v20.0/sobjects/Account/";
var search = "/services/data/v20.0/search";
var query = "/services/data/v20.0/query";
var contact_set = "/services/data/v20.0/sobjects/Contact/";
var lead_set = "/services/data/v20.0/sobjects/Lead/";

// JSON Response
var json_response = {
	error: false,
	error_msg: null,
	success: true,
	response: null,
	_data: null
};

// Private Functions
var check_auth_cb = function(result, response) {
	libHelper.standardResponse(_res, json_response, result, response, "Access Token still valid", "Access Token Not Valid");
};

var complete_search_cb = function(result, response) {
	if (response.statusCode == 200) {
		var _res_data = [];
		for (var i=0;i < result.length;i++) {
			var record = result[i];
			
			var record_type = record.attributes.type;
			var json_record = {
                "_type": record_type,
                "guid_uri": instance + record.attributes.url,
                "id": record['Id'],
                "name": record['Name'],
				"owner": null,
				"oid": record['OwnerId']
			};
			if (record_type.match(/account/gi)) {
                json_record['industry'] = record['Industry'];
                json_record['account_number'] = record['AccountNumber'];
                json_record['type'] = record['Type'];
                json_record['phone'] = record['Phone'];
			}
			else if (record_type.match(/contact/gi)) {
                json_record['title'] = record['Title'];
                json_record['email'] = record['Email'];
                json_record['phone'] = record['Phone'];
                json_record['source'] = record['LeadSource'];
			}
			else if (record_type.match(/opportunity/gi)) {
                json_record['stage_name'] = record['StageName'];
                json_record['type'] = record['Type'];
                json_record['source'] = record['LeadSource'];
			}
			else if (record_type.match(/lead/gi)) {
                json_record['company'] = record['Company'];
                json_record['title'] = record['Title'];
                json_record['email'] = record['Email'];
                json_record['phone'] = record['Phone'];
                json_record['source'] = record['LeadSource'];
                json_record['status'] = record['Status'];
			}
			
			_res_data.push(json_record);
		}
		
		libHelper.setSuccess(_res, json_response, "Completed Search", _res_data);
	}
	else {
		libHelper.setError(_res, json_response, "Search failed", result);
	}
};

// Public
module.exports = Salesforce;

function Salesforce(_response, _access_token, _instance) {
	this.req_headers = {};
	// Private var
	instance = _instance;
	_res = _response;
	
	if (_access_token !== null && _access_token !== undefined) {
		this.req_headers = { 
			'Accept': 'application/json',
		    'Content-Type': 'application/json',
			'Authorization': 'Bearer '+ _access_token
		};
	}
}

Salesforce.prototype.search_crm =  function(keyword) {
	var account = "Account (Id,Name,Industry,AccountNumber,Type,Phone,OwnerId)";
    var contact = "Contact (Id,Name,Title,Email,Phone,LeadSource,OwnerId)";
    var opp = "Opportunity (Id,Name,StageName,Type,LeadSource,OwnerId)";
    var lead = "Lead (Id,Name,Company,Title,Email,Phone,LeadSource,Status,OwnerId)";
    
    // Only search objects that it has permissions to
    var search_objects = [];
	search_objects.push(account);
	search_objects.push(contact);
	search_objects.push(opp);
	search_objects.push(lead);
	
	// SOSL Query to Salesforce
	var sosl = "q=FIND {"+ keyword +"*} IN ALL FIELDS RETURNING "+ search_objects.join(",");
	// URL Query to Salesforce
	var url = instance + search +"?"+ sosl;
		
	// REST GET to search for given keyword to SF API
	libHelper.restGET(complete_search_cb, url, this.req_headers);
};

Salesforce.prototype.check_auth = function () {
	// The Checking of authentication is to any standard object, in this case the Contact Object
	var url = instance + contact_set;
	if (instance == null) {
		libHelper.setError(_res, json_response, "Instance Is NULL");
	}
	else {
		// REST GET to search for given keyword to SF API
		libHelper.restGET(check_auth_cb, url, this.req_headers);
	}
};