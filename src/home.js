import React, { useState } from 'react';
import { Container, Row, Table, Button } from 'react-bootstrap';
import { CiSearch } from 'react-icons/ci';
import { CiServer } from "react-icons/ci";

function Lookup() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);


  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`/info?search=${searchTerm}`);
      const data = await response.json();

      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
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
          <Button variant='primary'>
                    Take out <CiServer />
                  </Button>
        </tr>
      ))
    
  };

  return (
    <div>
      <Container>
        <Row className="justify-content-center">
          <form onSubmit={handleSearch}>
            <label>Enter Customer ID </label>
            <br/>
            <input
              type="text"
              name="search"
              placeholder="..."
              value={searchTerm}
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
                
                </tr>
              </thead>
              <tbody>{renderTableRows()}</tbody>
            </Table>
          ) : (
            <p>No results found.</p>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default Lookup;

