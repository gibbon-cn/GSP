define(["../io/Request", "sap/watt/lib/lodash/lodash"], function(Request, _) {

	"use strict";

	var Project = {

		_serverType: sap.watt.getEnv("server_type"),
		
		_projectTypes: null,
		
		MTA_PROJECT_TYPE_ID : "mta",
		
		SAP_WEB_PROJECT_TYPE_ID : "sap.web",
		
		HTML5_MTA_MODULE_PROJECT_TYPE_ID : "com.sap.hcp.html5",
		
		BLANK_PROJECT_TYPE_ID : "blank",

		GENERIC_ATTRIBUTE_NAME: "sap.watt.common.setting",
		
		getProjectTypes: function() {
			if (this._projectTypes) {
				return Q(this._projectTypes);
			}
			
			var that = this;
			return Request.send("/project-type", "GET").then(function(aProjectTypes) {
				that._projectTypes = aProjectTypes; 
				return that._projectTypes; 
			});
		},
		
		_convertToSupportedProjectType: function(sTypeID) {
			var that = this;
			return this.getProjectTypes().then(function(aProjectTypes) {
				if (that._serverType === "xs2") {
					return _.find(aProjectTypes, function(oProjectType) { 
						return oProjectType.id === sTypeID; 
					});
				}
				
				var index = _.findIndex(aProjectTypes, function(oProjectType) {
					return oProjectType.id === sTypeID;
				});
				var sSupportedTypeID = (index > -1 && sTypeID !== that.BLANK_PROJECT_TYPE_ID) ? sTypeID : that.SAP_WEB_PROJECT_TYPE_ID;
				return _.find(aProjectTypes, function(oProjectType) { 
					return oProjectType.id === sSupportedTypeID; 
				});
			});
		},

		/**
		 * Adds a project to a workspace.
		 *
		 * @memberOf sap.watt.uitools.chebackend.dao.File
		 * @param {string}
		 *            sUrl The workspace location
		 * @param {string}
		 *            sProjectName the human-readable name of the project
		 * @param {string}
		 *            sServerPath The optional path of the project on the server.
		 * @param {boolean}
		 *            bCreate If true, the project is created on the server file system if it doesn't already exist
		 */
		createProject: function(sUrl, oProjectData) {
			var url = sUrl + "?name=" + oProjectData.name;
			var data = {
				"generatorDescription": {
					"options": oProjectData.generatorDescription.options
				},
				"name": oProjectData.name,
				"visibility": null,
				"runners": null,
				"builders": {
					"configs": {},
					"default": null
				},
				"mixins": oProjectData.mixinTypes,
				"type": oProjectData.type,
				"description": null
			};

			var that = this;
			return this._convertToSupportedProjectType(oProjectData.type).then(function(oProjectType) {	
				data.type = oProjectType.id;
				data.attributes = that._transformAttributes(oProjectData.attributes, oProjectType);
				return Request.send(url, "POST", {}, data);
			});
		},

		isProjectTypeAttribute: function(sAttributeName, oCheProjectType) {
			if (oCheProjectType && oCheProjectType.attributeDescriptors) {
				var aAttributeDescriptors = oCheProjectType.attributeDescriptors;
				for (var i = 0; i < aAttributeDescriptors.length; i++) {
					if (aAttributeDescriptors[i].name === sAttributeName) {
						return true;
					}
				}
			}

			return false;
		},

		// "attributes": "Map[string,List[string]]",
		_transformAttributes: function(oProjectAttributes, oCheProjectType) {
			var that = this;

			if (_.isPlainObject(oProjectAttributes)) {
				// get attribute names
				var aAttributeNames = _.keys(oProjectAttributes);
				_.forEach(aAttributeNames, function(sAttributeName) {
					// get attribute value
					var oAttributeValue = oProjectAttributes[sAttributeName];

					// if attribute does not belong to the type store its value in a generic attribute
					if (!that.isProjectTypeAttribute(sAttributeName, oCheProjectType)) {
						// transform value to string array
						var oAttribute = {};
						oAttribute[sAttributeName] = oAttributeValue;
						if (!oProjectAttributes[that.GENERIC_ATTRIBUTE_NAME]) {
							oProjectAttributes[that.GENERIC_ATTRIBUTE_NAME] = [];
						}
						oProjectAttributes[that.GENERIC_ATTRIBUTE_NAME].push(JSON.stringify(oAttribute));
						// remove attribute name from the result object
						delete oProjectAttributes[sAttributeName];
					}
				});

				return oProjectAttributes;
			}

			return {};
		},

		updateProject: function(sWorkspaceId, sProjectPath, data) {
			return this._convertToSupportedProjectType(data.type).then(function(oProjectType) {
				data.type = oProjectType.id;	
				return Request.send("/project/" + sWorkspaceId + sProjectPath, "PUT", {}, data);
			});
		},

		getProjectMetadata: function(sWorkspaceId, sProjectName) {
			return Request.send("/project/" + sWorkspaceId + "/" + sProjectName, "GET");
		}
	};

	return Project;
});