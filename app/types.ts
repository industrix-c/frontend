export interface Category {
  id: number;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  due_date?: string;
  category?: Category;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface TodosApiResponse {
  data: Todo[];
  pagination: Pagination;
}

export interface CategoriesApiResponse {
  categories: Category[];
}

export interface TodoApiResponse {
  todo: Todo;
}

export interface CategoryApiResponse {
  category: Category;
}
