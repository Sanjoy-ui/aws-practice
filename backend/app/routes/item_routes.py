from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.controllers.item_controller import ItemController
from app.schemas.item import (
    ItemCreate,
    ItemUpdate,
    ItemResponse,
    PaginatedItemResponse,
)

router = APIRouter(
    prefix="/items",
    tags=["Items"],
)


@router.post(
    "/",
    response_model=ItemResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new item",
    description="Add a new item to the database with title, optional description, and completion status.",
)
def create_item(
    item: ItemCreate,
    db: Session = Depends(get_db),
):
    return ItemController.create_item(db=db, item_in=item)


@router.get(
    "/",
    response_model=PaginatedItemResponse,
    status_code=status.HTTP_200_OK,
    summary="List items",
    description="Retrieve items with optional pagination, keyword search, and completion status filtering.",
)
def list_items(
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(10, ge=1, le=100, description="Max number of items to return"),
    search: Optional[str] = Query(None, description="Search term for title or description"),
    completed: Optional[bool] = Query(None, description="Filter by completed status"),
    db: Session = Depends(get_db),
):
    return ItemController.list_items(
        db=db,
        skip=skip,
        limit=limit,
        search=search,
        completed=completed,
    )


@router.get(
    "/{item_id}",
    response_model=ItemResponse,
    status_code=status.HTTP_200_OK,
    summary="Get item by ID",
    description="Retrieve details for a single item by its unique ID.",
)
def get_item(
    item_id: int,
    db: Session = Depends(get_db),
):
    return ItemController.get_item(db=db, item_id=item_id)


@router.put(
    "/{item_id}",
    response_model=ItemResponse,
    status_code=status.HTTP_200_OK,
    summary="Update item",
    description="Update fields on an existing item.",
)
def update_item(
    item_id: int,
    item: ItemUpdate,
    db: Session = Depends(get_db),
):
    return ItemController.update_item(db=db, item_id=item_id, item_in=item)


@router.patch(
    "/{item_id}",
    response_model=ItemResponse,
    status_code=status.HTTP_200_OK,
    summary="Partially update item",
    description="Partially update one or more fields on an existing item.",
)
def patch_item(
    item_id: int,
    item: ItemUpdate,
    db: Session = Depends(get_db),
):
    return ItemController.update_item(db=db, item_id=item_id, item_in=item)


@router.delete(
    "/{item_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete item",
    description="Permanently delete an item from the database.",
)
def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
):
    return ItemController.delete_item(db=db, item_id=item_id)

