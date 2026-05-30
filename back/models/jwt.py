from pydantic import BaseModel


class Token_Response(BaseModel):
    access_token: str
    token_type: str

class Token_Data(BaseModel):
    user_id: int