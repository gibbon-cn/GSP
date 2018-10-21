define(["../io/Request"], function(Request) {
	"use strict";
	var Run = {
		/**
		 * @private
		 * @memberOf sap.watt.uitools.chebackend.dao.Run
		 * @type {sap.watt.uitools.chebackend.io.Request}
		 */
		_io: Request,

		//TODO: need to connect, login, logout to Che, or can it be assumed that File.js takes care of this?
		//TODO: consider using HATEAOS instead of constructing urls.

		/** Initiates a run process on the Che server
		 * @memberOf sap.watt.uitools.chebackend.dao.run
		 * @param {string} sWorkspaceId The ID (not name) of the workspace in which the project resides
		 * @param {string} sProjectId The ID of the project to run
		 * @return {Promise} a deferred promise that will provide the run's ID
		 */
		doRun: function(sWorkspaceId, sProjectId, oReqBody) {
			var that = this;
			var runUrl = "/runner/" + sWorkspaceId + "/run?project=" + sProjectId;
			return this._io.send(runUrl, "POST", {}, oReqBody).then(function (oResponse) {
				return Q(that._rewriteLink(oResponse));
			});
		},

		doStop: function(sWorkspaceId, sRunId) {
			var that = this;
			var stopRunUrl = "/runner/" + sWorkspaceId + "/stop/" + sRunId;
			return this._io.send(stopRunUrl, "POST", {}, {}).then(function (oResponse) {
				return Q(that._rewriteLink(oResponse));
			});
		},

		getStatus: function(oResponse) {
			var that = this;
			if (oResponse) {
				var sRunStatusUrl = "/runner/" + oResponse.workspace + "/status/" + oResponse.processId;
				return this._io.send(sRunStatusUrl, "GET").then(function (oResponse) {
					return Q(that._rewriteLink(oResponse));
				});
			}
			throw new Error("Missing params");
		},

		getLog: function(sWorkspaceId, sProcessId) {
			var sRunLogUrl = "/runner/" + sWorkspaceId + "/logs/" + sProcessId;
			return this._io.send(sRunLogUrl, "GET");
		},

		getProcesses: function(sWorkspaceId, sProjectId) {
			var that = this;
			var sRunProcessesUrl = "/runner/" + sWorkspaceId + "/processes/?project=" + sProjectId;
			return this._io.send(sRunProcessesUrl, "GET").then(function (aResponses) {
				aResponses.forEach(function(oResponse) {
					that._rewriteLink(oResponse);
				});
				return Q(aResponses);
			});
		},

		getAllProcesses: function(sWorkspaceId) {
			var that = this;
			var sRunProcessesUrl = "/runner/" + sWorkspaceId + "/processes";
			return this._io.send(sRunProcessesUrl, "GET").then(function (aResponses) {
				aResponses.forEach(function(oResponse) {
					that._rewriteLink(oResponse);
				});
				return Q(aResponses);
			});
		},

		getServiceMetadata: function(sWorkspaceId, sProjectPath, sServiceName) {
			var sRunGetServiceMetadataUrl = "/runner/" + sWorkspaceId + "/serviceMetadata?project=" + sProjectPath + "&service=" + sServiceName;
			return this._io.send(sRunGetServiceMetadataUrl, "GET");
		},

		doRefresh: function(sWorkspaceId, sProjectId, oReqBody) {
			var that = this;
			var refreshUrl = "/runner/" + sWorkspaceId + "/refresh?project=" + sProjectId;
			return this._io.send(refreshUrl, "POST", {}, oReqBody).then(function (oResponse) {
				return Q(that._rewriteLink(oResponse));
			});
		},

		/**
		 * Changes e.g. log URLs so that they are resolvable from Web IDE host
		 */
		 // TODO remove as soon as server returns correct link URLs
		_rewriteLink: function(oProcess) {
			var that = this;
			if (Array.isArray(oProcess.links)) {
				oProcess.links.forEach(function(oLink) {
					if (oLink.href) {
						var sUrlPath = URI.parse(oLink.href).path;
						// We must not rewrite application or debug URLs.  As there is no clean way
						// to detect these, only rewrite URLs with paths, e.g. http://.../runner/...
						if (sUrlPath && sUrlPath.length > 1) {
							oLink.href = window.location.origin + that._io.resolveServerUrl(sUrlPath);
						}
					}
				});
			}
			return oProcess;
		}

	};

	return Run;

});
