import React, { Component } from "react";

import {
  Button,
  Modal,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Badge,
  ButtonDropdown,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row
} from "reactstrap";

import validateInput from "../../validation/input";
import { createBid } from "../../ApiCalls/bid";
import { getCompanyDrivers } from "../../ApiCalls/driver";
import { timingSafeEqual } from "crypto";

import SuccessModal from "./SuccessModal";

export default class MyBidDetails extends Component {
  render() {
    const bid = this.props.bidDetails;
    if (!bid.load) {
      return "";
    }
    return (
      <Modal
        isOpen={this.props.isVisible}
        toggle={this.toggleSuccess}
        className={"modal-lg " + this.props.className}
      >
        <ModalHeader toggle={this.toggleSuccess}>{bid.load.name}</ModalHeader>
        <ModalBody>
          <pre>
            <b>Load board Informations</b>
            <br />
            Product : {bid.load.productDetails}
            <br />
            Weight : {bid.load.weight} lb
            <br />
            Distance :{bid.load.distance} Miles
            <br />
            Rate : ${bid.load.rate}
            <br />
            <br />
            Pick Up State : {bid.load.pickUpState}
            <br />
            Pick Up City : {bid.load.pickUpCity}
            <br />
            Pick Up Zip Code : {bid.load.pickUpZipCode}
            <br />
            {bid.load.pickUpAddress
              ? "Pick Up Address : " + bid.load.pickUpAddress + "\n"
              : ""}
            Pick Up Date : {bid.load.pickUpDate}
            <br />
            <br />
            Drop Off State : {bid.load.dropOffState}
            <br />
            Drop Off City : {bid.load.dropOffCity}
            <br />
            Drop Off Zip Code : {bid.load.dropOffZipCode}
            <br />
            {bid.load.dropOffAddress
              ? "Pick Up Address : " + bid.load.dropOffAddress + "\n"
              : ""}
            Drop Off Date : {bid.load.dropOffDate}
            <br />
            <br />
            <b>Bidding Informations</b>
            <br />
            My proposed Rate : {bid.rate}
            <br />
            Note : {bid.note}
            <br />
            <br />
            <b>Driver's Informations</b>
            <br />
            Name : {bid.driver.name}
            <br />
            License : {bid.driver.license}
            <br />
            Phone : {bid.driver.phone}
            <br />
            Email : {bid.driver.email}
            <br />
            State : {bid.driver.state}
            <br />
            City : {bid.driver.city}
            <br />
            Address : {bid.driver.address}
            <br />
            <br />
            <b>Bidder's Informations</b>
            <br />
            Name : {bid.bidder.name}
            <br />
            Phone : {bid.bidder.phone}
            <br />
            Email : {bid.bidder.email}
            <br />
            MC# : {bid.bidder.MC}
            <br />
            DOT# : {bid.bidder.DOT}
            <br />
            Description : {bid.bidder.description}
            <br />
          </pre>
          <br />
        </ModalBody>
        <ModalFooter>
          <Button
            color="btn btn-danger"
            onClick={() => {
              this.props.toggleModal();
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
