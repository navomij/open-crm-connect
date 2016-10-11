# open-crm-connect

An open-source CRM connector to Salesforce.com, written for nodeJS.

Pre-requisite
----------
```
npm install restler
```

We are using restler to parse the JSON response from Salesforce API. For more info on restler (https://github.com/danwrong/restler)

Features
--------

* Easy interface for common operations via http.request
* Provides a single-function authentication check, make sure access tokens are still valid
* Search a keyword within standard objects of Salesforce, namely: Account, Contacts, Lead and Opportunity
* Returns JSON response
* nodeJS ready