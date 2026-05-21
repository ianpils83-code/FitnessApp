import React, { useState, useEffect } from 'react'
import Nav        from './components/Nav'
import Footer     from './components/Footer'
import Home       from './pages/Home'
import Plans      from './pages/Plans'
import Library    from './pages/Library'
import Calculator from './pages/Calculator'
import Diet       from './pages/Diet'
import Progress   from './pages/Progress'
import Records    from './pages/Records'
import History    from './pages/History'
import Macros     from './pages/Macros'
import RestTimer  from './components/RestTimer'

export default function App() {
  const [page,  setPage]  = useState('home')
  const [theme, setTheme] = useState(() => localStorage.getItem('ff_theme') || 'dark')

  // Apply theme to <html> so CSS variables kick in everywhere
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ff_theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  const renderPage = () => {
    switch (page) {
      case 'plans':      return <Plans />
      case 'library':    return <Library />
      case 'calculator': return <Calculator />
      case 'diet':       return <Diet setPage={setPage} />
      case 'progress':   return <Progress />
      case 'records':    return <Records />
      case 'history':    return <History />
      case 'macros':     return <Macros />
      default:           return <Home setPage={setPage} />
    }
  }

  return (
    <div className="app-root">
      <Nav page={page} setPage={setPage} theme={theme} toggleTheme={toggleTheme} />
      <main className="container">{renderPage()}</main>
      <Footer />
      <RestTimer />
    </div>
  )
}
