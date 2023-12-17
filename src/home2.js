import React, { useState, useEffect } from 'react';
import { Container, Row, Table, Button, Modal } from 'react-bootstrap';
import { CiSearch, CiServer } from 'react-icons/ci';
import { CiShoppingTag } from 'react-icons/ci';

function Lookup() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const returnconstant= 'unreturned';

  
  const[formdata, setformdata] = useState({
    name: '',
    email:'',
    phone:'',
    datep:'',
    document:'',
    state:returnconstant,

  });

  const handlekuchange =(e) =>{
    const {name, value } =e.target;
    setformdata({...formdata, [name]:value});
  }
  const handlesubmit = async (e) => {
    e.preventDefault();
  
    // Validate form data (add your own validation logic)
    if (!formdata.name || !formdata.email || !formdata.phone) {
      console.error("Please fill in all required fields");
      return;
    }
  
    try {
      // Make a POST request to /shikandai endpoint
      const bookingData = {
   name: formdata.name,
   email: formdata.email,
   phone: formdata.phone,
   document: formdata.document,
   datep : formdata.datep,
   state: formdata.state,
      };
  
      const shikandaiResponse = await fetch("/takeout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
     
      // Handle the response from /shikandai endpoint
      if (!shikandaiResponse.ok) {
        console.error("Booking failed");
        return;
      }
      
      // Make a POST request to /nare endpoint
      const nareResponse = await fetch("/ital", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Id: formdata.document,
        }),
      });
  
      // Handle the response from /nare endpoint
      if (!nareResponse.ok) {
        console.error("Error marking car as unavailable");
        // You may want to handle this error condition accordingly
      }
  
      // Handle the success condition
      console.log("Booking successful");
  
      // Send email
     
  
      setShowModal(false);

      alert('Please wait for management to get back to you');
      console.log('data inserted');
  
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
  
    try {
      // Assuming you have a state variable searchTerm that holds the search term
      const response = await fetch(`/info?search=${searchTerm}`);
      const data = await response.json();
  
      // Assuming you have a state-setting function setSearchResults
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

  useEffect(()=>{
    const updatestate = async () => {
      try{
        if (selectedItem && selectedItem.Id){
        const response  = await fetch(`/take/${selectedItem.Id}`,{
          method:'PUT',
        });
        if (response.ok){
          console.log('iko fiti');
          setShowModal(false)
          alert('Please wait for managament to get back to you ')
        
        }else{
          console.log('acha ufala buda');
        }}
      }
      catch (err){
        console.log('rada mase' + err);
      }
    };  if (selectedItem ){
    updatestate(); 
     
  }
  }, [selectedItem]);


  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const renderTableRows = () => {
    return searchResults.map((result) => (
      <tr key={result.instanceid}>
        <td>{result.Archive_Number}</td>
        <td>{result.Id}</td>
        <td>{result.Customer_id}</td>
        <td>{result.Customer_Name}</td>
        <td>{result.Branch}</td>
        <td>{result.Loan_Amount}</td>
        <td>{result.Maturity_Date}</td>
        <td>{result.Disbursement_Date}</td>
        <td>
            {result.Availability === 'available' ?(
          <Button variant='primary' onClick={() => handleTakeOut(result)}>
            Take out <CiServer />
          </Button>
          ) :(
            <Button variant='primary' disabled>
            not availabile <CiServer />
          </Button>
          )}
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
                  <th>Branch</th>
                  <th>Loan Amount</th>
                  <th>Maturity Date</th>
                  <th>Disbursement Date</th>
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

                <label>name</label>

                <input 
                type="text"
                name="name"
                placeholder="John Doe"
                onChange={handlekuchange}
                required
                />

                <label>email</label>

                <input
                type="email"
                name="email"
                placeholder="johndoe@example.com"
                onChange={handlekuchange}
                required
                />
 
                <labe>phone</labe>

                <input
                type="tel"
                name="phone"
                placeholder="0712345689"
                onChange={handlekuchange}
                required
                />

                <label>Date</label>

                <input
                type="date"
                name="datep"
                onChange={handlekuchange}
                required
                />
                <br/>
                <Button type="submit" variant="primary">
                <CiShoppingTag /> Request 
                </Button>
            </form>
                </Row>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default Lookup;
