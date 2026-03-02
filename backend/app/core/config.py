from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Scalable API Assignment"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "uN_sAfE_dEfAuLt_SeCrEt_KeY_fOr_DeV"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 100 # 8 days
    
    # Database
    DATABASE_URL: str = "sqlite:///./sql_app.db"
    
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding='utf-8',
        case_sensitive=True
    )

settings = Settings()
