/*
* Copyright (c) 2016 NAVOMI (https://github.com/navomij/open-crm-connect)
* All rights reserved.
*/
// Restler Module, needs to be installed
var rest = require('restler');

var _renderJSON = function(_response, json_response) {
	_response.send(JSON.stringify(json_response));
};

var _renderLog = function(msg, error) {
	var now = new Date().toISOString();
	var log_out = "["+ now +"] "+ msg;
	if (error) {
		log_out = "ERROR: "+ log_out;
	}
	// Show error on log
	console.log(log_out);
};

module.exports = {
	log: function(msg, error) {
		_renderLog(msg, error);
	},
	setError: function(res, json_response, err_msg, result) {
		json_response['success'] = false;
		json_response['error'] = true;
		json_response['error_msg'] = err_msg;
		if (result) {
			json_response._data = result;
		}
		
		_renderJSON(res, json_response);
	},
	setSuccess: function(res, json_response, resp_txt, result, add_dict) {
		json_response['success'] = true;
		json_response['error'] = false;
		json_response.response = resp_txt;
		json_response._data = result;
		// Override the dict
		if (add_dict !== undefined) {
			for (k in add_dict) {
				json_response._data[k] = add_dict[k];
			}
		}
		
		_renderJSON(res, json_response);
	},
	standardResponse: function(res, json_response, result, response, response_success_txt, response_error_txt) {
		if (response.statusCode == 200 || response.statusCode == 201) {
			json_response['success'] = true;
			json_response['error'] = false;
			json_response.response = response_success_txt;
		}
		else {
			json_response['success'] = false;
			json_response['error'] = true;
			json_response['error_msg'] = response_error_txt;
		}
		
		if (result) {
			json_response._data = result;
		}
		
		_renderJSON(res, json_response);
	},
	renderJSON: function(_response, json_response) {
		_response.send(JSON.stringify(json_response));
	},
	restGET: function(complete_cb, url, headers) {
		if (headers == null) {
			headers = { 
				'Accept': '*/*', 
				'User-Agent': 'Restler for node.js' 
			};
		}
		
		_renderLog(url, false);
		
		rest.get(url, {
			headers: headers
		}).on('complete', complete_cb);
	},
	restPOST: function(complete_cb, url, json_data, headers, x_form) {
		if (headers == null) {
			headers = { 
				'Accept': '*/*', 
				'User-Agent': 'Restler for node.js' 
			};
		}
		
		_renderLog(url, false);
		
		if (x_form == null || x_form == undefined || !x_form) {
			json_data = JSON.stringify(json_data);
		}
		else {
			var url_data = [];
			for (var jd in json_data) {
				url_data.push(jd +"="+ json_data[jd]);
			} 
			json_data = url_data.join("&");
		}
		
		_renderLog(json_data, false);
		
		rest.post(url, {
			headers: headers,
			data: json_data
		}).on('complete', complete_cb);
	},
	restPUT: function(complete_cb, url, json_data, headers, x_form) {
		if (headers == null) {
			headers = { 
				'Accept': '*/*', 
				'User-Agent': 'Restler for node.js' 
			};
		}
		
		if (x_form == null || x_form == undefined || !x_form) {
			json_data = JSON.stringify(json_data);
		}
		else {
			var url_data = [];
			for (var jd in json_data) {
				url_data.push(jd +"="+ json_data[jd]);
			} 
			json_data = url_data.join("&");
		}
		
		rest.put(url, {
			headers: headers,
			data: json_data
		}).on('complete', complete_cb);
	}
};