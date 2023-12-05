import React, { useState } from 'react';

const LargeItemInput = () => {
  const columns = [
    'Branch',
    'Id',
    'CustomerId',
    'legalId',
    'Name',
    'loanAmount',
    'Disbursmentdate',
    'Matudate',
  ];

  const [columnItems, setColumnItems] = useState({});
  const [currentItem, setCurrentItem] = useState({});

  const handleItemChange = (columnName, value) => {
    setCurrentItem((prevItems) => ({
      ...prevItems,
      [columnName]: value.trim(),
    }));
  };

  const handleAddItem = () => {
    if (Object.values(currentItem).every((value) => value !== '')) {
      setColumnItems((prevItems) => ({
        ...prevItems,
        ...currentItem,
      }));
      setCurrentItem({});
    }
  };

  const handleRemoveItem = (columnName) => {
    setColumnItems((prevItems) => {
      const { [columnName]: _, ...rest } = prevItems;
      return rest;
    });
  };

  const handleInsertItems = () => {
    // Here, you can send the columnItems to your backend or perform further actions
    console.log('Items to be inserted:', columnItems);
    // Reset the state after inserting items
    setColumnItems({});
    setCurrentItem({});
  };

  return (
    <div>
      <h2>Insert Items into Columns</h2>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {columns.map((columnName) => (
          <div key={columnName} style={{ marginRight: '10px' }}>
            <label>
              {columnName}:
              <input
                type="text"
                value={currentItem[columnName] || ''}
                onChange={(e) => handleItemChange(columnName, e.target.value)}
              />
            </label>
          </div>
        ))}
        <button onClick={handleAddItem}>Add Item</button>
      </div>
      <div>
        <h3>Items:</h3>
        <ul>
          {Object.entries(currentItem).map(([columnName, value]) => (
            <li key={columnName}>
              {columnName}: {value}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleInsertItems}>Insert Items into Columns</button>

      <div>
        <h3>Items to be Added:</h3>
        <table>
          <thead>
            <tr>
              <th>Column</th>
              <th>Item</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(columnItems).map(([columnName, value]) => (
              <tr key={columnName}>
                <td>{columnName}</td>
                <td>{value}</td>
                <td>
                  <button onClick={() => handleRemoveItem(columnName)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LargeItemInput;
