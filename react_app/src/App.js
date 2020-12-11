import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostSummaryPage from './pages/SummaryPage';
import PostDetailsPage from './pages/DetailsPage';
import SaveListPage from './pages/SaveListPage';

import NavBar from './components/NavBar';
import LoggedIn from './components/LoginContext';
// import PrivateRoute from './components/PrivateRoute';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const defaultLoginInfo = {
    loggedIn: false,
    username: null,
    userId: null,
    adminAccess: false,
  };

  const localUser = localStorage.getItem('loginInfo');
  const loginInfo = localUser ? JSON.parse(localUser) : defaultLoginInfo;

  const [loggedIn, setLoggedIn] = useState(loginInfo);

  const setLoggedInHelper = (loggedIn, username, userId, adminAccess) => {
    const loginObj = {
      loggedIn: loggedIn,
      username: username,
      userId: userId,
      adminAccess: adminAccess,
    };
    localStorage.setItem('loginInfo', JSON.stringify(loginObj));
    setLoggedIn(loginObj);
  };

  return (
    <LoggedIn.Provider value={{ loggedIn, setLoggedInHelper }}>
      <Router>
        <div className="App"></div>
        <NavBar />
        <div>
          <Switch>
            <Route path="/" component={PostSummaryPage} exact />
            <Route path="/posts/details/:id" component={PostDetailsPage} />
            <Route path="/admin" component={AdminPage} />
            <Route path="/savelist" component={SaveListPage} />
            <Route path="/login" render={(props) => <LoginPage {...props} />} />
            <Route path="/register" component={RegisterPage} />
          </Switch>
        </div>
      </Router>
    </LoggedIn.Provider>
  );
}

export default App;
