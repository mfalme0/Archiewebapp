import React, { useState } from 'react';

const ExcelUploader = () => {
  const [excelData, setExcelData] = useState([]);
  const [isFileImported, setIsFileImported] = useState(false);

  const uploadExcelFile = async (file) => {
    try {
      // Create a FormData object to append the file
      const formData = new FormData();
      formData.append('file', file);

      // Send the file to the backend API
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      // Check if the request was successful (HTTP status 200)
      if (response.ok) {
        const result = await response.text();
        console.log(result);

        // Fetch the data from Firebase after successful upload (replace with your logic)
        fetchFirebaseData();
        setIsFileImported(true);
      } else {
        console.error('Failed to upload file:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const fetchFirebaseData = async () => {
    try {
      // Fetch data from Firebase (replace with your logic)
      const response = await fetch('http://localhost:3000/fetchData');
      const data = await response.json();

      // Update state with fetched data
      setExcelData(data);
    } catch (error) {
      console.error('Error fetching data from Firebase:', error);
    }
  };

  const handleSubmit = () => {
    // Perform any additional processing or validation before submitting to the database

    // Example: Submit the data to the database (replace with your logic)
    submitDataToDatabase();
  };

  const submitDataToDatabase = async () => {
    try {
      // Submit data to the database (replace with your logic)
      const response = await fetch('http://localhost:3000/submitData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(excelData),
      });

      // Check if the request was successful (HTTP status 200)
      if (response.ok) {
        const result = await response.text();
        console.log(result);
      } else {
        console.error('Failed to submit data to the database:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting data to the database:', error);
    }
  };

  // Function to handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      previewExcelFile(file);
      // Uncomment the line below to upload the file immediately when selected
      // uploadExcelFile(file);
    }
  };

  // Function to preview Excel file data
  const previewExcelFile = async (file) => {
    try {
      // Read the Excel file for preview
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target.result;

        // Assuming the file contains Excel data
        const rows = await readExcelFileFromBuffer(data);
        console.log('oreview data:', rows)

        // Update state with the preview data
        setExcelData(rows);
        console.log('excel data:', rows)

        // Display the preview area
        setIsFileImported(true);
      };

      // Read the file as binary data
      reader.readAsBinaryString(file);
    } catch (error) {
      console.error('Error reading Excel file for preview:', error);
    }
  };

  // Function to read Excel data from buffer (you need to implement this)
  async function readExcelFileFromBuffer(buffer) {
    // Implement your logic to read Excel data from buffer using read-excel-file or other libraries
    // Example: const rows = await readXlsxFile(buffer);
    // Return the parsed rows
  }

  return (
    <div>
      <h1>Excel File Uploader and Database Submitter (React)</h1>

      {/* File input for Excel file */}
      <input type="file" onChange={handleFileChange} accept=".xlsx" />

      {/* Display area for imported Excel data */}
      {isFileImported && excelData && Array.isArray(excelData) && excelData.length > 0 ? (
        <div>
          <h2>Preview of Imported Excel Data</h2>
          <table border="1">
            <tbody>
              {excelData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* Submit button */}
      {isFileImported && (
        <button onClick={handleSubmit}>Submit to Database</button>
      )}
    </div>
  );
};

export default ExcelUploader;
