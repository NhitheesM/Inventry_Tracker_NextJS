"use client";  // Add this directive at the top

import { Box, Button, Stack, Typography, Modal, TextField } from '@mui/material';
import { firestore } from '@/firebase';
import { useEffect, useState } from 'react';
import { collection, getDoc, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  gap: 4,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [itemName, setItemName] = useState('');
  const [itemQty, setItemQty] = useState('');

  const [searchQry, setSearchQry] = useState('');

  const updateInventory = async (query = '') => {
    const snapshot = collection(firestore, "inventory");
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      const itemName = doc.id.toLowerCase();
      if (itemName.includes(query.toLowerCase())) {
        inventoryList.push({ name: doc.id, quantity: doc.data().quantity });
      }
    });
    console.log(inventoryList);
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (itemName, itemQty) => {
    const inventoryRef = doc(firestore, 'inventory', itemName);
  
    try {
      // Fetch the existing document
      const docSnap = await getDoc(inventoryRef);
  
      if (docSnap.exists()) {
        // If the document exists, get the current quantity
        const currentQty = docSnap.data().quantity;
  
        // Add the new quantity to the existing quantity
        const updatedQty = Number(currentQty) + Number(itemQty);
  
        // Update the document with the new quantity
        await setDoc(inventoryRef, { quantity: updatedQty });
      } else {
        // If the document does not exist, create it with the provided quantity
        await setDoc(inventoryRef, { quantity: Number(itemQty) });
      }
  
      updateInventory();
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };
  

  const removeItem = async (itemName) => {
    const itemRef = doc(firestore, 'inventory', itemName);  // Reference the specific document by ID
    await deleteDoc(itemRef);  // Use deleteDoc to remove the document
    updateInventory();
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Stack direction={'row'} spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant='outlined'
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <TextField
                id="outlined-basic"
                label="Qty"
                variant='outlined'
                fullWidth
                value={itemQty}
                onChange={(e) => setItemQty(e.target.value)}
              />
              <Button variant="outlined" onClick={() => {
                addItem(itemName, itemQty);
                setItemName('');
                setItemQty('');
                handleClose();
              }}
              >Add</Button>
            </Stack>
          </Typography>
        </Box>
      </Modal>

      <Stack direction={'row'} spacing={50}>
        <Button variant="contained" onClick={handleOpen}>ADD</Button>
        <Stack direction={'row'} spacing={2}>
          <TextField 
            id="outlined-basic" 
            label="Search" 
            variant='outlined'
            onChange={(e)=> updateInventory(e.target.value)}
          />
        </Stack>
      </Stack>
      <Box border="1px solid #333">
        <Box
          width="800px"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h3" color="#333" textAlign="center">
            Inventory Items
          </Typography>
        </Box>
        <Stack
          width="800px"
          height="300px"
          spacing={2}
          overflow="auto"
        >
          {inventory.map((i) => (
            <Stack key={i.name} direction={'row'} spacing={2} justifyContent={'center'} alignContent={'space-between'}>
              <Box
                width="100%"
                minHeight="80px"
                display="flex"
                justifyContent="space-between"
                paddingX={5}
                alignItems="center"
                bgcolor="#f0f0f0"
              >
                <Typography variant="h4" color="#333" textAlign="center" sx={{ flex: 1 }}>
                  {i.name.charAt(0).toUpperCase() + i.name.slice(1)}
                </Typography>
                <Typography variant="h6" color="#333" textAlign="center" sx={{ flex: 0.2, textAlign: 'left' }}>
                  Qty: {i.quantity}
                </Typography>
                <Button variant="contained" onClick={() => { removeItem(i.name); }} sx={{ flex: 0.1 }}>
                  Remove
                </Button>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
