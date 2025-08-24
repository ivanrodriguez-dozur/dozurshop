import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import HomePage from './components/HomePage';
import './styles/main.css';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact>
                    <WelcomePage />
                </Route>
                <Route path="/home" exact>
                    <HomePage />
                </Route>
                <Redirect to="/" />
            </Switch>
        </Router>
    );
};

export default App;