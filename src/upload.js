import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const Addexcel = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [columnMappings, setColumnMappings] = useState({});
  const [mappedData, setMappedData] = useState(null);

  const onDrop = (acceptedFiles) => {
    // Assuming you want to handle only one file
    const file = acceptedFiles[0];
    setUploadedFile(file);
  };

  const parseExcel = async () => {
    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      try {
        // Send the Excel file to the server
        const response = await fetch('/parse', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          // Parse the response JSON to get the file path
          const result = await response.json();

          // Now, you can map the columns before sending data to the server
          const dataForDatabase = result.data; // Assuming result.data contains the Excel data

          // Map column names using the mapping function
          const mappedData = dataForDatabase.map((row) => {
            const mappedRow = {};
            for (const columnName in row) {
              const mappedColumnName = mapColumnName(columnName);
              mappedRow[mappedColumnName] = row[columnName];
            }
            return mappedRow;
          });

          setMappedData(mappedData);
        } else {
          alert('Error parsing Excel file. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while parsing the Excel file. Please try again.');
      }
    } else {
      alert('Please choose a file to upload.');
    }
  };

  const mapColumnName = (columnName) => {
    const columnMappings = {
      'Branch': 'Branch',
      'Id': 'Id',
      'Customer_id': 'CustomerId',
      'Customer_Name': 'Name',
      'Loan_Amount': 'loanAmount',
      'Disbursement_Date': 'Disbursmentdate',
      'Maturity_Date': 'Matudate',
    };

    // If the columnName exists in the mappings, return the mapped column name; otherwise, return the original columnName
    return columnMappings[columnName] || columnName;
  };

  const uploadMappedData = async () => {
    if (mappedData) {
      try {
        // Send the mapped data to the server
        const response = await fetch('/ongeza', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mappedData),
        });

        if (response.ok) {
          alert('Mapped data added to the database successfully!');
        } else {
          alert('Error adding mapped data to the database. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
      }
    } else {
      alert('Please parse the Excel file before uploading.');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.xlsx',
    multiple: false,
  });

  useEffect(() => {
    setMappedData(null); // Reset mapped data when a new file is selected
  }, [uploadedFile]);

  return (
    <div>
      <h1>Import Excel Sheet</h1>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop an Excel file here, or click to select one</p>
      </div>
      {uploadedFile && (
        <div>
          <p>Selected File: {uploadedFile.name}</p>
          <button onClick={parseExcel}>Parse Excel</button>
        </div>
      )}

      {mappedData && (
        <div>
          <h2>Mapped Data</h2>
          <button onClick={uploadMappedData}>Upload Mapped Data</button>
        </div>
      )}
    </div>
  );
};

export default Addexcel;
