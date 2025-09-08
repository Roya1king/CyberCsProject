import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import Hero from './components/home/Hero'
import LivePacketsPage from './components/detailsPage/LivePacketsPage'

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route>
        <Route path='/' element={<Hero/>}/>
        <Route path="/live-packet-page" element={<LivePacketsPage />} />
      </Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
