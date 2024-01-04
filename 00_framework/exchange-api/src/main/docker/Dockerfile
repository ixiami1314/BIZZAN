#FROM openjdk:8-jdk

FROM openjdk:8-jre-alpine
MAINTAINER fisher <2059746@qq.com>
VOLUME /tmp
ADD exchange-api.jar exchange-api.jar
ENTRYPOINT ["java", "-Xms200m", "-Xmx1G", "-Duser.timezone=GMT+08", "-jar", "/exchange-api.jar"]