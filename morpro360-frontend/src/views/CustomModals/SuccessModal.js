import React, {Component} from "react";

import {Button,Modal, ModalFooter, ModalHeader,ModalBody} from "reactstrap";


export default class Success extends Component{
    
    render()
    {
        return(
     <Modal
                  isOpen={this.props.isVisible}
                  toggle={this.toggleSuccess}
                  className={"modal-success " + this.props.className}
                >
                  <ModalHeader toggle={this.toggleSuccess}>
                    {this.props.title}
                  </ModalHeader>
                  <ModalBody>
                  <pre>{this.props.errors}</pre>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="success" onClick={()=>{this.props.toggleModal();this.props.goToDashboard();}}>
                      OK
                    </Button>{" "}
                  </ModalFooter>
                </Modal>
        )
    }

}
