import React, ***REMOVED*** Component ***REMOVED*** from 'react';
import ***REMOVED*** Button, Modal, ModalHeader, ModalBody, ModalFooter ***REMOVED*** from 'reactstrap';


class Modals extends Component ***REMOVED***

  constructor(props) ***REMOVED***
    super(props);
    this.state = ***REMOVED***
      modal: false,
      large: false,
      small: false,
      primary: false,
      success: false,
      warning: false,
      danger: false,
      info: false
    ***REMOVED***;

    this.toggle = this.toggle.bind(this);
    this.toggleLarge= this.toggleLarge.bind(this);
    this.toggleSmall= this.toggleSmall.bind(this);
    this.togglePrimary= this.togglePrimary.bind(this);
    this.toggleSuccess= this.toggleSuccess.bind(this);
    this.toggleWarning= this.toggleWarning.bind(this);
    this.toggleDanger= this.toggleDanger.bind(this);
    this.toggleInfo= this.toggleInfo.bind(this);
  ***REMOVED***

  toggle() ***REMOVED***
    this.setState(***REMOVED***
      modal: !this.state.modal
    ***REMOVED***);
  ***REMOVED***
  toggleLarge() ***REMOVED***
    this.setState(***REMOVED***
      large: !this.state.large
    ***REMOVED***);
  ***REMOVED***
  toggleSmall() ***REMOVED***
    this.setState(***REMOVED***
      small: !this.state.small
    ***REMOVED***);
  ***REMOVED***
  togglePrimary() ***REMOVED***
    this.setState(***REMOVED***
      primary: !this.state.primary
    ***REMOVED***);
  ***REMOVED***
  toggleSuccess() ***REMOVED***
    this.setState(***REMOVED***
      success: !this.state.success
    ***REMOVED***);
  ***REMOVED***
  toggleWarning() ***REMOVED***
    this.setState(***REMOVED***
      warning: !this.state.warning
    ***REMOVED***);
  ***REMOVED***
  toggleDanger() ***REMOVED***
    this.setState(***REMOVED***
      danger: !this.state.danger
    ***REMOVED***);
  ***REMOVED***
  toggleInfo() ***REMOVED***
    this.setState(***REMOVED***
      info: !this.state.info
    ***REMOVED***);
  ***REMOVED***

  render() ***REMOVED***
    return (
      <div className="animated fadeIn">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header">
                <i className="fa fa-align-justify"></i> Bootstrap Modals
              </div>
              <div className="card-block">
                <Button onClick=***REMOVED***this.toggle***REMOVED***>Launch demo modal</Button>
                <Modal isOpen=***REMOVED***this.state.modal***REMOVED*** toggle=***REMOVED***this.toggle***REMOVED*** className=***REMOVED***this.props.className***REMOVED***>
                  <ModalHeader toggle=***REMOVED***this.toggle***REMOVED***>Modal title</ModalHeader>
                  <ModalBody>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick=***REMOVED***this.toggle***REMOVED***>Do Something</Button>***REMOVED***' '***REMOVED***
                    <Button color="secondary" onClick=***REMOVED***this.toggle***REMOVED***>Cancel</Button>
                  </ModalFooter>
                </Modal>

                <Button onClick=***REMOVED***this.toggleLarge***REMOVED***>Launch large modal</Button>
                <Modal isOpen=***REMOVED***this.state.large***REMOVED*** toggle=***REMOVED***this.toggleLarge***REMOVED*** className=***REMOVED***'modal-lg ' + this.props.className***REMOVED***>
                  <ModalHeader toggle=***REMOVED***this.toggleLarge***REMOVED***>Modal title</ModalHeader>
                  <ModalBody>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick=***REMOVED***this.toggleLarge***REMOVED***>Do Something</Button>***REMOVED***' '***REMOVED***
                    <Button color="secondary" onClick=***REMOVED***this.toggleLarge***REMOVED***>Cancel</Button>
                  </ModalFooter>
                </Modal>

                <Button onClick=***REMOVED***this.toggleSmall***REMOVED***>Launch small modal</Button>
                <Modal isOpen=***REMOVED***this.state.small***REMOVED*** toggle=***REMOVED***this.toggleSmall***REMOVED*** className=***REMOVED***'modal-sm ' + this.props.className***REMOVED***>
                  <ModalHeader toggle=***REMOVED***this.toggleSmall***REMOVED***>Modal title</ModalHeader>
                  <ModalBody>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick=***REMOVED***this.toggleSmall***REMOVED***>Do Something</Button>***REMOVED***' '***REMOVED***
                    <Button color="secondary" onClick=***REMOVED***this.toggleSmall***REMOVED***>Cancel</Button>
                  </ModalFooter>
                </Modal>

                <hr/>

                <Button color="primary" onClick=***REMOVED***this.togglePrimary***REMOVED***>Primary modal</Button>
                <Modal isOpen=***REMOVED***this.state.primary***REMOVED*** toggle=***REMOVED***this.togglePrimary***REMOVED*** className=***REMOVED***'modal-primary ' + this.props.className***REMOVED***>
                  <ModalHeader toggle=***REMOVED***this.togglePrimary***REMOVED***>Modal title</ModalHeader>
                  <ModalBody>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick=***REMOVED***this.togglePrimary***REMOVED***>Do Something</Button>***REMOVED***' '***REMOVED***
                    <Button color="secondary" onClick=***REMOVED***this.togglePrimary***REMOVED***>Cancel</Button>
                  </ModalFooter>
                </Modal>

                <Button color="success" onClick=***REMOVED***this.toggleSuccess***REMOVED***>Success modal</Button>
                <Modal isOpen=***REMOVED***this.state.success***REMOVED*** toggle=***REMOVED***this.toggleSuccess***REMOVED*** className=***REMOVED***'modal-success ' + this.props.className***REMOVED***>
                  <ModalHeader toggle=***REMOVED***this.toggleSuccess***REMOVED***>Modal title</ModalHeader>
                  <ModalBody>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick=***REMOVED***this.toggleSuccess***REMOVED***>Do Something</Button>***REMOVED***' '***REMOVED***
                    <Button color="secondary" onClick=***REMOVED***this.toggleSuccess***REMOVED***>Cancel</Button>
                  </ModalFooter>
                </Modal>

                <Button color="warning" onClick=***REMOVED***this.toggleWarning***REMOVED***>Warning modal</Button>
                <Modal isOpen=***REMOVED***this.state.warning***REMOVED*** toggle=***REMOVED***this.toggleWarning***REMOVED*** className=***REMOVED***'modal-warning ' + this.props.className***REMOVED***>
                  <ModalHeader toggle=***REMOVED***this.toggleWarning***REMOVED***>Modal title</ModalHeader>
                  <ModalBody>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick=***REMOVED***this.toggleWarning***REMOVED***>Do Something</Button>***REMOVED***' '***REMOVED***
                    <Button color="secondary" onClick=***REMOVED***this.toggleWarning***REMOVED***>Cancel</Button>
                  </ModalFooter>
                </Modal>

                <Button color="danger" onClick=***REMOVED***this.toggleDanger***REMOVED***>Danger modal</Button>
                <Modal isOpen=***REMOVED***this.state.danger***REMOVED*** toggle=***REMOVED***this.toggleDanger***REMOVED*** className=***REMOVED***'modal-danger ' + this.props.className***REMOVED***>
                  <ModalHeader toggle=***REMOVED***this.toggleDanger***REMOVED***>Modal title</ModalHeader>
                  <ModalBody>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick=***REMOVED***this.toggleDanger***REMOVED***>Do Something</Button>***REMOVED***' '***REMOVED***
                    <Button color="secondary" onClick=***REMOVED***this.toggleDanger***REMOVED***>Cancel</Button>
                  </ModalFooter>
                </Modal>

                <Button color="info" onClick=***REMOVED***this.toggleInfo***REMOVED***>Info modal</Button>
                <Modal isOpen=***REMOVED***this.state.info***REMOVED*** toggle=***REMOVED***this.toggleInfo***REMOVED*** className=***REMOVED***'modal-info ' + this.props.className***REMOVED***>
                  <ModalHeader toggle=***REMOVED***this.toggleInfo***REMOVED***>Modal title</ModalHeader>
                  <ModalBody>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick=***REMOVED***this.toggleInfo***REMOVED***>Do Something</Button>***REMOVED***' '***REMOVED***
                    <Button color="secondary" onClick=***REMOVED***this.toggleInfo***REMOVED***>Cancel</Button>
                  </ModalFooter>
                </Modal>

              </div>
            </div>
          </div>
        </div>
      </div>
    )
  ***REMOVED***
***REMOVED***

export default Modals;
