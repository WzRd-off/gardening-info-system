from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.utils.database import get_db
from app.models.teams import Teams
from app.schemas.teams import TeamCreate, TeamRead

router = APIRouter(prefix="/teams", tags=["Teams Management"])

@router.post("/")
def create_team(team_data: TeamCreate, db: Session = Depends(get_db)):

    stmt = select(Teams).where(Teams.name == team_data.name)
    existing_team = db.execute(stmt).scalar_one_or_none()

    if existing_team:
        raise HTTPException(status_code=400, detail="Команда з такою назвою вже існує")

    new_team = Teams(
        name=team_data.name,
        efficiency_rating=team_data.efficiency_rating,
        leader_id=team_data.leader_id
    )
    db.add(new_team)
    db.commit()
    db.refresh(new_team)
    return JSONResponse(status_code=201, content={
        'status': 'success', 'message': 'Команда успішно створена'
        })

@router.get("/", response_model=list[TeamRead])
def get_all_teams(db: Session = Depends(get_db)):
    return db.execute(select(Teams)).scalars().all()

