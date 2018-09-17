FROM gibbonnet/gsp2

WORKDIR /home/gsp
COPY gsp_cloud_server /home/gsp/gsp_cloud_server
EXPOSE 5000

COPY ["entrypoint.sh","/home/gsp/entrypoint.sh"]
RUN sudo chmod 777 /home/gsp/entrypoint.sh
ENTRYPOINT ["/home/gsp/entrypoint.sh"]