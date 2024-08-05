'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { AppBar, Box, Modal, Button, Typography, Stack, TextField, Toolbar, IconButton, Card, CardContent, CardActions } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { firestore } from '../firebase'
import { collection, getDocs, query, deleteDoc, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'

const ItemCard = ({ name, quantity, onRemove }) => (
  <Card sx={{ width: '100%', mb: 2 }}>
    <CardContent>
      <Typography variant="h5" component="div">
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Quantity: {quantity}
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" variant="contained" onClick={() => onRemove(name)}>Remove Item</Button>
    </CardActions>
  </Card>
)

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [itemName, setItemName] = useState('')
  const [open, setOpen] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Add Item
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // Search Bar
  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase())
  }

    // Update Inventory
    useEffect(() => {
      updateInventory()
    }, [])

  // Update Inventory
  const updateInventory = async () => {
    try {
      const snapshot = collection(firestore, 'inventory')
      const docs = await getDocs(snapshot)
      const inventoryList = []
      docs.forEach(doc => {
        inventoryList.push({
          name: doc.id,
          ...doc.data()
        });
      });
      setInventory(inventoryList)
      console.log('Inventory List:', inventoryList); // test
      setError(null)
    } catch (error) {
      console.error('Error updating inventory:', error)
      if (error.code === 'permission-denied') {
        setError('Error 403: Permission denied. Please check your authentication.')
      } else {
        setError('Error 400: Bad request. Please try again later.')
      }
    }
  }

  // Add Item
  const addItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        await updateDoc(docRef, { quantity: quantity + 1 })
      } else {
        await setDoc(docRef, { quantity: 1 })
      }

      await updateInventory()
      setError(null)
    } catch (error) {
      console.error('Error adding item:', error)
      setError('Error 400: Bad request. Unable to add item.')
    }
  }

  // Remove Item
  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        if (quantity === 1) {
          await deleteDoc(docRef)
        } else {
          await updateDoc(docRef, { quantity: quantity - 1 })
        }
      }

      await updateInventory()
      setError(null)
    } catch (error) {
      console.error('Error removing item:', error)
      setError('Error 400: Bad request. Unable to remove item.')
    }
  }

  // Filter Inventory
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Inventory Card
  const InventoryCard = ({ name, quantity, onRemove }) => (
    <Card sx={{ width: '100%', mb: 2 }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" component="div">
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quantity: {quantity}
          </Typography>
        </Box>
        <CardActions>
          <Button size="small" variant="contained" onClick={() => onRemove(name)}>Remove Item</Button>
        </CardActions>
      </CardContent>
    </Card>
  )

  // Contents
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* Navbar */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              {/* <MenuIcon /> */}
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Pantry Inventory
            </Typography>
            {/* <Button color="inherit">Login</Button> */}
          </Toolbar>
        </AppBar>
      </Box>

      {/* Main Content */}
      <Box flexGrow={1} display="flex" justifyContent="center" alignItems="center" flexDirection="column" gap={2} py={4}>
        {error && (
          <Typography variant="h6" color="error" textAlign="center">
            {error}
          </Typography>
        )}
        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width="100%"
            maxWidth="400px"
            bgcolor="white"
            border="2px solid #000"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{
              transform: "translate(-50%, -50%)",
            }}
          >
            <Typography variant="h6">Add Item</Typography>
            <Box width="100%" display="flex" flexDirection="column" gap={2}>
              <TextField
                variant='outlined'
                fullWidth
                label="Item Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button variant='contained' onClick={() => {
                if (itemName.trim()) {
                  addItem(itemName.trim().toLowerCase())
                  setItemName('')
                  handleClose()
                }
              }}>Add</Button>
            </Box>
          </Box>
        </Modal>

        {/* Search Bar */}
        <Box display="flex" justifyContent="center" alignItems="center" border="1px solid #333" borderRadius={1}>
          <TextField
            variant="standard"
            label="Search Item"
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              disableUnderline: true,
            }}
          />
          <Button variant='contained' sx={{ borderRadius: '0 4px 4px 0' }}>Search</Button>
        </Box>

        {/* Inventory List */}
        <Button variant='contained' onClick={handleOpen}>Add Item</Button>
        <Box border="1px solid #333" borderRadius={2} width="800px" height="400px" display="flex" flexDirection="column">
          <Box width="100%" height="100px" bgcolor="#ADD8E6" display="flex" justifyContent="center" alignItems="center">
            <Typography variant="h2" color="#333">Inventory</Typography>
          </Box>
          <Box flexGrow={1} overflow="auto">
            <Stack width="100%" spacing={2} p={2}>
              {filteredInventory.length > 0 ? (
                filteredInventory.map(({ name, quantity }) => (
                  <InventoryCard key={name} name={name} quantity={quantity} onRemove={removeItem} />
                ))
              ) : (
                <Typography variant="h3" color="#333" textAlign="center" padding={5}>
                  No items in inventory. Add some items to get started!
                </Typography>
              )}
            </Stack>
          </Box>
        </Box>
      </Box>
      
      {/* Footer */}
      <Box bgcolor="#2596be" p={3} mt="auto">
        <Typography variant="body1" color="#333" textAlign="center">
          &#169; {new Date().getFullYear()} Pantry Inventory
        </Typography>
      </Box>
    </Box>
  );
}