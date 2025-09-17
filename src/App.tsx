import './App.css'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { JobsPage } from './pages/JobsPage'
import { AppProvider } from './providers/AppProvider'
import { CandidateListPages } from './pages/CandidatesListPage'
import { AssessmentBuilder } from './pages/AssessmentBuilderPage'
import { AssessmentRuntime } from './pages/AssessmentRuntime'
import JobDetailPage from './pages/JobDetailsPage'
import CandidateProfilePage from './pages/CandidateProfilePage'

function App() {

  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Navigate to="/jobs"/>}> </Route>
          <Route path='/jobs' element={<JobsPage />}> </Route>
          <Route path="/jobs/:jobid" element={<JobDetailPage />} />
          <Route path='/candidates' element={<CandidateListPages />}> </Route>
          <Route path='/candidates/:id' element={<CandidateProfilePage />}> </Route>
          <Route path='/assessment' element={<AssessmentBuilder />}> </Route>
          <Route path='/assessmentsRuntime' element={<AssessmentRuntime />}> </Route>
        </Routes>
      </Router>
    </AppProvider>
  )
}

export default App
