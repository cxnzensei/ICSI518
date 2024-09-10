FROM openjdk:22-jdk

WORKDIR /app

COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline

COPY --chown=app:app src ./src

ENTRYPOINT ["./mvnw", "spring-boot:run"]