import React, { useState, useEffect } from 'react';
import { Item, ItemCreate, ItemUpdate } from '../types/item';
import { PlusCircle, Save, X } from 'lucide-react';

interface ItemFormProps {
  initialData?: Item | null;
  onSubmit: (data: ItemCreate | ItemUpdate) => Promise<void>;
  onCancel?: () => void;
  isSubmitting: boolean;
}

export const ItemForm: React.FC<ItemFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setCompleted(initialData.completed);
    } else {
      setTitle('');
      setDescription('');
      setCompleted(false);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      completed,
    });

    if (!initialData) {
      setTitle('');
      setDescription('');
      setCompleted(false);
    }
  };

  const isEditing = Boolean(initialData);

  return (
    <div className="card item-form-card">
      <div className="card-header">
        <h2 className="card-title">
          {isEditing ? `Edit Item #${initialData?.id}` : 'Create New Item'}
        </h2>
        {isEditing && onCancel && (
          <button
            type="button"
            className="btn-icon"
            onClick={onCancel}
            title="Cancel editing"
            aria-label="Cancel editing"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="item-form" noValidate={false}>
        <div className="form-group">
          <label htmlFor="item-title" className="form-label">
            Title <span className="required-star">*</span>
          </label>
          <span id="title-hint" className="field-hint">
            A concise title for your item (max 255 characters)
          </span>
          <input
            id="item-title"
            name="title"
            type="text"
            className="form-input"
            required
            minLength={1}
            maxLength={255}
            placeholder="e.g. Set up production database"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-describedby="title-hint"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="item-desc" className="form-label">
            Description (Optional)
          </label>
          <span id="desc-hint" className="field-hint">
            Additional details or notes
          </span>
          <textarea
            id="item-desc"
            name="description"
            className="form-textarea"
            rows={3}
            placeholder="e.g. Ensure backups are scheduled every midnight"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            aria-describedby="desc-hint"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label" htmlFor="item-completed">
            <input
              id="item-completed"
              name="completed"
              type="checkbox"
              className="form-checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              disabled={isSubmitting}
            />
            <span>Mark as completed</span>
          </label>
        </div>

        <div className="form-actions">
          {isEditing && onCancel && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !title.trim()}
          >
            {isSubmitting ? (
              <span>Saving...</span>
            ) : isEditing ? (
              <>
                <Save size={16} /> Save Changes
              </>
            ) : (
              <>
                <PlusCircle size={16} /> Add Item
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

