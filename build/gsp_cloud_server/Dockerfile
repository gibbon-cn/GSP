FROM localhost:5000/gsp/cloud_base_ws:0.0.1

WORKDIR /home/gsp
COPY buildfile /home/gsp/gsp_cloud_server
EXPOSE 5000

WORKDIR /home/caf

WORKDIR /home/gsp/gsp_cloud_server/runtime/libs
ENTRYPOINT ["dotnet", "Inspur.Ecp.Caf.Communication.Service.dll"]
