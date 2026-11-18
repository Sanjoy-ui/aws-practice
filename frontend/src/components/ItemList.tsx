import React from 'react';
import { Item } from '../types/item';
import { Search, Edit3, Trash2, CheckCircle, Circle, Calendar, Inbox } from 'lucide-react';

interface ItemListProps {
  items: Item[];
  total: number;
  loading: boolean;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  statusFilter: 'all' | 'active' | 'completed';
  onStatusFilterChange: (val: 'all' | 'active' | 'completed') => void;
  onToggleComplete: (item: Item) => void;
  onEdit: (item: Item) => void;
  onDeleteRequest: (item: Item) => void;
}

export const ItemList: React.FC<ItemListProps> = ({
  items,
  total,
  loading,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onToggleComplete,
  onEdit,
  onDeleteRequest,
}) => {
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="card item-list-card">
      <div className="list-controls">
        {/* Search Input */}
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search items by title or description..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search items"
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="filter-pills" role="radiogroup" aria-label="Filter items by status">
          <button
            type="button"
            className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => onStatusFilterChange('all')}
            aria-checked={statusFilter === 'all'}
            role="radio"
          >
            All ({total})
          </button>
          <button
            type="button"
            className={`filter-pill ${statusFilter === 'active' ? 'active' : ''}`}
            onClick={() => onStatusFilterChange('active')}
            aria-checked={statusFilter === 'active'}
            role="radio"
          >
            Active
          </button>
          <button
            type="button"
            className={`filter-pill ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => onStatusFilterChange('completed')}
            aria-checked={statusFilter === 'completed'}
            role="radio"
          >
            Completed
          </button>
        </div>
      </div>

      {/* Item Listing */}
      <div className="items-container">
        {loading && items.length === 0 ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading items from PostgreSQL database...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <Inbox size={48} className="empty-icon" />
            <h3>No items found</h3>
            <p>
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search query or status filter.'
                : 'Create your first item using the form on the left!'}
            </p>
          </div>
        ) : (
          <ul className="items-list" aria-label="Items list">
            {items.map((item) => (
              <li
                key={item.id}
                className={`item-row ${item.completed ? 'completed' : ''}`}
              >
                <button
                  type="button"
                  className="btn-toggle-complete"
                  onClick={() => onToggleComplete(item)}
                  title={item.completed ? 'Mark incomplete' : 'Mark complete'}
                  aria-label={
                    item.completed
                      ? `Mark "${item.title}" incomplete`
                      : `Mark "${item.title}" complete`
                  }
                >
                  {item.completed ? (
                    <CheckCircle className="check-icon completed" size={22} />
                  ) : (
                    <Circle className="check-icon" size={22} />
                  )}
                </button>

                <div className="item-content">
                  <div className="item-title-row">
                    <h3 className={`item-title ${item.completed ? 'strike' : ''}`}>
                      {item.title}
                    </h3>
                    <span className="item-id-badge">#{item.id}</span>
                  </div>

                  {item.description && (
                    <p className="item-description">{item.description}</p>
                  )}

                  <div className="item-meta">
                    <span className="meta-date">
                      <Calendar size={13} />
                      Created {formatDate(item.created_at)}
                    </span>
                  </div>
                </div>

                <div className="item-actions">
                  <button
                    type="button"
                    className="btn-action edit"
                    onClick={() => onEdit(item)}
                    title={`Edit ${item.title}`}
                    aria-label={`Edit ${item.title}`}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn-action delete"
                    onClick={() => onDeleteRequest(item)}
                    title={`Delete ${item.title}`}
                    aria-label={`Delete ${item.title}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

