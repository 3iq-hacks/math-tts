# Server

The server serves as a gateway to all the services that the frontend needs to access. It is a simple flask server.

## Running

```bash
cd server
uvicorn main:app --reload
```

The app will be available on [localhost:8000](localhost:8000).