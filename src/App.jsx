import React, { useState } from 'react'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Plans from './pages/Plans'
import Library from './pages/Library'
import Calculator from './pages/Calculator'
import Diet from './pages/Diet'
import Progress from './pages/Progress'
import Records  from './pages/Records'
import RestTimer from './components/RestTimer'

export default function App() {
  const [page, setPage] = useState('home')

  const renderPage = () => {
    switch (page) {
      case 'plans':
        return <Plans />
      case 'library':
        return <Library />
      case 'calculator':
        return <Calculator />
      case 'diet':
        return <Diet />
      case 'progress':
        return <Progress />
      case 'records':
        return <Records />
      default:
        return <Home />
    }
  }

  return (
    <div className="app-root">
      <Nav page={page} setPage={setPage} />
      <main className="container">{renderPage()}</main>
      <Footer />
      <RestTimer />
    </div>
  )
}
