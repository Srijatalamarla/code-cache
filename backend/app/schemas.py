from pydantic import BaseModel, field_validator, Field
from typing import Optional

SUPPORTED_LANGUAGES = {
    "python", "javascript", "typescript", "go", "rust",
    "java", "cpp", "c", "bash", "sql", "html", "css", "json"
}

class SnippetCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    code: str = Field(..., min_length=1)
    language: str
    tags: list[str] = []
    starred: bool = False

    @field_validator("language")
    @classmethod
    def language_must_be_supported(cls, v):
        normalized = v.lower().strip()

        if normalized not in SUPPORTED_LANGUAGES:
            raise ValueError(f"Unsupported language '{v}'. Supported: {sorted(SUPPORTED_LANGUAGES)}")
            
        return normalized

    @field_validator("tags")
    @classmethod
    def tags_must_be_clean(cls, v):
        cleaned = [t.lower().strip() for t in v if t.strip()]

        if len(cleaned) > 10:
            raise ValueError("Maximum 10 tags per snippet")

        return cleaned

class SnippetUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    code: Optional[str] = Field(None, min_length=1)
    language: Optional[str] = None
    tags: Optional[list[str]] = None
    starred: Optional[bool] = None

    @field_validator("language")
    @classmethod
    def language_must_be_supported(cls, v):
        if v is None:
            return v

        normalized = v.lower().strip()

        if normalized not in SUPPORTED_LANGUAGES:
            raise ValueError(f"Unsupported language '{v}'")

        return normalized