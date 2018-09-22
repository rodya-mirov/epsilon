FROM openjdk:10-jdk-slim

# This segment taken from https://github.com/carlossg/docker-maven/blob/f581ea002e5d067deb6213c00a4d217297cad469/jdk-10-slim/Dockerfile
# to get maven set up
ARG MAVEN_VERSION=3.5.4
ARG USER_HOME_DIR="/root"
ARG SHA=ce50b1c91364cb77efe3776f756a6d92b76d9038b0a0782f7d53acf1e997a14d
ARG BASE_URL=https://apache.osuosl.org/maven/maven-3/${MAVEN_VERSION}/binaries

RUN apt-get update \
    && apt-get install -y curl procps \
    && rm -rf /var/lib/apt/lists/*

# Maven fails with 'Can't read cryptographic policy directory: unlimited'
# because it looks for $JAVA_HOME/conf/security/policy/unlimited but it is in
# /etc/java-9-openjdk/security/policy/unlimited
RUN ln -s /etc/java-10-openjdk /usr/lib/jvm/java-10-openjdk-$(dpkg --print-architecture)/conf

RUN mkdir -p /usr/share/maven /usr/share/maven/ref \
    && curl -fsSL -o /tmp/apache-maven.tar.gz ${BASE_URL}/apache-maven-${MAVEN_VERSION}-bin.tar.gz \
    && echo "${SHA}  /tmp/apache-maven.tar.gz" | sha256sum -c - \
    && tar -xzf /tmp/apache-maven.tar.gz -C /usr/share/maven --strip-components=1 \
    && rm -f /tmp/apache-maven.tar.gz \
    && ln -s /usr/share/maven/bin/mvn /usr/bin/mvn

ENV MAVEN_HOME /usr/share/maven
ENV MAVEN_CONFIG "$USER_HOME_DIR/.m2"

# end maven setup, begin actual code ...
WORKDIR /epsilon/epsilonServer

# First, to save build time, we grab the pom and download the dependencies,
# so that we don't have to redo it every time we change the source. In a
# perfect world this would download all the maven dependencies, but it seems
# to only get some of them. Still, it helps.
COPY ./epsilonServer/pom.xml ./pom.xml

RUN mvn clean dependency:resolve

# Then grab the whole source code, build it, open a port, and run it
COPY ./epsilonServer .

RUN mvn package

EXPOSE 8080

CMD cd /epsilon/epsilonServer && java -jar target/epsilon*.jar
