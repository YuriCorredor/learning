# Run the application

## Spin up the PostgreSQL database using Docker

```bash
docker run --name go-postgres -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```

- The docker `run command` is used to run a Docker container from a Docker image.
- The `--name go-postgres` flag specifies a name for the container, which can be used to reference the container in other Docker commands.
- The `-e POSTGRES_PASSWORD=docker` flag sets an environment variable named `POSTGRES_PASSWORD` to the value docker inside the container. This variable can be used to configure the password for the default `postgres` user in the PostgreSQL database.
- The `-p 5432:5432` flag exposes the container's port `5432` and maps it to the host's port `5432`. This allows the container to be accessed from the host system on port `5432`.
- The `-d` flag runs the container in detached mode, which means that it runs in the background and does not attach to the terminal.
- Finally, the `postgres` argument specifies the name of the Docker image to use for the container. In this case, the `postgres` image is used, which includes the PostgreSQL database software.

In summary, this `docker run` command creates and starts a new Docker container named `go-postgres` from the `postgres` image, sets the `POSTGRES_PASSWORD` environment variable to docker, exposes and maps the container's port `5432` to the host's port `5432`, and runs the container in detached mode.

## Run the following command to start the application itself

```bash
nodemon --exec go run main.go --signal SIGTERM
```
