from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Literal


class DestroySession(BaseModel):
    model_config = ConfigDict(extra="forbid")

    session_id: int 

class DestroyAllSession(BaseModel):
    model_config = ConfigDict(extra="forbid")

    account_id: int 

