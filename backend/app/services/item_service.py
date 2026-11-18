from typing import Optional, List, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.item import Item
from app.schemas.item import ItemCreate, ItemUpdate


class ItemService:
    @staticmethod
    def get_by_id(db: Session, item_id: int) -> Optional[Item]:
        """Fetch a single item by primary key."""
        return db.query(Item).filter(Item.id == item_id).first()

    @staticmethod
    def get_all(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        search: Optional[str] = None,
        completed: Optional[bool] = None,
    ) -> Tuple[List[Item], int]:
        """Fetch items with filtering, searching, and pagination."""
        query = db.query(Item)

        if search:
            search_pattern = f"%{search}%"
            query = query.filter(
                or_(
                    Item.title.ilike(search_pattern),
                    Item.description.ilike(search_pattern),
                )
            )

        if completed is not None:
            query = query.filter(Item.completed == completed)

        total = query.count()
        items = query.order_by(Item.id.desc()).offset(skip).limit(limit).all()
        return items, total

    @staticmethod
    def create(db: Session, item_in: ItemCreate) -> Item:
        """Create and persist a new item."""
        item = Item(
            title=item_in.title,
            description=item_in.description,
            completed=item_in.completed,
        )
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def update(db: Session, item_id: int, item_in: ItemUpdate) -> Optional[Item]:
        """Update an existing item."""
        item = ItemService.get_by_id(db, item_id)
        if not item:
            return None

        update_data = item_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(item, key, value)

        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def delete(db: Session, item_id: int) -> bool:
        """Delete an item by ID."""
        item = ItemService.get_by_id(db, item_id)
        if not item:
            return False

        db.delete(item)
        db.commit()
        return True

