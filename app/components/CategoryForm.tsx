import React from "react";
import { Modal, Form, Input, Button, Space } from "antd";
import type { Category } from "../types";

interface CategoryFormProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: { name: string; color: string }) => void;
  initialValues?: Category | null;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  visible,
  onCancel,
  onOk,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const colorValue = Form.useWatch('color', form);

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  return (
    <Modal
      open={visible}
      title={initialValues ? "Edit Category" : "Create Category"}
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
                onOk(values);
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
      <Form form={form} layout="vertical" name="category_form">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input the category name!" }]}
        >
          <Input placeholder="e.g., Work, Personal, Shopping" />
        </Form.Item>
        <Form.Item
          name="color"
          label="Color"
          rules={[
            { required: true, message: "Please input a color!" },
            {
              pattern: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
              message: "Please enter a valid hex color (e.g., #FF5733)",
            },
          ]}
        >
          <Space.Compact style={{ width: "100%" }}>
            <div
              style={{
                width: 40,
                height: 32,
                backgroundColor: colorValue || '#ccc',
                border: '1px solid #d9d9d9',
                borderRadius: '6px 0 0 6px',
                flexShrink: 0,
              }}
            />
            <Input placeholder="#FF5733" style={{ flex: 1 }} />
          </Space.Compact>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryForm;
