import './App.css'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { JobsPage } from './pages/JobsPage'
import { AppProvider } from './providers/AppProvider'

function App() {

  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Navigate to="/jobs"/>}> </Route>
          <Route path='/jobs' element={<JobsPage/>}> </Route>
        </Routes>
      </Router>
    </AppProvider>
  )
}

export default App
