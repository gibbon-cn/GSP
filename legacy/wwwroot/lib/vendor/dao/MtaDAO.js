define(["../io/Request"], function (Request) {
	
	"use strict";
	
	var MTAConverter = {
		convertFolderToModule : function(workspaceId, oFolderDocument, oProjectData) {
			return oFolderDocument.getProject(true).then(function (oProjectDocument) {
				var parentPath = oProjectDocument.getEntity().getFullPath();
				var folderRelativePath = oFolderDocument.getEntity().getFullPath().replace(parentPath + "/", "");
				var url = "/project/" + workspaceId + parentPath + "?path=" + folderRelativePath;

				oProjectData = oProjectData || {};
				oProjectData.type = oProjectData.type || "blank";
				oProjectData.name = oProjectData.name || folderRelativePath;
				oProjectData.generatorDescription = oProjectData.generatorDescription || {};
				oProjectData.generatorDescription.options = oProjectData.generatorDescription.options || {};
				oProjectData.mixinTypes = oProjectData.mixinTypes || [];
				var oData = {
					"name" : oProjectData.name,
					"type" : oProjectData.type,
					"generatorDescription": {
						"options": oProjectData.generatorDescription.options
					},
					"visibility": null,
					"runners": null,
					"builders": {
						"configs": {},
						"default": null
					},
					"mixins": oProjectData.mixinTypes,
					"description": null
				};
				
				return Request.send(url, "POST", {}, oData);
			});
		},
		
		getProjectModules : function(workspaceId, sProjectPath) {
			var url = "/project/" + workspaceId + "/modules/" + sProjectPath;			
			return Request.send(url, "GET", {}, {});	
		}

	};
	
	return MTAConverter;
});