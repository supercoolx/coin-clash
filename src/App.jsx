import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layout/Layout'
import Home from './pages/Home'
import Create from './pages/Create'
import Trade from './pages/Trade'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/trade/:tokenMint/:rank" element={<Trade />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
