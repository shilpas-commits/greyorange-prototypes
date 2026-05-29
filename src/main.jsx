import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import ReservationPrototype from './prototypes/inventory-management/ReservationPrototype'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/inventory/reservation" element={<ReservationPrototype />} />
    </Routes>
  </BrowserRouter>
)
