import React from "react";

// UnorderedList Component
const UnorderedList = ({ text, special_class }) => {
  // Split the string by line breaks to create an array of items
  const items = text.split("\n");

  return (
    <ul className={`mb-4 ${special_class}`}>
      {items.map((item, index) => (
        <li key={index}>{item.trim()}</li>
      ))}
    </ul>
  );
};

export default UnorderedList;
