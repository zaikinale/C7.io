import { BrowserRouter, Routes, Route } from 'react-router-dom'

// base
import Lending from './pages/Lending'

// auth
import Error from './pages/auth/Error'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// user
import Dashboard from './pages/user/Dashboard'
import Calendar from './pages/user/Calendar'
import Tasks from './pages/user/Tasks'
import Analytic from './pages/user/Analytic'
import Notes from './pages/user/Notes'
import Profile from './pages/user/Profile'
import Settings from './pages/user/Settings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Lending />}/>
        <Route path={'/login'} element={<Login />}/>
        <Route path={'/register'} element={<Register />}/>
        <Route path={'/dashboard'} element={<Dashboard />}/>
        <Route path={'/analytic'} element={<Analytic />}/>
        <Route path={'/tasks'} element={<Tasks />}/>
        <Route path={'/calendar'} element={<Calendar />}/>
        <Route path={'/notes'} element={<Notes />}/>
        <Route path={'/profile'} element={<Profile />}/>
        <Route path={'/settings'} element={<Settings />}/>

        <Route path={'*'} element={<Error />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
