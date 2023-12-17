import React, { useState, useEffect } from 'react';
import { Container, Row, Table, Button, Modal } from 'react-bootstrap';
import { CiSearch, CiServer } from 'react-icons/ci';
import { CiShoppingTag } from 'react-icons/ci';

function Lookup() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);


  
  const[formdata, setformdata] = useState({
    
    instanceId:'',
    

  });

  const handlekuchange =(e) =>{
    const {name, value } =e.target;
    setformdata({...formdata, [name]:value});
  }
  const handlesubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedItem && selectedItem.Id) {
        const response = await fetch(`/update/${selectedItem.Id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            instanceId: formdata.instanceId, // Use the correct field name from your backend
            // Add other fields you want to update
          }),
        });

        if (response.ok) {
          console.log("Data updated successfully");
          setShowModal(false);
        } else {
          console.log("Error updating data");
        }
      }
    } catch (error) {
      console.log("Error: " + error);
    }
  };
  const handleSearch = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch(`/info`);
      const data = await response.json();
  
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleTakeOut = (item) => {
    setShowModal(true);
    setSelectedItem(item);
    if (item && item.Id){
      setformdata((prevFormdata) => ({
        ...prevFormdata,
        document:item.Id,
      }));
    }
  };




  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const renderTableRows = () => {
    return searchResults.map((result) => (
      <tr key={result.instanceid}>
        <td>{result.instanceid}</td>
        <td>{result.Id}</td>
        <td>{result.CustomerId}</td>
        <td>{result.Name}</td>
        <td>{result.loanAmount}</td>
        <td>{result.state}</td>
        <td>{result.availability}</td>
        <td>
          <Button variant='primary' onClick={() => handleTakeOut(result)}>
            Take out <CiServer />
          </Button>
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <Container>
        {/* ... (your existing code) */}
        <h1>Loan Form Search</h1>
        <Row className="justify-content-center">
          <form onSubmit={handleSearch}>
            <label>Enter Customer ID </label>
            <br/>
            <input
              type="text"
              name="search"
              placeholder="..."
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <br />
            <Button variant="primary" type="submit">
              <CiSearch /> Search
            </Button>
            <span></span>
          </form>
        </Row>
        <Row>
          {searchResults.length > 0 ? (
            <Table striped bordered hover variant='dark' responsive>
              <thead>
                <tr>
                  <th>Archive number</th>
                  <th>Id</th>
                  <th>CustomerId</th>
                  <th>Name</th>
                  <th>Loan Amount</th>
                  <th>State</th>
                  <th>Availability</th>
                  <th>Request</th>
                </tr>
              </thead>
              <tbody>{renderTableRows()}</tbody>
            </Table>
          ) : (
            <p>No results found.</p>
          )}
        </Row>

        {/* Modal for displaying details */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedItem && (
              <div>
                <Row>
                <p>Selected Item Details:</p>
                <ul>
                  <li>Archive number: {selectedItem.instanceid}</li>
                  <li>Customer name: {selectedItem.Name}</li>
                  <li>Id: {selectedItem.Id}</li>
                  <li>CustomerId: {selectedItem.CustomerId}</li>
                  {/* Include other details as needed */}
                </ul>
                
                </Row>
                <Row>
                <form onSubmit={handlesubmit} >
                <p> please enter the following information and management with get back to you</p>

                <label>Loan ID</label>

                <input 
                placeholder={selectedItem.Id} 
                name="document"
                value={selectedItem.Id} 
                onChange={handlekuchange}
                readOnly
                 />

                <label>Archive Number</label>

                <input 
                type="text"
                name="instanceId"
                placeholder="178098"
                onChange={handlekuchange}
                required
                />
                <br/>
                <Button type='submit'variant='primary'>
                  Modify
                </Button>

            </form>
                </Row>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
             <CiShoppingTag/> Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default Lookup;
