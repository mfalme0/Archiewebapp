import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const Addexcel = () => {
  const [uploadedFile, setUploadedFile] = useState(null);

  const onDrop = (acceptedFiles) => {
    // Assuming you want to handle only one file
    const file = acceptedFiles[0];
    setUploadedFile(file);
  };

  const uploadFile = async () => {
    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      try {
        // Send the Excel file to the server
        const response = await fetch('/weka', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          // Parse the response JSON to get additional data (if needed)
          const result = await response.json();

          // Now, you can add the parsed data to the database
          const dataForDatabase = result.data; // Modify this based on your response structure

          // Send the data to the database API
          const databaseResponse = await fetch('/ongeza', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataForDatabase),
          });

          if (databaseResponse.ok) {
            alert('File data added to the database successfully!');
          } else {
            alert('Error adding data to the database. Please try again.');
          }
        } else {
          alert('Error uploading file. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
      }
    } else {
      alert('Please choose a file to upload.');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.xlsx',
    multiple: false,
  });

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
          <button onClick={uploadFile}>Upload</button>
        </div>
      )}
    </div>
  );
};

export default Addexcel;
