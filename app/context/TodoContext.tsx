import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
} from "react";
import {
  getTodos,
  getCategories,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoComplete,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/api";
import type { Todo, Category, Pagination } from "../types";

interface State {
  todos: Todo[];
  categories: Category[];
  pagination: Pagination | null;
  loading: boolean;
  error: Error | null;
  filters: {
    search?: string;
    category_id?: number | null;
    completed?: boolean | null;
    page?: number;
    page_size?: number;
    sort?: string;
  };
}

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_TODOS_SUCCESS"; payload: { todos: Todo[]; pagination: Pagination } }
  | { type: "FETCH_CATEGORIES_SUCCESS"; payload: { categories: Category[] } }
  | { type: "FETCH_ERROR"; payload: Error }
  | { type: "SET_FILTERS"; payload: Partial<State["filters"]> }
  | { type: "ADD_TODO"; payload: Todo }
  | { type: "UPDATE_TODO"; payload: Todo }
  | { type: "REMOVE_TODO"; payload: number }
  | { type: "ADD_CATEGORY"; payload: Category }
  | { type: "UPDATE_CATEGORY"; payload: Category }
  | { type: "REMOVE_CATEGORY"; payload: number };

const initialState: State = {
  todos: [],
  categories: [],
  pagination: null,
  loading: true,
  error: null,
  filters: {
    page: 1,
    page_size: 10,
    sort: "-created_at",
  },
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_TODOS_SUCCESS":
      return {
        ...state,
        loading: false,
        todos: action.payload.todos,
        pagination: action.payload.pagination,
      };
    case "FETCH_CATEGORIES_SUCCESS":
      return { ...state, loading: false, categories: action.payload.categories };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "ADD_TODO":
      return { ...state, todos: [action.payload, ...state.todos] };
    case "UPDATE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id ? action.payload : todo
        ),
      };
    case "REMOVE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    case "ADD_CATEGORY":
      return { ...state, categories: [...state.categories, action.payload] };
    case "UPDATE_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.payload.id ? action.payload : cat
        ),
      };
    case "REMOVE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter((cat) => cat.id !== action.payload),
      };
    default:
      return state;
  }
};

interface TodoContextProps {
  state: State;
  fetchTodos: () => void;
  fetchCategories: () => void;
  setFilters: (filters: Partial<State["filters"]>) => void;
  addTodo: (todo: Partial<Todo>) => Promise<void>;
  editTodo: (id: number, todo: Partial<Todo>) => Promise<void>;
  removeTodo: (id: number) => Promise<void>;
  toggleComplete: (id: number) => Promise<void>;
  addCategory: (category: { name: string; color: string }) => Promise<void>;
  editCategory: (id: number, category: { name: string; color: string }) => Promise<void>;
  removeCategory: (id: number) => Promise<void>;
}

const TodoContext = createContext<TodoContextProps | undefined>(undefined);

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchTodos = async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const { data, pagination } = await getTodos(state.filters);
      dispatch({
        type: "FETCH_TODOS_SUCCESS",
        payload: { todos: data, pagination },
      });
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error as Error });
    }
  };

  const fetchCategories = async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const { categories } = await getCategories();
      dispatch({ type: "FETCH_CATEGORIES_SUCCESS", payload: { categories } });
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error as Error });
    }
  };

  const setFilters = (filters: Partial<State["filters"]>) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  };

  const addTodo = async (todoData: Partial<Todo>) => {
    try {
      const { todo } = await createTodo(todoData);
      dispatch({ type: "ADD_TODO", payload: todo });
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error as Error });
      throw error;
    }
  };

  const editTodo = async (id: number, todoData: Partial<Todo>) => {
    try {
      const { todo } = await updateTodo(id, todoData);
      dispatch({ type: "UPDATE_TODO", payload: todo });
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error as Error });
      throw error;
    }
  };

  const removeTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      dispatch({ type: "REMOVE_TODO", payload: id });
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error as Error });
      throw error;
    }
  };

  const toggleComplete = async (id: number) => {
    try {
      const { todo } = await toggleTodoComplete(id);
      dispatch({ type: "UPDATE_TODO", payload: todo });
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error as Error });
      throw error;
    }
  };

  const addCategory = async (categoryData: { name: string; color: string }) => {
    try {
      const { category } = await createCategory(categoryData);
      dispatch({ type: "ADD_CATEGORY", payload: category });
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error as Error });
      throw error;
    }
  };

  const editCategory = async (id: number, categoryData: { name: string; color: string }) => {
    try {
      const { category } = await updateCategory(id, categoryData);
      dispatch({ type: "UPDATE_CATEGORY", payload: category });
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error as Error });
      throw error;
    }
  };

  const removeCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      dispatch({ type: "REMOVE_CATEGORY", payload: id });
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error as Error });
      throw error;
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [state.filters]);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <TodoContext.Provider
      value={{
        state,
        fetchTodos,
        fetchCategories,
        setFilters,
        addTodo,
        editTodo,
        removeTodo,
        toggleComplete,
        addCategory,
        editCategory,
        removeCategory,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return context;
};
