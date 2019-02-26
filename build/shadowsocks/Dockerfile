FROM centos:7
COPY ./batch /home/shadowsocks
WORKDIR /home/shadowsocks
RUN echo -e "\n12012\n7\n\n" | bash ./shadowsocks.sh 2>&1 | tee shadowsocks.log
EXPOSE 12012
ENTRYPOINT ["bash", "/home/shadowsocks/entry.sh"]
