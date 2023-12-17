import React, { Component } from 'react';
import { OutTable, ExcelRenderer } from 'react-excel-renderer';
import axios from 'axios';  // Import axios for making HTTP requests

class ExcelRenderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cols: [],
      rows: [],
    };
  }

  fileHandler = (event) => {
    let fileObj = event.target.files[0];

    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        this.setState({
          cols: resp.cols,
          rows: resp.rows,
        });

        // Call the function to send data to the server
        this.sendDataToServer(resp.rows);
      }
    });
  };

  // Function to send data to the server
  sendDataToServer = (data) => {
    axios.post('/saveData', { data })
      .then(response => {
        console.log(response.data);
        alert('successful')
      })
      .catch(error => {
        console.error("Error sending data to server:", error);
        alert('error uploading', error)

      });
  };

  render() {  
    return (
      <div>
        <input
          type="file"
          onChange={this.fileHandler.bind(this)}
          style={{ padding: '10px' }}
        />
        <OutTable
          data={this.state.rows}
          columns={this.state.cols}
          tableClassName="ExcelTable2007"
          tableHeaderRowClass="heading"
        />
      </div>
    );
  }
}

export default ExcelRenderComponent;
