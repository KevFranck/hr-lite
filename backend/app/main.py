from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="HR Lite API", version="1.0.0")

# Folder to stock static files
app.mount("/media", StaticFiles(directory="media"), name="media")


@app.get("/health")
def health():
    return {"status": "ok"}
