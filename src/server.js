const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc
} = require("firebase/firestore");
const express = require('express');

import firebaseConfig from "./firebaseconfig"

const app = express();
const port = 8080;

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Route to handle data saving
app.post('/manangos', async (req, res) => {
  try {
    const dataArray = req.body.data;

    // Assuming the first element in dataArray contains field names
    const fieldNames = dataArray[0];
    const vehiclesCollection = collection(db, 'loanforms');

    // Start from index 1 to skip the header row
    for (let i = 1; i < dataArray.length; i++) {
      const rowData = dataArray[i];
      const docData = {};

      // Create an object using the field names from the header row
      for (let j = 0; j < fieldNames.length; j++) {
        const fieldName = fieldNames[j];
        const cellValue = rowData[j];
        docData[fieldName] = cellValue;
      }

      // Add a new document to the 'loanforms' collection
      await addDoc(vehiclesCollection, docData);
    }

    res.status(200).send('Data saved successfully');
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.post('/takeout', async (req, res) => {
  try {
    const { name, email, phone, datep, document, state } = req.body;

    // Assuming 'loanslist' is the name of your Firestore collection
    const loansCollection = collection(db, 'users');

    // Add a new document to the 'loanslist' collection
    await addDoc(loansCollection, {
      name,
      email,
      phone,
      datep,
      document,
      state,
    });

    res.status(200).send('Data inserted successfully');
    console.log('data inserted')
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send('Error inserting data');
  }
});

// PUT route to update a document in Firestore
app.put('/takke/:Id', async (req, res) => {
  try {
    const IdToUpdate = req.params.Id;
    const newstate = 'unavailable';

    // Assuming 'loanslist' is the name of your Firestore collection
    const loansCollection = collection(db, 'loanslist');

    // Find and update the document with the specified Id
    const querySnapshot = await loansCollection.where('Id', '==', IdToUpdate).get();

    if (querySnapshot.empty) {
      res.status(404).send('Document not found');
      return;
    }

    const loanDoc = querySnapshot.docs[0];
    await loanDoc.ref.update({
      availability: newstate,
    });

    res.status(200).send('Data updated successfully');
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).send('Error updating data');
  }
});
app.get('/info', async (req, res) => {
  const searchTerm = req.query.search;

  try {
    // Get a reference to the loanforms collection
    const loanformsCollection = collection(db, 'loanforms');

    // Query the collection for documents where customer_id is equal to searchTerm
    const querySnapshot = await getDocs(query(loanformsCollection, where('Customer_id', '==', searchTerm)));

    // Extract the data from the query results
    const searchResults = querySnapshot.docs.map(doc => doc.data());

    res.json(searchResults);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error', error });
  }
});

const getAllusersFromFirestore = async () => {
  try {
    const bookCollection = collection(db, 'users',  );
    const querySnapshot = await getDocs(bookCollection);

    const Users = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      Users.push(userData);
    });

    return Users;
  } catch (error) {
    console.error('Error fetching cars: ', error);
    throw error;
  }
};

app.get('/people', async (req, res) => {
  try {
    const Users = await getAllusersFromFirestore();
    res.status(200).json(Users);
  } catch (error) {
    console.error('Error getting booking data: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/ital', async (req, res) => {
  try {
    const { Id } = req.body;

    // Check if Id is provided in the request
    if (!Id) {
      return res.status(400).json({ error: 'Missing Id in the request body' });
    }

    // Get the car document based on the Id
    const carsCollection = collection(db, 'loanforms');
    const querySnapshot = await getDocs(carsCollection);
    let carDocRef;

    querySnapshot.forEach((doc) => {
      const carData = doc.data();
      if (carData.Id === Id) {
        carDocRef = doc.ref;
      }
    });

    // Check if a car with the specified Id was found
    if (!carDocRef) {
      return res.status(404).json({ error: 'Car not found with the specified Id' });
    }

    // Update the car document to set the state to "unavailable"
    await updateDoc(carDocRef, {
      Availability: 'unavailable',
    });

    res.status(200).json({ message: 'Car marked as unavailable' });
    console.log('set to unavailable')
  } catch (error) {
    console.error('Error marking car as unavailable:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/samosa', async (req, res) => {
  try {
    const { document, name, email, datep } = req.body;

    // Check if Id is provided in the request
    if (!document || !name || !email || !datep ){
      return res.status(400).json({ error: 'Missing Id in the request body' });
    }

    // Get the car document based on the Id
    const carsCollection = collection(db, 'users');
    const querySnapshot = await getDocs(carsCollection);
    let carDocRef;

    querySnapshot.forEach((doc) => {
      const carData = doc.data();
      if (carData.document  === document && carData.name === name && carData.email === email && carData.datep === datep )
 {
        carDocRef = doc.ref;
      }
    });

    // Check if a car with the specified Id was found
    if (!carDocRef) {
      return res.status(404).json({ error: 'Car not found with the specified Id' });
    }

    // Update the car document to set the state to "unavailable"
    await updateDoc(carDocRef, {
      state: 'returned',
    });

    res.status(200).json({ message: 'Car marked as unavailable' });
    console.log('returned')
  } catch (error) {
    console.error('Error marking car as unavailable:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/tingua', async (req, res) => {
  try {
    const { Id } = req.body;

    // Check if Id is provided in the request
    if (!Id) {
      return res.status(400).json({ error: 'Missing Id in the request body' });
    }

    // Get the car document based on the Id
    const carsCollection = collection(db, 'loanforms');
    const querySnapshot = await getDocs(carsCollection);
    let carDocRef;

    querySnapshot.forEach((doc) => {
      const carData = doc.data();
      if (carData.Id === Id) {
        carDocRef = doc.ref;
      }
    });

    // Check if a car with the specified Id was found
    if (!carDocRef) {
      return res.status(404).json({ error: 'Car not found with the specified Id' });
    }

    // Update the car document to set the state to "unavailable"
    await updateDoc(carDocRef, {
      Availability: 'available',
    });

    res.status(200).json({ message: 'Car marked as unavailable' });
    console.log('available')
  } catch (error) {
    console.error('Error marking car as unavailable:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Import necessary Firebase modules
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

// Route to handle authentication
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const auth = getAuth(firebaseApp);
    await signInWithEmailAndPassword(auth, email, password);

    res.status(200).send('Authentication successful');
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).send('Authentication failed');
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
