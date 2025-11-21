import { useState } from "react";
import type { Route } from "./+types/home";
import { Button, Layout, Typography, Pagination, message, Tabs } from "antd";
import TodoList from "../components/TodoList";
import FilterControls from "../components/FilterControls";
import TodoForm from "../components/TodoForm";
import CategoryManager from "../components/CategoryManager";
import { useTodos } from "../context/TodoContext";

const { Title } = Typography;
const { Header, Content, Footer } = Layout;

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Todo List" },
    { name: "description", content: "A simple todo list application." },
  ];
}

export default function Home() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { state, addTodo, setFilters } = useTodos();
  const { pagination, filters } = state;

  const handleCreate = async (values: any) => {
    try {
      await addTodo(values);
      setIsModalVisible(false);
      message.success('Todo created successfully');
    } catch {
      message.error('Failed to create todo');
    }
  };

  const onPageChange = (page: number, pageSize: number) => {
    setFilters({ page, page_size: pageSize });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
          padding: "0 24px",
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Todo List
        </Title>
        <Button 
          type="primary" 
          onClick={() => setIsModalVisible(true)}
        >
          Create Todo
        </Button>
      </Header>
      <Content style={{ padding: "24px" }}>
        <div style={{ background: "#fff", padding: 24 }}>
          <Tabs
            defaultActiveKey="todos"
            items={[
              {
                key: "todos",
                label: "Todos",
                children: (
                  <>
                    <FilterControls />
                    <TodoList />
                  </>
                ),
              },
              {
                key: "categories",
                label: "Categories",
                children: <CategoryManager />,
              },
            ]}
          />
        </div>
      </Content>
      <Footer style={{ textAlign: "center", background: "transparent" }}>
        {pagination && pagination.total > 0 && (
          <Pagination
            current={filters.page}
            pageSize={filters.page_size}
            total={pagination.total}
            onChange={onPageChange}
            showSizeChanger
          />
        )}
      </Footer>
      <TodoForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleCreate}
      />
    </Layout>
  );
}
