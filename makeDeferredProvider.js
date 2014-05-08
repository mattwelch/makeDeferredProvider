/*
 * makeDeferredProvider - a small function to augment the visualforce
 * Remote Objects "SObjectModel" object to return an object
 * that provides promises
 *
 * Copyright (c)2014, Matt Welch.
 * License: MIT
 *
 * Usage:
 *   Call 'makeDeferredProvider("RemotingJSNameSpace")' (the argument is optional,
 *   and will default to "SObjectModel") to prepare the remoting
 *   object to provide promise-generating objects. Then, instead of
 *        var c = RemotingJSNameSpace.contact();
 *   use
 *        var c = RemotingJSNameSpace.deferredObject('contact');
 *
 */
var makeDeferredGlobal = (function () {
	return this || (1, eval)('this');
}());

function makeDeferredProvider(nameSpace) {

// Default to "SObjectModel", which is the VF Remote Object default as well
	nameSpace = nameSpace ? nameSpace : "SObjectModel";

// Add a function to our VF Remote Objects object
	makeDeferredGlobal[nameSpace].deferredObject=function(obj,vars) {
		var promiseRemoteObject={};
		promiseRemoteObject.remoteObject=new this[obj](vars);

		promiseRemoteObject.set=function(f,v) {
			this.remoteObject.set(f,v);
		}
		promiseRemoteObject.get=function(f) {
			return this.remoteObject.get(f);
		}

		promiseRemoteObject.retrieve=function(opts) {
			var deferred = $.Deferred();
			this.remoteObject.retrieve(opts, function(err, records) {
				if (err) {
					deferred.reject(err);
				}
				else {
					deferred.resolve(records);
				}
			});
			return deferred.promise();
		}

		promiseRemoteObject.create=function(fvs) {
			var deferred = $.Deferred();
			fvs = fvs ? fvs:this.remoteObject._props;
			this.remoteObject.create(fvs,function(err, result, e) {
				if (err) {
					deferred.reject(err);
				}
				else {
					deferred.resolve(result, e);
				}
			});
			return deferred.promise();
		}

		promiseRemoteObject.update=function(ids,fvs) {
			var deferred = $.Deferred();

// If our ids object isn't an array, the user probably didn't want to include ids
// so let's assume that the first argument should be our field-value pairs instead
			if (!(ids instanceof Array)) {
				fvs=ids;
				ids=null;
			}
			ids = ids ? ids : [this.remoteObject._props.Id];
			fvs = fvs ? fvs:this.remoteObject._props;
			console.log(this.remoteObject._props);
			console.log(ids);
			this.remoteObject.update(ids,fvs,function(err, ids) {
				if (err) {
					deferred.reject(err);
				}
				else {
					deferred.resolve(ids);
				}
			});
			return deferred.promise();
		}

		promiseRemoteObject.del=function(ids) {
			var deferred = $.Deferred();
			ids = ids ? ids : [this.remoteObject._props.Id];
			this.remoteObject.del(ids,function(err, ids) {
				if (err) {
					deferred.reject(err);
				}
				else {
					deferred.resolve(ids);
				}
			});
			return deferred.promise();
		}
		return promiseRemoteObject;
	};
}
