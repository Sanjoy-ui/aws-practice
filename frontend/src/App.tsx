import { useState, useEffect, useCallback } from 'react';
import { Item, ItemCreate, ItemUpdate, HealthStatus } from './types/item';
import { api, ApiError } from './services/api';
import { Navbar } from './components/Navbar';
import { ItemForm } from './components/ItemForm';
import { ItemList } from './components/ItemList';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import './App.css';

export function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');

  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deletingItem, setDeletingItem] = useState<Item | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
    setAlert({ message, type });
    if (type === 'success') {
      setTimeout(() => setAlert(null), 4000);
    }
  };

  const loadHealth = useCallback(async () => {
    setLoadingHealth(true);
    try {
      const data = await api.checkHealth();
      setHealth(data);
    } catch {
      setHealth(null);
    } finally {
      setLoadingHealth(false);
    }
  }, []);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const completedParam =
        statusFilter === 'all' ? undefined : statusFilter === 'completed';
      const response = await api.getItems({
        search: searchTerm || undefined,
        completed: completedParam,
      });
      setItems(response.items);
      setTotal(response.total);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to fetch items';
      showAlert(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  // Initial load
  useEffect(() => {
    loadHealth();
  }, [loadHealth]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadItems();
    }, 200);
    return () => clearTimeout(timer);
  }, [loadItems]);

  const handleCreateOrUpdate = async (data: ItemCreate | ItemUpdate) => {
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await api.updateItem(editingItem.id, data as ItemUpdate);
        showAlert(`Item #${editingItem.id} updated successfully!`);
        setEditingItem(null);
      } else {
        await api.createItem(data as ItemCreate);
        showAlert('New item created successfully!');
      }
      await loadItems();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Operation failed';
      showAlert(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleComplete = async (item: Item) => {
    try {
      // Optimistic update
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, completed: !item.completed } : i))
      );
      await api.updateItem(item.id, { completed: !item.completed });
      await loadItems();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to update item';
      showAlert(msg, 'error');
      await loadItems(); // Revert on error
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      await api.deleteItem(deletingItem.id);
      showAlert(`Item #${deletingItem.id} permanently deleted.`);
      setDeletingItem(null);
      await loadItems();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to delete item';
      showAlert(msg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="app-wrapper">
      <Navbar
        health={health}
        loadingHealth={loadingHealth}
        onRefreshHealth={loadHealth}
      />

      <main className="main-container">
        {/* Alerts */}
        {alert && (
          <div className={`alert-banner ${alert.type}`} role="alert">
            <div className="alert-content">
              {alert.type === 'error' ? (
                <AlertCircle size={18} />
              ) : (
                <CheckCircle2 size={18} />
              )}
              <span>{alert.message}</span>
            </div>
            <button
              type="button"
              className="alert-close"
              onClick={() => setAlert(null)}
              aria-label="Dismiss alert"
            >
              ×
            </button>
          </div>
        )}

        <div className="app-grid">
          {/* Left Column: Form */}
          <section aria-label="Item entry">
            <ItemForm
              initialData={editingItem}
              onSubmit={handleCreateOrUpdate}
              onCancel={() => setEditingItem(null)}
              isSubmitting={isSubmitting}
            />
          </section>

          {/* Right Column: List & Filters */}
          <section aria-label="Item management">
            <ItemList
              items={items}
              total={total}
              loading={loading}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              onToggleComplete={handleToggleComplete}
              onEdit={(item) => {
                setEditingItem(item);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onDeleteRequest={setDeletingItem}
            />
          </section>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        item={deletingItem}
        isOpen={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default App;

