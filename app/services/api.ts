import axios from "axios";
import type {
  CategoriesApiResponse,
  CategoryApiResponse,
  Todo,
  TodoApiResponse,
  TodosApiResponse,
} from "../types";

const api = axios.create({
  baseURL: "/api",
});

export const getTodos = async (params: any) => {
  const response = await api.get<TodosApiResponse>("/todos", { params });
  return response.data;
};

export const createTodo = async (
  todo: Partial<Todo>
): Promise<TodoApiResponse> => {
  const response = await api.post("/todos", todo);
  return response.data;
};

export const updateTodo = async (
  id: number,
  todo: Partial<Todo>
): Promise<TodoApiResponse> => {
  const response = await api.put(`/todos/${id}`, todo);
  return response.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
  await api.delete(`/todos/${id}`);
};

export const toggleTodoComplete = async (id: number): Promise<TodoApiResponse> => {
  const response = await api.patch(`/todos/${id}/complete`);
  return response.data;
};

export const getCategories = async (): Promise<CategoriesApiResponse> => {
  const response = await api.get("/categories");
  return response.data;
};

export const createCategory = async (
  category: { name: string; color: string }
): Promise<CategoryApiResponse> => {
  const response = await api.post("/categories", category);
  return response.data;
};

export const updateCategory = async (
  id: number,
  category: { name: string; color: string }
): Promise<CategoryApiResponse> => {
  const response = await api.put(`/categories/${id}`, category);
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/categories/${id}`);
};

export default api;
