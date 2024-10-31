# Usa un'immagine Java come base
FROM openjdk:17-jdk-slim

# Imposta la directory di lavoro
WORKDIR /app

# Copia il file Maven Wrapper e il file pom.xml
COPY mvnw ./
COPY .mvn .mvn
COPY pom.xml ./

# Copia il codice sorgente nel container
COPY src ./src

# Rendi eseguibile mvnw
RUN chmod +x mvnw

# Esegui la build del progetto
RUN ./mvnw clean install -DskipTests

# Espone la porta su cui la tua applicazione ascolterà
EXPOSE 8080

# Comando per avviare l'applicazione
CMD ["java", "-jar", "target/CapstoneBackend-0.0.1-SNAPSHOT.jar"]
