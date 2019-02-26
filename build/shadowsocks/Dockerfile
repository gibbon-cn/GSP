FROM centos:7
COPY ./batch /home/shadowsocks
WORKDIR /home/shadowsocks
RUN echo -e "\n\n7\n\n" | bash ./shadowsocks.sh 2>&1 | tee shadowsocks.log
EXPOSE 9999
ENTRYPOINT ["bash", "/home/shadowsocks/entry.sh"]
