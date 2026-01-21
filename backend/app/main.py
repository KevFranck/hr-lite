from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.routers.departments import router as department_router
from app.routers.positions import router as position_router
from app.routers.employees import router as employee_router

app = FastAPI(title="HR Lite API", version="1.0.0")

# Folder to stock static files
app.mount("/media", StaticFiles(directory="media"), name="media")


app.include_router(department_router)
app.include_router(position_router)
app.include_router(employee_router)

@app.get("/health")
def health():
    return {"status": "ok"}
