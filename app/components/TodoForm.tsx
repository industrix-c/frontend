import React from "react";
import { Modal, Form, Input, Select, DatePicker, Button } from "antd";
import { useTodos } from "../context/TodoContext";
import type { Todo } from "../types";
import dayjs from "dayjs";

const { Option } = Select;

interface TodoFormProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: Partial<Todo>) => void;
  initialValues?: Todo | null;
}

const TodoForm: React.FC<TodoFormProps> = ({
  visible,
  onCancel,
  onOk,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const { state } = useTodos();
  const { categories } = state;

  React.useEffect(() => {
    if (!visible) return;
    
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        due_date: initialValues.due_date ? dayjs(initialValues.due_date) : null,
      });
    } else {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  return (
    <Modal
      open={visible}
      title={initialValues ? "Edit Todo" : "Create Todo"}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            form
              .validateFields()
              .then((values) => {
                const formattedValues = {
                  ...values,
                  due_date: values.due_date ? values.due_date.toISOString() : null,
                };
                onOk(formattedValues);
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
        >
          {initialValues ? "Save" : "Create"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" name="todo_form">
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please input the title!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="priority"
          label="Priority"
          rules={[{ required: true, message: "Please select a priority!" }]}
        >
          <Select>
            <Option value="low">Low</Option>
            <Option value="medium">Medium</Option>
            <Option value="high">High</Option>
          </Select>
        </Form.Item>
        <Form.Item name="category_id" label="Category">
          <Select allowClear>
            {categories.map((cat) => (
              <Option key={cat.id} value={cat.id}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="due_date" label="Due Date">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TodoForm;
