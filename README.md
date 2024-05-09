1. Create .env file with db connection:
```DATABASE_URL="postgresql://postgres:root@host.docker.internal:5432/skbx-cinema?schema=sample"```

2.
    ```docker image build -t movies-api:latest``` .
    ```docker run -dp 3000:3000 --name movies-api-container movies-api:latest```
