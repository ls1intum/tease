# Tease

Team allocation decision support system as used in the iPraktikum.

## Prerequisites

1. Install [Docker](https://docs.docker.com/get-docker/)
2. Clone this repository

## Usage - Starting TEASE

```
cd tease
docker build -t tease .
docker run -p 8080:80 --name tease-container tease
```

The container will take a little while to download the node dependencies and then compile the Angular project. After the project is done compiling open
[localhost:8080](https://localhost:8080) and _zoom out of the webpage_ a bit (67% seems good) to make some UI elements more visible (this workaround will be fixed in a future UI improvement update).

Feel free to replace the port with a different one if you're experiencing issues with getting connection retsets.

Once the tool is running, you can choose to import the example team data that is shipped with the repository.

![import](src/assets/images/import.png)

In **Distribute With Constraints** you can set global and team-specific constraints (e.g. minimum or maximum number of experienced developers, female developers, developers with a mac, etc.). Developers can be pinned to a team and assigned manually.

![constraints](src/assets/images/constraints.png)

The result can be exported as a CSV file, which can later be imported again to change the team allocation. Additionally team cards can be imported which generates images of the teams.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

---

For the deprecated documentation of previous versions of this repository (including info regarding build & deployment, code structure, older known issues and miscellaneous notes) please see the README from older commits.

---

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.