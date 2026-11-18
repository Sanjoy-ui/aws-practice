from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict


class ItemBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="Title of the item")
    description: Optional[str] = Field(None, description="Detailed description")
    completed: bool = Field(default=False, description="Completion status")


class ItemCreate(ItemBase):
    pass


class ItemUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255, description="Updated title")
    description: Optional[str] = Field(None, description="Updated description")
    completed: Optional[bool] = Field(None, description="Updated completion status")


class ItemResponse(ItemBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PaginatedItemResponse(BaseModel):
    total: int
    skip: int
    limit: int
    items: List[ItemResponse]

