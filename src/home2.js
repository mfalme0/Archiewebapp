import React, { useState, useEffect } from 'react';
import { Container, Row, Table, Button, Modal } from 'react-bootstrap';
import { CiSearch, CiServer } from 'react-icons/ci';
import { CiShoppingTag } from 'react-icons/ci';

function Lookup() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const returnconstant=true;

  
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
  const handlesubmit = async (e) =>{
    e.preventDefault();
    
    try{
        const response = await fetch("/takeout",{
            method :"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify({
                name: formdata.name,
                email: formdata.email,
                phone: formdata.phone,
                datep: formdata.datep,
                document: formdata.document,
                state: formdata.state,
            }),
        });
        if (response.ok){
            console.log("ime ingia");

            setShowModal(false);
        }
        else{
            console.log("buda imeinanama")
        }
    }
    catch (error){
        console.log("rada msee" + error);
    }
  };

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
        <td>{result.instanceid}</td>
        <td>{result.Id}</td>
        <td>{result.CustomerId}</td>
        <td>{result.Name}</td>
        <td>{result.loanAmount}</td>
        <td>{result.state}</td>
        <td>{result.availability}</td>
        <td>
            {result.availability === 'available' ?(
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
