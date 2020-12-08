import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// import PrivateRoute from './components/PrivateRoute';

import AdminPage from './pages/AdminPage';
// import RegisterPage from '.pages/RegisterPage';
// import LoginPage from './pages/LoginPage';
import PostSummaryPage from './pages/SummaryPage';
import PostDetailsPage from './pages/DetailsPage';
import NavBar from './components/NavBar';
// import WatchListPage from './pages/WatchListPage';

function App() {
  return (
    <Router>
      <div className="App"></div>
      <NavBar />
      <div>
        <Switch>
          <Route path="/" component={PostSummaryPage} exact />
          <Route path="/posts/details/:id" component={PostDetailsPage} />
          <Route path="/admin" component={AdminPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
