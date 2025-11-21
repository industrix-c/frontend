import React, { useState } from "react";
import { Button, Table, Popconfirm, Tag, Space, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useTodos } from "../context/TodoContext";
import CategoryForm from "./CategoryForm";
import type { Category } from "../types";

const CategoryManager: React.FC = () => {
  const { state, addCategory, editCategory, removeCategory } = useTodos();
  const { categories, loading } = state;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleCreate = async (values: { name: string; color: string }) => {
    try {
      await addCategory(values);
      setIsModalVisible(false);
      message.success("Category created successfully");
    } catch {
      message.error("Failed to create category");
    }
  };

  const handleEdit = async (values: { name: string; color: string }) => {
    if (editingCategory) {
      try {
        await editCategory(editingCategory.id, values);
        setEditingCategory(null);
        message.success("Category updated successfully");
      } catch {
        message.error("Failed to update category");
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await removeCategory(id);
      message.success("Category deleted successfully");
    } catch {
      message.error("Failed to delete category");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Category) => (
        <Space>
          <Tag color={record.color}>{text}</Tag>
        </Space>
      ),
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      render: (color: string) => (
        <Space>
          <div
            style={{
              width: 24,
              height: 24,
              backgroundColor: color,
              border: "1px solid #d9d9d9",
              borderRadius: 4,
            }}
          />
          <span>{color}</span>
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Category) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => setEditingCategory(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Create Category
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
      <CategoryForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleCreate}
      />
      {editingCategory && (
        <CategoryForm
          visible={!!editingCategory}
          onCancel={() => setEditingCategory(null)}
          onOk={handleEdit}
          initialValues={editingCategory}
        />
      )}
    </div>
  );
};

export default CategoryManager;
