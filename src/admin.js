import React, {useState, useEffect} from "react";
import {Table, Container, Button, Row, Modal} from "react-bootstrap"
import { IoMdReturnLeft } from "react-icons/io";
import ExcelRenderComponent from "./upload";

function Admin(){
    const [showModal, setShowModal]= useState(false)
    const [selectedItem, setSelectedItem] = useState(null);
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('/people')
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch((err) => console.error('kunashida manze', err));
    },[]);
    const Meza =() =>{
        return data.map((user, index) => (
            <tr key={index}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.datep}</td>
                <td>{user.document}</td>
                <td>
                    {user.state === 'unreturned'?(
                    <Button variant="primary" onClick={() => handleReturning(user)}>
                <IoMdReturnLeft /> return
                </Button>):(
                    <Button variant="success" disabled>
                        returned
                    </Button>
                )}
                </td>
            </tr>
        ));
    };
    
    const handleReturning = (item) =>{
        setShowModal(true);
        setSelectedItem(item);
        
    };

    const handleApprove = async () => {
        try {
          // First fetch request
          const unres = await fetch('/tingua', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Id: selectedItem.document, // Assuming 'document' contains the plates
            }),
          });
    
          if (!unres.ok) {
            console.error("Error marking car as rejected in '/makeunavailable'");
            // Handle the error condition for '/makeunavailable'
            return;
          }
    
          // Extract necessary data from the response
       
          
    
          // Second fetch request to '/samosa'
          const samosaResponse = await fetch('/samosa', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              document: selectedItem.document,
              name: selectedItem.name,
              datep: selectedItem.datep,
              state: selectedItem.state,
              email: selectedItem.email,
              phone: selectedItem.phone
            }),
          });
    
          if (!samosaResponse.ok) {
            console.error("Error marking car as rejected in '/samosa'");
            // Handle the error condition for '/samosa'
            return;
          }
    
          // Now, use the extracted data to send an email

    
          console.log('Car marked as rejected');
          alert('The document has been returned');
          setShowModal(false);
          window.location.reload();
          // You may want to update the state or perform other actions upon success
        } catch (error) {
          console.error('Error marking car as rejected:', error);
          // Handle the error condition
        }
      };

          

    const handleCloseModal = () =>{
        setShowModal(false);
        setSelectedItem(null);
    };


    return(
        <Container>  <ExcelRenderComponent/>
            <h1> Taken Documents</h1>
            <Table variant="dark">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Date</th>
                        <th>Document</th>
                        <th>return</th>
                    </tr>
                </thead>
                <tbody>{Meza()}</tbody>
                
            </Table>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Returned document</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedItem && (
                        <div>
                            <Row>
                                <p>Are you sure you the document with the following loan ID is returned</p>
                                <ul>
                                    <li>Loan Id :{selectedItem.document} </li>
                                    <li>take by :{selectedItem.name} </li>
                                    <li>on datep :{selectedItem.datep}</li>
                                </ul>
                            </Row>
                            <Button variant='primary' onClick={handleApprove}>
                            <IoMdReturnLeft /> Yes
                            </Button>
                        </div>
                    )}
                </Modal.Body>
                <Button variant="primary" onClick={handleCloseModal}>
                        close
                </Button>
            </Modal>
          
        </Container>
    )
}
export default Admin;