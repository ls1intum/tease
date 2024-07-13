# TEASE

Team allocation decision support system as used in the iPraktikum.

## Usage

### Starting TEASE Client and Server

To start the TEASE application, follow the steps below:

#### Option A: Using Remote Docker Images 
Ensure that the docker-compose.yml file is in the directory, then run:
```
docker compose up
```

#### Option B: Using Local Repository
If you want to build the images locally from the repository, run:
```
docker compose up --build
```

### Access TEASE
Once the application is running, open `http://localhost/tease` in your browser. 

![Dashboard](docs/Dashboard.jpeg)

You can either import the example student data or specify a different file. If running together with [PROMPT](https://github.com/ls1intum/prompt) and previously logged in, student data can be directly imported. 

Constraints can be created for team size, skills, gender, nationality, device ownership, and language. After applying constraints, students will be automatically assigned to their highest project team preference while fulfilling all set constraints.

When used with PROMPT, constraints, allocations, and locked students can be synchronized in real-time between multiple clients.

The result can be exported as a CSV file or directly to PROMPT to continue the workflow there. Additionally, the team cards can be exported as images.

## Development 

TEASE consists of a client and a server. The client is built with Angular, while the server utilizes Spring Boot with Java and functions as a STOMP WebSocket Broker.

#### Client

In the client directory, run `npm install` to install all necessary dependencies.

To start the client, run `npm start` for a development server. After successful compilation, the client can be accessed at `http://localhost:80/`.

The application will automatically reload if you change any of the source files.

#### Server

In the server directory, run `mvn install` to install all necessary dependencies.

To start the server, run `mvn spring-boot:run`. After successful startup, the server can be accessed at `http://localhost:8081/`.

## Deployment

Upon a new commit to the `main` branch in the Tease repository, an automatic build pipeline is triggered. This pipeline builds a new Docker image for Tease. The image is then deployed to the same virtual machine that hosts Prompt. Once deployed, all incoming HTTP requests to the URL `prompt.ase.cit.tum.de/tease` are automatically routed to and served by the newly deployed Tease Docker image running on the virtual machine. To facilitate data exchange between Prompt and Tease, it is necessary to log in to Prompt as a member of the project management team. This step allows to import student data from Prompt into Tease and later export the allocation back to Prompt.

![Deployment Diagram](docs/DeploymentDiagram.svg)
