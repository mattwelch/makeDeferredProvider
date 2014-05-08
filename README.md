## Overview
Augment [Visualforce Remote Objects](http://www.salesforce.com/us/developer/docs/pages/Content/pages_remote_objects.htm "Remote Objects") to provide promises.
## Setup
First, jQuery is required, as that's what provides the deferred/promises framework. After that's included, make sure `makeDeferredProvider.js` (or `makePreferredProvider.min.js`) is included.

Then, simply call

	makeDeferredProvider("jsNameSpace");
where `jsNameSpace` is the namespace provided to the `apex:remoteObjects` VF tag. If no argument is provided for `makeDeferredProvider`, the default is `SObjectModel`, just like the remoteObjects tag.	

## Use
The regular flow for Visualforce Remote Object is (per the [release notes](http://docs.releasenotes.salesforce.com/en-us/api/release-notes/rn_vf_remote_objects.htm)):

	var wh = new SObjectModel.Warehouse();
            
	// Use the Remote Object to query for 10 warehouse records
	wh.retrieve({ limit: 10 }, function(err, records){
	    if(err) alert(err.message);
	    else {
			alert (records);
	    }
	});
Using promises, the flow is just a bit different:

	var wh = SObjectModel.deferredObject('Warehouse');;
            
	// Use the Remote Object to query for 10 warehouse records
	var whp = wh.retrieve({ limit: 10 });
	
	whp.then(
	// The first function is invoked when the promise is successfully fulfilled
		function(records){
			console.log(records);
	    },
	// The second function is invoked when the promise is rejected
	    function(err) {
	    	console.log(err);
	    }
	});
That's a bit more verbose, and in this simple case, promises aren't worth the effort. Read up more [here](http://code.tutsplus.com/tutorials/wrangle-async-tasks-with-jquery-promises--net-24135), or [here](http://www.htmlgoodies.com/beyond/javascript/making-promises-with-jquery-deferred.html) to really start to get the advantages promises offer.
