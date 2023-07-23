import { Button, Table, notification } from "antd";
import React, { useEffect, useState } from "react";
import { components, useComumns } from "./utils";
import axios from "axios";

export function Menu() {
  const [dataSource, setDataSource] = useState(null);
  const [prices, setPrices] = useState([]);
  function onSave() {
    localStorage.setItem("foodioPrice", JSON.stringify(prices));
    notification.success({
        message: 'Prices Saved',
        description: 'prices were saved',
        placement: 'top'
    });
  }
  function onReset() {
    const prices = localStorage.getItem("foodioPrice");
    const priceArray = JSON.parse(prices);
    setPrices(priceArray);
    notification.success({
        message: 'Prices Reset',
        description: 'prices were reset',
        placement: 'top'
    });
  }
  async function getData() {
    const { data } = await axios.get(
      "https://foodiobe.onrender.com"
    );

    const prices = localStorage.getItem("foodioPrice");
    if (prices) {
      const priceArray = JSON.parse(prices);
      setPrices(priceArray);
    } else {
      const prices = data.map((item) => {
        return { id: item.id, price: item.price };
      });
      localStorage.setItem("foodioPrice", JSON.stringify(prices));
      setPrices(prices);
    }

    setDataSource(data);
  }

  useEffect(() => {
    getData();
  }, []);

  const handleSave = (row) => {
    const newData = [...prices];
    console.log(row);
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setPrices(newData);
  };

  const finalColumns = useComumns({ prices, setPrices }).map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <>
      <div
        style={{ display: "flex", justifyContent: "flex-end", margin: "1rem" }}
      >
        <Button style={{ marginRight: "1rem" }} onClick={onSave}>
          Save
        </Button>
        <Button onClick={onReset}>Reset</Button>
      </div>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        columns={finalColumns}
        dataSource={dataSource}
      />
    </>
  );
}
