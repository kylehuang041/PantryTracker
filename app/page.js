'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Box, Modal, Typography } from '@mui/material'
import { firestore } from '../firebase'
import { collection, getDocs, query, deleteDoc, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [itemName, setItemName] = useState('')
  const [open, setOpen] = useState(false)

  const updateInventory = async () => {
    const snapshot = collection(firestore, 'inventory')
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach(doc => {
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      })
    })
    setInventory(inventoryList)
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await updateDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }

    await updateInventory()
  }

  const removeItem = async (item) => {
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
  }

  useEffect(() => {
    updateInventory()
  }, [])

  return (
    <Box width="100vw" height="100vh" display="flex" justifyContent="center" alignItems="center" flexDirection="column" gap={2}>
      <Modal></Modal>
      <Typography variant="h1">Pantry Tracker</Typography>
    </Box>
  );
}