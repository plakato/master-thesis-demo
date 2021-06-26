FROM ubuntu:18.04
# install python
RUN apt update &&  apt install -y software-properties-common locales
RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && \
    locale-gen
ENV LANG en_US.UTF-8  
ENV LANGUAGE en_US:en  
ENV LC_ALL en_US.UTF-8

# && add-apt-repository ppa:deadsnakes/ppa && apt update && apt install -y python3.8
RUN apt-add-repository ppa:swi-prolog/stable && apt update && apt-get install -y swi-prolog
RUN apt install -y python3-pip
RUN pip3 install flask flask-cors numpy
EXPOSE 5000