import React, {useState, useEffect} from "react";
import {Table, Container, Button, Row, Modal} from "react-bootstrap"
import { IoMdReturnLeft } from "react-icons/io";

function Admin(){
    const [showModal, setShowModal]= useState(false)
    const [selectedItem, setSelectedItem] = useState(null);
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('/everything')
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
                    {user.state ==='true'?(
                    <Button variant="primary" onClick={() => handleReturning(user)}>
                <IoMdReturnLeft /> return
                </Button>):(
                    <Button variant="success">
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

    useEffect(() => {
        const updateState = async () => {
            try{
                if (selectedItem && selectedItem.document){
                    const response = await fetch(`/return/${selectedItem.document}`, {
                        method: 'PUT'});
                    if (response.ok){
                        
                        console.log('mambo shwari')
                        setShowModal(false);
                        
                    }
                    else{
                        console.log('kuna problem')
                    }
                }}catch (err){
                    console.log('acha ufala', + err);
                }
            }; if (selectedItem){
                updateState();
            }
        }, [selectedItem]);

        useEffect(() => {
            const updateState1 = async () => {
              try {
                if (selectedItem && selectedItem.name, selectedItem.datep, selectedItem.document) {
                   
                  const response = await fetch(`/rudisha/${selectedItem.name}/${selectedItem.datep}/${selectedItem.document}`, {
                    method: 'PUT',
                  });
          
                  if (response.ok) {
                  
                    
                    console.log('Mambo shwari');
                    setShowModal(false);
                  } else {
                    console.log('Kuna problem');
                  }
                }
              } catch (err) {
                console.log('Acha ufala', err);
              }
            };
          
            if (selectedItem ) {
              updateState1();
            }
          }, [selectedItem]);
          

    const handleCloseModal = () =>{
        setShowModal(false);
        setSelectedItem(null);
    };


    return(
        <Container>
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
                                    <li>on date :{selectedItem.datep}</li>
                                </ul>
                            </Row>
                            <Button variant='primary' type="submit">
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