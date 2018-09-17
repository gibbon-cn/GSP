# gsp/cloud_base_ws:0.0.1
# gsp/cloud_caf_ws:0.0.1

# sudo docker pull gibbonnet/gsp2

# sudo docker tag gibbonnet/gsp2 localhost:5000/gsp/cloud_base_ws:0.0.1 \
# && sudo docker push localhost:5000/gsp/cloud_base_ws:0.0.1

sudo docker build -t localhost:5000/gsp/cloud_caf_ws:0.0.1 . \
&& sudo docker push localhost:5000/gsp/cloud_caf_ws:0.0.1
