"""Central configuration — the Python counterpart of backend's env.config.js.

pydantic-settings plays the same role zod plays in the backend: every value
is validated once at import time, and the rest of the codebase imports the
`settings` singleton instead of reading os.environ directly. Fail fast,
fail loud — a missing/invalid value should kill the process at boot, not
surface as a confusing runtime error mid-request.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # --- App ---
    ai_service_port: int = 8001
    log_level: str = "INFO"

    # --- OpenRouter (LLM) ---
    openrouter_api_key: str
    openrouter_model: str = "openrouter/free"
    openrouter_base_url: str = "https://openrouter.ai/api/v1"

    # --- Embeddings (local sentence-transformers model) ---
    embedding_model: str = "BAAI/bge-m3"
    embedding_dimensions: int = 1024


settings = Settings()
