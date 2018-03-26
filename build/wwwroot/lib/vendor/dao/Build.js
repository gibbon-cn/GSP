define(["../io/Request"], function (Request) {
	"use strict";
	var Build = {
		/**
		 * @private
		 * @memberOf sap.watt.uitools.chebackend.dao.Build
		 * @type {sap.watt.uitools.chebackend.io.Request}
		 */
		_io: Request,

		//TODO: need to connect, login, logout to Che, or can it be assumed that File.js takes care of this?
		//TODO: consider using HATEAOS instead of constructing urls.

		/** Initiates a build process on the Che server
		 * @memberOf sap.watt.uitools.chebackend.dao.Build
		 * @param {string} sWorkspaceId The ID (not name) of the workspace in which the project resides
		 * @param {string} sProjectId The ID of the project to build
		 * @param {object} oBuildOptions correspond to che api BuildOptions
		 * @return {Promise} a deferred promise that will provide the build's ID
		 */
		doBuild: function (sWorkspaceId, sProjectId, oBuildOptions) {
			var buildUrl = "/builder/" + sWorkspaceId + "/build?project=" + sProjectId;
			return this._io.send(buildUrl, "POST", {}, oBuildOptions);
		},

		doCancelBuild: function (sWorkspaceId, sBuildId) {
			var cancelBuildUrl = "/builder/" + sWorkspaceId + "/cancel/" + sBuildId;
			return this._io.send(cancelBuildUrl, "POST", {}, {});
		},

		doSetupBuild: function (sProjectName, sWorkspaceId) {
			//TODO: Ugly hack. Remove once setup of build is moved to server side
			//var setupBuildUrl = '/admin/hanabuilder/setup?serviceName=Demo-Hana';
			//var data = {};
			//data.project = sProjectName;
			//data.workspace = sWorkspaceId;
			//return Request.send(setupBuildUrl, "POST", {}, data);

		},

		doGetBuilders: function (sWorkspaceId) {
			var buildersUrl = "/builder/" + sWorkspaceId + "/builders";
			return this._io.send(buildersUrl, "GET", {}, {});
		},

		getBuilds: function (sWorkspaceId) {
			var buildsUrl = "/builder/" + sWorkspaceId + "/builds";
			return this._io.send(buildsUrl, "GET", {}, {});
		},

		getTask: function (oTask) {
			return this.getTaskStatus(oTask);
		},

		getTaskStatus: function (oTask) {
			if (oTask) {
				var sUrl = "/builder/" + oTask.workspaceId + "/status/" + oTask.taskId;
				return this._io.send(sUrl, "GET");
			} else {
				throw new Error("Missing params");
			}
		},

		getTaskLog: function (oTask, offset) {
			if (oTask) {
				var sUrl = "/builder/" + oTask.workspaceId;
				if (offset){
					sUrl += "/logs-ex/" + oTask.taskId + "?offset-line=" + offset;
				}
				else{
					sUrl += "/logs/" + oTask.taskId;
				}
				return this._io.send(sUrl, "GET");
			} else {
				throw new Error("Missing params");
			}
		},

		getTaskReport: function (oTask) {
			if (oTask) {
				var sUrl = "/builder/" + oTask.workspaceId + "/report/" + oTask.taskId;
				return this._io.send(sUrl, "GET");
			} else {
				throw new Error("Missing params");
			}
		},

		getDownloadResource: function (oTask, resourcePath) {
			if (oTask && resourcePath) {
				var sUrl = "/builder/" + oTask.workspaceId + "/download/" + oTask.taskId + "?path=" + resourcePath;
				return this._io.send(sUrl, "GET");
			} else {
				if (!oTask) {
					throw new Error("Task param is missing for builder download operation");
				} if (!resourcePath) {
					throw new Error("resourcePath param is missing for builder download operation");
				}
			}
		},

		_getDownloadAllLink: function (oTask) {
			if (oTask) {
				var sUrl = "/builder/" + oTask.workspaceId + "/download-all/" + oTask.taskId + "?arch=zip";
				return window.location.origin + this._io.resolveServerUrl(sUrl);
			} else {
				throw new Error("Missing params");
			}
		}

	};

	return Build;

});
