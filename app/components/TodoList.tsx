import React, { useState } from "react";
import { useTodos } from "../context/TodoContext";
import {
  List,
  Spin,
  Button,
  Checkbox,
  Popconfirm,
  Tag,
  Typography,
  Empty,
  Alert,
  message,
} from "antd";
import TodoForm from "./TodoForm";
import type { Todo } from "../types";

const { Text } = Typography;

const TodoList: React.FC = () => {
  const { state, editTodo, removeTodo, toggleComplete } = useTodos();
  const { todos, loading, error } = state;
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const handleEdit = async (values: any) => {
    if (editingTodo) {
      try {
        await editTodo(editingTodo.id, values);
        setEditingTodo(null);
        message.success('Todo updated successfully');
      } catch {
        message.error('Failed to update todo');
      }
    }
  };

  if (error) {
    return (
      <Alert
        message="Error"
        description="Failed to load todos. Please try again later."
        type="error"
        showIcon
      />
    );
  }

  if (loading && todos.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (todos.length === 0) {
    return <Empty description="No todos found. Why not create one?" />;
  }

  return (
    <>
      <List
        className="mt-4"
        bordered
        itemLayout="horizontal"
        dataSource={todos}
        loading={loading}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => setEditingTodo(item)}>
                Edit
              </Button>,
              <Popconfirm
                title="Are you sure you want to delete this todo?"
                onConfirm={() => removeTodo(item.id)}
              >
                <Button type="link" danger>
                  Delete
                </Button>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Checkbox
                  checked={item.completed}
                  onChange={() => toggleComplete(item.id)}
                />
              }
              title={<Text delete={item.completed}>{item.title}</Text>}
              description={item.description}
            />
            <div className="flex flex-col items-end space-y-1">
              {item.category && (
                <Tag color={item.category.color}>{item.category.name}</Tag>
              )}
              <Tag>{item.priority}</Tag>
            </div>
          </List.Item>
        )}
      />
      {editingTodo && (
        <TodoForm
          visible={!!editingTodo}
          onCancel={() => setEditingTodo(null)}
          onOk={handleEdit}
          initialValues={editingTodo}
        />
      )}
    </>
  );
};

export default TodoList;
