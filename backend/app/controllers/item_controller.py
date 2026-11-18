from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.services.item_service import ItemService
from app.schemas.item import (
    ItemCreate,
    ItemUpdate,
    ItemResponse,
    PaginatedItemResponse,
)


class ItemController:
    @staticmethod
    def create_item(db: Session, item_in: ItemCreate) -> ItemResponse:
        """Controller to handle creation of a new item."""
        item = ItemService.create(db=db, item_in=item_in)
        return item

    @staticmethod
    def list_items(
        db: Session,
        skip: int = 0,
        limit: int = 10,
        search: Optional[str] = None,
        completed: Optional[bool] = None,
    ) -> PaginatedItemResponse:
        """Controller to retrieve a paginated list of items with filters."""
        items, total = ItemService.get_all(
            db=db,
            skip=skip,
            limit=limit,
            search=search,
            completed=completed,
        )
        return PaginatedItemResponse(
            total=total,
            skip=skip,
            limit=limit,
            items=items,
        )

    @staticmethod
    def get_item(db: Session, item_id: int) -> ItemResponse:
        """Controller to retrieve an item by ID, raising 404 if missing."""
        item = ItemService.get_by_id(db=db, item_id=item_id)
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Item with id {item_id} not found",
            )
        return item

    @staticmethod
    def update_item(
        db: Session,
        item_id: int,
        item_in: ItemUpdate,
    ) -> ItemResponse:
        """Controller to update an item, raising 404 if missing."""
        updated_item = ItemService.update(db=db, item_id=item_id, item_in=item_in)
        if not updated_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Item with id {item_id} not found",
            )
        return updated_item

    @staticmethod
    def delete_item(db: Session, item_id: int) -> dict:
        """Controller to delete an item, raising 404 if missing."""
        success = ItemService.delete(db=db, item_id=item_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Item with id {item_id} not found",
            )
        return {"message": f"Item {item_id} deleted successfully", "id": item_id}

