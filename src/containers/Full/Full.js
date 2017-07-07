import React, ***REMOVED*** Component ***REMOVED*** from 'react';
import ***REMOVED*** Link, Switch, Route, Redirect ***REMOVED*** from 'react-router-dom'
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';

import Dashboard from '../../views/Dashboard/'
import Charts from '../../views/Charts/'
import Widgets from '../../views/Widgets/'
import Buttons from '../../views/Components/Buttons/'
import Cards from '../../views/Components/Cards/'
import Forms from '../../views/Components/Forms/'
import Modals from '../../views/Components/Modals/'
import SocialButtons from '../../views/Components/SocialButtons/'
import Switches from '../../views/Components/Switches/'
import Tables from '../../views/Components/Tables/'
import Tabs from '../../views/Components/Tabs/'
import FontAwesome from '../../views/Icons/FontAwesome/'
import SimpleLineIcons from '../../views/Icons/SimpleLineIcons/'

class Full extends Component ***REMOVED***
  render() ***REMOVED***
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar ***REMOVED***...this.props***REMOVED***/>
          <main className="main">
            <Breadcrumb />
            <div className="container-fluid">
              <Switch>
                <Route path="/dashboard" name="Dashboard" component=***REMOVED***Dashboard***REMOVED***/>
                <Route path="/components/buttons" name="Buttons" component=***REMOVED***Buttons***REMOVED***/>
                <Route path="/components/cards" name="Cards" component=***REMOVED***Cards***REMOVED***/>
                <Route path="/components/forms" name="Forms" component=***REMOVED***Forms***REMOVED***/>
                <Route path="/components/modals" name="Modals" component=***REMOVED***Modals***REMOVED***/>
                <Route path="/components/social-buttons" name="Social Buttons" component=***REMOVED***SocialButtons***REMOVED***/>
                <Route path="/components/switches" name="Swithces" component=***REMOVED***Switches***REMOVED***/>
                <Route path="/components/tables" name="Tables" component=***REMOVED***Tables***REMOVED***/>
                <Route path="/components/tabs" name="Tabs" component=***REMOVED***Tabs***REMOVED***/>
                <Route path="/icons/font-awesome" name="Font Awesome" component=***REMOVED***FontAwesome***REMOVED***/>
                <Route path="/icons/simple-line-icons" name="Simple Line Icons" component=***REMOVED***SimpleLineIcons***REMOVED***/>
                <Route path="/widgets" name="Widgets" component=***REMOVED***Widgets***REMOVED***/>
                <Route path="/charts" name="Charts" component=***REMOVED***Charts***REMOVED***/>
                <Redirect from="/" to="/dashboard"/>
              </Switch>
            </div>
          </main>
          <Aside />
        </div>
        <Footer />
      </div>
    );
  ***REMOVED***
***REMOVED***

export default Full;
