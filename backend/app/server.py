from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import auth, manager, order, profile, team

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(manager.router)
app.include_router(order.router)
app.include_router(profile.router)
app.include_router(team.router)
