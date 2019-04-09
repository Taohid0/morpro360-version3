import React, {Component} from "react";

import {Button,Modal, ModalFooter, ModalHeader,ModalBody} from "reactstrap";


export default class DangerModal extends Component{
    
    render()
    {
        return(
            <Modal isOpen={this.props.isVisible} toggle={this.toggleDanger}
            className={'modal-danger ' + this.props.className}>
       <ModalHeader toggle={this.toggleDanger}>Error</ModalHeader>
       <ModalBody>
         <pre>{this.props.errors}</pre>
       </ModalBody>
       <ModalFooter>
         {/* <Button color="danger" onClick={this.toggleDanger}>Do Something</Button>{' '} */}
         <Button color="secondary" onClick={this.props.toggleModal}>CLOSE</Button>
       </ModalFooter>
     </Modal>
        )
    }

}