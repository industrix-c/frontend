import React, { useState } from "react";
import { Input, Select, Row, Col, Space, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useTodos } from "../context/TodoContext";

const { Option } = Select;

const FilterControls: React.FC = () => {
  const { state, setFilters } = useTodos();
  const { categories } = state;
  const [searchValue, setSearchValue] = useState("");

  const handleStatusChange = (value: string) => {
    let completed: boolean | null;
    if (value === "completed") completed = true;
    else if (value === "active") completed = false;
    else completed = null;
    setFilters({ completed, page: 1 });
  };

  const handleSearch = () => {
    setFilters({ search: searchValue, page: 1 });
  };

  return (
    <Row gutter={[16, 16]} className="mb-4">
      <Col xs={24} sm={12} md={10}>
        <Space.Compact style={{ width: "100%" }}>
          <Input
            placeholder="Search by title"
            value={searchValue}
            allowClear
            onChange={(e) => {
              setSearchValue(e.target.value);
              if (e.target.value === "") {
                setFilters({ search: "", page: 1 });
              }
            }}
            onPressEnter={handleSearch}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          />
        </Space.Compact>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Select
          placeholder="Filter by category"
          value={state.filters.category_id}
          onChange={(value) => setFilters({ category_id: value, page: 1 })}
          allowClear
          style={{ width: "100%" }}
        >
          {categories.map((cat) => (
            <Option key={cat.id} value={cat.id}>
              {cat.name}
            </Option>
          ))}
        </Select>
      </Col>
      <Col xs={24} sm={12} md={4}>
        <Select
          value={
            state.filters.completed === true
              ? "completed"
              : state.filters.completed === false
              ? "active"
              : "all"
          }
          onChange={handleStatusChange}
          style={{ width: "100%" }}
        >
          <Option value="all">All Statuses</Option>
          <Option value="completed">Completed</Option>
          <Option value="active">Active</Option>
        </Select>
      </Col>
      <Col xs={24} sm={12} md={4}>
        <Select
          value={state.filters.sort || "-created_at"}
          onChange={(value) => setFilters({ sort: value })}
          style={{ width: "100%" }}
        >
          <Option value="-created_at">Newest First</Option>
          <Option value="created_at">Oldest First</Option>
          <Option value="priority">Priority (asc)</Option>
          <Option value="-priority">Priority (desc)</Option>
          <Option value="title">Title (A-Z)</Option>
          <Option value="-title">Title (Z-A)</Option>
        </Select>
      </Col>
    </Row>
  );
};

export default FilterControls;
