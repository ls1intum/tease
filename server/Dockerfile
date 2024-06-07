# Stage 1: Build the application
FROM maven:3.8.1-openjdk-17-slim as build
WORKDIR /app
COPY pom.xml .
COPY ./src ./src
RUN mvn clean package

# Stage 2: Run the application
FROM openjdk:17-slim
WORKDIR /app
COPY --from=build /app/target/*.jar ./tease-broker.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "./tease-broker.jar"]



