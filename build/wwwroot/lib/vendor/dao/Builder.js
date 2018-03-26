define([ "../io/Request" ], function(Request) {
	"use strict";
	var Builder = {

		installBuilder: function(endpoint, org, space, builderName) {
			var sRequestUrl = "/admin/builder/install?endpoint="+endpoint+"&org="+org+"&space="+space+"&appname="+builderName;
			return Request.send(sRequestUrl, "POST", {}, {});
		}
	};

	return Builder;

});
