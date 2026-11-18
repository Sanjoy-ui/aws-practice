export interface Item {
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ItemCreate {
  title: string;
  description?: string;
  completed?: boolean;
}

export interface ItemUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface PaginatedItems {
  total: number;
  skip: number;
  limit: number;
  items: Item[];
}

export interface HealthStatus {
  status: string;
  app_name: string;
  environment: string;
  database_connected: boolean;
  database_type: string;
}

