import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Signup from './User/Signup';
import Login from './User/Login';
import Home from './components/Home';
import JobDetailPage from './JobDetailPage';

import Profile from './Profile';
import ApplyJob from './ApplyJob';
import PostJob from './PostJob/NewPost';
import DashboardJob from './PostJob/dashboardJob';
import RecruiterSignup from './PostJob/RecruiterSIgnup';
import NewPost from './PostJob/NewPost';
import AvailableJob from './PostJob/AvilableJob';
import Application from './PostJob/Application';
import Sidebar from './components/Sidebar';
import Applicant from './PostJob/Applicant';
import ViewJob from './PostJob/ViewJob';
import UpdatePost from './PostJob/UpdatePost';
import UpdateJob from './PostJob/UpdateJob';
function App() {
  return (
    <Router>
      <Header />
      
      <Routes>
        <Route path="/home" element={<Home/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/viewJob"element={<ViewJob/>}/>
        
        <Route path="/login" element={<Login />} />
          <Route path="/job/:id" element={<JobDetailPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/applyjob/:id"element={<ApplyJob/>}/>
          <Route path="/newpost"element={<NewPost/>}/>
             <Route path="/dashboardjob"element={<DashboardJob/>}/>
             <Route path="/recruiter-signup"element={<RecruiterSignup/>}/>
             <Route path="/avilablejob"element={<AvailableJob/>}/>
             <Route path="/application"element={<Application/>}/>
             <Route path="/sidebar"element={<Sidebar/>}/>
                <Route path="/applicant/:jobId"element={<Applicant/>}/>
                <Route path="/updatepost"element={<UpdatePost/>}/>
                <Route path="/updatejob/:id"element={<UpdateJob/>}/>
      </Routes>
    </Router>
  );
}

export default App;
