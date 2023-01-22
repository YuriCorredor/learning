# Run the application

## Spin up the PostgreSQL database using Docker

```bash
docker run --name go-url-pg -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```

## Run the following command to start the application itself

```bash
nodemon --exec go run main.go --signal SIGTERM
```
