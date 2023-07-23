import { Button, Form, Input } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
const EditableContext = React.createContext(null);

export function useComumns({ prices, setPrices }) {
  return [
    {
      title: "category",
      dataIndex: "category",
      key: "category",
      width:"10rem"
    },
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (url) => {
        return <>{ url && <img style={{ height: "50px", width: "50px" }} alt = "food" src={url}></img> } </>;
      },
    },
    {
      title: "label",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price, data) => {
        return (
          <> {data?.id && <> {prices.filter((p) => p.id === data.id)[0].price}</>}</>
        );
      },
      editable: prices,
    },
  ];
}

const EditableCell = ({
  title,
  editable,
  filteredValue,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    if (editable) {
      form.setFieldsValue({
        [dataIndex]: editable.filter((i) => i.id === record[dataIndex]),
      });
    }
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onBlur={save} onPressEnter={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

export const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

export const components = {
  body: {
    row: EditableRow,
    cell: EditableCell,
  },
};
