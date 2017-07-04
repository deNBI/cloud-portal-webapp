import React, ***REMOVED*** Component ***REMOVED*** from 'react';
import ***REMOVED*** TabContent, TabPane, Nav, NavItem, NavLink ***REMOVED*** from 'reactstrap';
import classnames from 'classnames';

class Tabs extends Component ***REMOVED***

  constructor(props) ***REMOVED***
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = ***REMOVED***
      activeTab: '1'
    ***REMOVED***;
  ***REMOVED***

  toggle(tab) ***REMOVED***
    if (this.state.activeTab !== tab) ***REMOVED***
      this.setState(***REMOVED***
        activeTab: tab
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***

  render() ***REMOVED***
    return (
      <div className="animated fadeIn">
        <div className="row">
          <div className="col-md-6 mb-4">
            <Nav tabs>
              <NavItem>
                <NavLink
                  className=***REMOVED***classnames(***REMOVED*** active: this.state.activeTab === '1' ***REMOVED***)***REMOVED***
                  onClick=***REMOVED***() => ***REMOVED*** this.toggle('1'); ***REMOVED******REMOVED***
                >
                  Home
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className=***REMOVED***classnames(***REMOVED*** active: this.state.activeTab === '2' ***REMOVED***)***REMOVED***
                  onClick=***REMOVED***() => ***REMOVED*** this.toggle('2'); ***REMOVED******REMOVED***
                >
                  Profile
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className=***REMOVED***classnames(***REMOVED*** active: this.state.activeTab === '3' ***REMOVED***)***REMOVED***
                  onClick=***REMOVED***() => ***REMOVED*** this.toggle('3'); ***REMOVED******REMOVED***
                >
                  Messages
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab=***REMOVED***this.state.activeTab***REMOVED***>
              <TabPane tabId="1">
                1. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </TabPane>
              <TabPane tabId="2">
                2. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </TabPane>
              <TabPane tabId="3">
                2. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </TabPane>
            </TabContent>
          </div>
          <div className="col-md-6 mb-4">
            <Nav tabs>
              <NavItem>
                <NavLink
                  className=***REMOVED***classnames(***REMOVED*** active: this.state.activeTab === '1' ***REMOVED***)***REMOVED***
                  onClick=***REMOVED***() => ***REMOVED*** this.toggle('1'); ***REMOVED******REMOVED***
                >
                  <i className="icon-calculator"></i>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className=***REMOVED***classnames(***REMOVED*** active: this.state.activeTab === '2' ***REMOVED***)***REMOVED***
                  onClick=***REMOVED***() => ***REMOVED*** this.toggle('2'); ***REMOVED******REMOVED***
                >
                  <i className="icon-basket-loaded"></i>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className=***REMOVED***classnames(***REMOVED*** active: this.state.activeTab === '3' ***REMOVED***)***REMOVED***
                  onClick=***REMOVED***() => ***REMOVED*** this.toggle('3'); ***REMOVED******REMOVED***
                >
                  <i className="icon-pie-chart"></i>
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab=***REMOVED***this.state.activeTab***REMOVED***>
              <TabPane tabId="1">
                1. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </TabPane>
              <TabPane tabId="2">
                2. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </TabPane>
              <TabPane tabId="3">
                2. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </TabPane>
            </TabContent>
          </div>
          <div className="col-md-6 mb-4">
            <Nav tabs>
              <NavItem>
                <NavLink
                  className=***REMOVED***classnames(***REMOVED*** active: this.state.activeTab === '1' ***REMOVED***)***REMOVED***
                  onClick=***REMOVED***() => ***REMOVED*** this.toggle('1'); ***REMOVED******REMOVED***
                >
                  <i className="icon-calculator"></i> Calculator
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className=***REMOVED***classnames(***REMOVED*** active: this.state.activeTab === '2' ***REMOVED***)***REMOVED***
                  onClick=***REMOVED***() => ***REMOVED*** this.toggle('2'); ***REMOVED******REMOVED***
                >
                  <i className="icon-basket-loaded"></i> Shoping cart
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className=***REMOVED***classnames(***REMOVED*** active: this.state.activeTab === '3' ***REMOVED***)***REMOVED***
                  onClick=***REMOVED***() => ***REMOVED*** this.toggle('3'); ***REMOVED******REMOVED***
                >
                  <i className="icon-pie-chart"></i> Charts
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab=***REMOVED***this.state.activeTab***REMOVED***>
              <TabPane tabId="1">
                1. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </TabPane>
              <TabPane tabId="2">
                2. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </TabPane>
              <TabPane tabId="3">
                2. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </TabPane>
            </TabContent>
          </div>
          <div className="col-md-6 mb-4">
            <Nav tabs>
              <NavItem>
                <NavLink
                  className=***REMOVED***classnames(***REMOVED*** active: this.state.activeTab === '1' ***REMOVED***)***REMOVED***
                  onClick=***REMOVED***() => ***REMOVED*** this.toggle('1'); ***REMOVED******REMOVED***
                >
                  <i className="icon-calculator"></i> Calculator &nbsp;<span className="badge badge-success">New</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className=***REMOVED***classnames(***REMOVED*** active: this.state.activeTab === '2' ***REMOVED***)***REMOVED***
                  onClick=***REMOVED***() => ***REMOVED*** this.toggle('2'); ***REMOVED******REMOVED***
                >
                  <i className="icon-basket-loaded"></i> Shoping cart &nbsp;<span className="badge badge-pill badge-danger">29</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className=***REMOVED***classnames(***REMOVED*** active: this.state.activeTab === '3' ***REMOVED***)***REMOVED***
                  onClick=***REMOVED***() => ***REMOVED*** this.toggle('3'); ***REMOVED******REMOVED***
                >
                  <i className="icon-pie-chart"></i> Charts
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab=***REMOVED***this.state.activeTab***REMOVED***>
              <TabPane tabId="1">
                1. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </TabPane>
              <TabPane tabId="2">
                2. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </TabPane>
              <TabPane tabId="3">
                2. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </TabPane>
            </TabContent>
          </div>
        </div>
      </div>
    )
  ***REMOVED***
***REMOVED***

export default Tabs;
