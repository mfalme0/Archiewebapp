import React, { Component } from 'react';
import { OutTable, ExcelRenderer } from 'react-excel-renderer';
import axios from 'axios';


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

  sendDataToServer = (data) => {
    axios.post('/manangos', { data: data })
      .then(response => {
        console.log(response.data);
        alert('Data inserted successfully');
        window.location.reload()
      })
      .catch(error => {
        console.error("Error sending data to server:", error);
        alert('Error inserting data');
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