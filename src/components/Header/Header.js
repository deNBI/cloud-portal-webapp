import React, ***REMOVED*** Component ***REMOVED*** from 'react';
import ***REMOVED*** Dropdown, DropdownMenu, DropdownItem ***REMOVED*** from 'reactstrap';

class Header extends Component ***REMOVED***

  constructor(props) ***REMOVED***
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = ***REMOVED***
      dropdownOpen: false
    ***REMOVED***;
  ***REMOVED***

  toggle() ***REMOVED***
    this.setState(***REMOVED***
      dropdownOpen: !this.state.dropdownOpen
    ***REMOVED***);
  ***REMOVED***

  sidebarToggle(e) ***REMOVED***
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  ***REMOVED***

  sidebarMinimize(e) ***REMOVED***
    e.preventDefault();
    document.body.classList.toggle('sidebar-minimized');
  ***REMOVED***

  mobileSidebarToggle(e) ***REMOVED***
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  ***REMOVED***

  asideToggle(e) ***REMOVED***
    e.preventDefault();
    document.body.classList.toggle('aside-menu-hidden');
  ***REMOVED***

  render() ***REMOVED***
    return (
      <header className="app-header navbar">
        <button className="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" onClick=***REMOVED***this.mobileSidebarToggle***REMOVED***>&#9776;</button>
        <a className="navbar-brand" href="#"></a>
        <ul className="nav navbar-nav d-md-down-none">
          <li className="nav-item">
            <button className="nav-link navbar-toggler sidebar-toggler" type="button" onClick=***REMOVED***this.sidebarToggle***REMOVED***>&#9776;</button>
          </li>
          <li className="nav-item px-3">
            <a className="nav-link" href="#">Dashboard</a>
          </li>
          <li className="nav-item px-3">
            <a className="nav-link" href="#">Users</a>
          </li>
          <li className="nav-item px-3">
            <a className="nav-link" href="#">Settings</a>
          </li>
        </ul>
        <ul className="nav navbar-nav ml-auto">
          <li className="nav-item d-md-down-none">
            <a className="nav-link" href="#"><i className="icon-bell"></i><span className="badge badge-pill badge-danger">5</span></a>
          </li>
          <li className="nav-item d-md-down-none">
            <a className="nav-link" href="#"><i className="icon-list"></i></a>
          </li>
          <li className="nav-item d-md-down-none">
            <a className="nav-link" href="#"><i className="icon-location-pin"></i></a>
          </li>
          <li className="nav-item">
            <Dropdown isOpen=***REMOVED***this.state.dropdownOpen***REMOVED*** toggle=***REMOVED***this.toggle***REMOVED***>
              <button onClick=***REMOVED***this.toggle***REMOVED*** className="nav-link dropdown-toggle" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded=***REMOVED***this.state.dropdownOpen***REMOVED***>
                <img src=***REMOVED***'img/avatars/6.jpg'***REMOVED*** className="img-avatar" alt="admin@bootstrapmaster.com"/>
                <span className="d-md-down-none">admin</span>
              </button>

              <DropdownMenu className="dropdown-menu-right">
                <DropdownItem header className="text-center"><strong>Account</strong></DropdownItem>

                <DropdownItem><i className="fa fa-bell-o"></i> Updates<span className="badge badge-info">42</span></DropdownItem>
                <DropdownItem><i className="fa fa-envelope-o"></i> Messages<span className="badge badge-success">42</span></DropdownItem>
                <DropdownItem><i className="fa fa-tasks"></i> Tasks<span className="badge badge-danger">42</span></DropdownItem>
                <DropdownItem><i className="fa fa-comments"></i> Comments<span className="badge badge-warning">42</span></DropdownItem>

                <DropdownItem header className="text-center"><strong>Settings</strong></DropdownItem>

                <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
                <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
                <DropdownItem><i className="fa fa-usd"></i> Payments<span className="badge badge-default">42</span></DropdownItem>
                <DropdownItem><i className="fa fa-file"></i> Projects<span className="badge badge-primary">42</span></DropdownItem>
                <DropdownItem divider />
                <DropdownItem><i className="fa fa-shield"></i> Lock Account</DropdownItem>
                <DropdownItem><i className="fa fa-lock"></i> Logout</DropdownItem>

              </DropdownMenu>
            </Dropdown>
          </li>
          <li className="nav-item d-md-down-none">
            <button className="nav-link navbar-toggler aside-menu-toggler" type="button" onClick=***REMOVED***this.asideToggle***REMOVED***>&#9776;</button>
          </li>
        </ul>
      </header>
    )
  ***REMOVED***
***REMOVED***

export default Header;
