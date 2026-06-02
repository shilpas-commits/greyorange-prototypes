import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import ReservationPrototype from './prototypes/inventory-management/ReservationPrototype'
import HHDRunnerApp from './prototypes/bulk-order-picking/HHDRunnerApp'
import PickBackOperatorUI from './prototypes/bulk-order-picking/PickBackOperatorUI'
import MDOutboundView from './prototypes/bulk-order-picking/MDOutboundView'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/inventory/reservation" element={<ReservationPrototype />} />
      <Route path="/bulk-order/hhd-runner" element={<HHDRunnerApp />} />
      <Route path="/bulk-order/pick-back" element={<PickBackOperatorUI />} />
      <Route path="/bulk-order/md-outbound" element={<MDOutboundView />} />
    </Routes>
  </BrowserRouter>
)
