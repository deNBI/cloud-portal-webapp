import React, ***REMOVED*** Component ***REMOVED*** from 'react';
import ***REMOVED*** NavLink ***REMOVED*** from 'react-router-dom'

class Sidebar extends Component ***REMOVED***

  handleClick(e) ***REMOVED***
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  ***REMOVED***

  activeRoute(routeName) ***REMOVED***
    return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
  ***REMOVED***

  // secondLevelActive(routeName) ***REMOVED***
  //   return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
  // ***REMOVED***

  render() ***REMOVED***
    return (
      <div className="sidebar">
        <nav className="sidebar-nav">
          <ul className="nav">
            <li className="nav-item">
              <NavLink to=***REMOVED***'/dashboard'***REMOVED*** className="nav-link" activeClassName="active"><i className="icon-speedometer"></i> Dashboard <span className="badge badge-info">NEW</span></NavLink>
            </li>
            <li className="nav-title">
              UI Elements
            </li>
            <li className=***REMOVED***this.activeRoute("/components")***REMOVED***>
              <a className="nav-link nav-dropdown-toggle" href="#" onClick=***REMOVED***this.handleClick.bind(this)***REMOVED***><i className="icon-puzzle"></i> Components</a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <NavLink to=***REMOVED***'/components/buttons'***REMOVED*** className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Buttons</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to=***REMOVED***'/components/social-buttons'***REMOVED*** className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Social Buttons</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to=***REMOVED***'/components/cards'***REMOVED*** className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Cards</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to=***REMOVED***'/components/forms'***REMOVED*** className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Forms</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to=***REMOVED***'/components/modals'***REMOVED*** className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Modals</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to=***REMOVED***'/components/switches'***REMOVED*** className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Switches</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to=***REMOVED***'/components/tables'***REMOVED*** className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Tables</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to=***REMOVED***'/components/tabs'***REMOVED*** className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Tabs</NavLink>
                </li>
              </ul>
            </li>
            <li className=***REMOVED***this.activeRoute("/icons")***REMOVED***>
              <a className="nav-link nav-dropdown-toggle" href="#" onClick=***REMOVED***this.handleClick.bind(this)***REMOVED***><i className="icon-star"></i> Icons</a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <NavLink to=***REMOVED***'/icons/font-awesome'***REMOVED*** className="nav-link" activeClassName="active"><i className="icon-star"></i> Font Awesome</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to=***REMOVED***'/icons/simple-line-icons'***REMOVED*** className="nav-link" activeClassName="active"><i className="icon-star"></i> Simple Line Icons</NavLink>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <NavLink to=***REMOVED***'/widgets'***REMOVED*** className="nav-link" activeClassName="active"><i className="icon-calculator"></i> Widgets <span className="badge badge-info">NEW</span></NavLink>
            </li>
            <li className="nav-item">
              <NavLink to=***REMOVED***'/charts'***REMOVED*** className="nav-link" activeClassName="active"><i className="icon-pie-chart"></i> Charts</NavLink>
            </li>
            <li className="divider"></li>
            <li className="nav-title">
              Extras
            </li>
            <li className="nav-item nav-dropdown">
              <a className="nav-link nav-dropdown-toggle" href="#" onClick=***REMOVED***this.handleClick.bind(this)***REMOVED***><i className="icon-star"></i> Pages</a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <NavLink to=***REMOVED***'/login'***REMOVED*** className="nav-link" activeClassName="active"><i className="icon-star"></i> Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to=***REMOVED***'/register'***REMOVED*** className="nav-link" activeClassName="active"><i className="icon-star"></i> Register</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to=***REMOVED***'/404'***REMOVED*** className="nav-link" activeClassName="active"><i className="icon-star"></i> Error 404</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to=***REMOVED***'/500'***REMOVED*** className="nav-link" activeClassName="active"><i className="icon-star"></i> Error 500</NavLink>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    )
  ***REMOVED***
***REMOVED***

export default Sidebar;
