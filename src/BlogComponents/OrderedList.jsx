import React from "react";

// OrderedList Component
const OrderedList = ({ text, special_class }) => {
  // Split the string by line breaks to create an array of items
  const items = text.split("\n");

  return (
    <ol className={`mb-4 ${special_class}`}>
      {items.map((item, index) => (
        <li key={index}>{item.trim()}</li>
      ))}
    </ol>
  );
};

export default OrderedList;
