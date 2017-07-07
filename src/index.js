import React from 'react';
import ReactDOM from 'react-dom';
import ***REMOVED*** HashRouter, Route, Switch ***REMOVED*** from 'react-router-dom'
import ***REMOVED*** createBrowserHistory ***REMOVED*** from 'history';

// Containers
import Full from './containers/Full/'

// Views
import Login from './views/Pages/Login/'
import Register from './views/Pages/Register/'
import Page404 from './views/Pages/Page404/'
import Page500 from './views/Pages/Page500/'

const history = createBrowserHistory();

ReactDOM.render((
  <HashRouter history=***REMOVED***history***REMOVED***>
    <Switch>
      <Route exact path="/login" name="Login Page" component=***REMOVED***Login***REMOVED***/>
      <Route exact path="/register" name="Register Page" component=***REMOVED***Register***REMOVED***/>
      <Route exact path="/404" name="Page 404" component=***REMOVED***Page404***REMOVED***/>
      <Route exact path="/500" name="Page 500" component=***REMOVED***Page500***REMOVED***/>
      <Route path="/" name="Home" component=***REMOVED***Full***REMOVED***/>
    </Switch>
  </HashRouter>
), document.getElementById('root'))
