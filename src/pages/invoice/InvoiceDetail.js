import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { BiRupee } from 'react-icons/bi';
import Table from "@mui/material/Table";
import Sidebar from '../../components/Sidebar/Sidebar';
import { Box} from "@mui/material";
import {BiArrowBack} from "react-icons/bi";
import {IconButton} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Receipt = () => {
  const navigate=useNavigate();
  const invoiceData = {
    invoiceNumber: 'INV-001',
    status: "Paid",
    customer: {
      name: 'John',
      phoneNumber: '123-456-7890',
      address: '123 Main St, Madhurawada, Visakhapatnam ,530048',
    },
    serviceCenter: ' Madhurawada Service Center ',
    serviceLocation: ' Visakhapatnam ',
    serviceDate: "26-oct-2023",
    InvoiceDate: "26-oct-2023",
    serviceDetails: [
      {
        id: 1,
        title: 'Service Title 1',
        description: 'Service Description 1',
        price: 500,
        laborCharge: 100,
        discount: 50,
      },
      {
        id: 2,
        title: 'Service Title 2',
        description: 'Service Description 2',
        price: 800,
        laborCharge: 150,
        discount: 0,
      },
    ],
    taxes: 100,
  };

  const calculateLabourChargesTotal = () => {
    // Implement your logic for calculating labor charges total
    return invoiceData.serviceDetails.reduce((total, service) => total + service.laborCharge, 0);
  };

  const calculateDiscountsTotal = () => {
    // Implement your logic for calculating discounts total
    return invoiceData.serviceDetails.reduce((total, service) => total + service.discount, 0);
  };

  const calculateTaxesTotal = () => {
    // Implement your logic for calculating taxes total
    return invoiceData.taxes;
  };

  const calculateTotal = () => {
    // Implement your logic for calculating the total amount
    const serviceTotal = invoiceData.serviceDetails.reduce(
      (total, service) => total + service.price - service.discount + service.laborCharge,
      0
    );
    return serviceTotal + calculateTaxesTotal();
  };

  return (
    
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "45px" }}>
    <Container>
      
    <IconButton><BiArrowBack onClick={()=>navigate("/Invoice")} /></IconButton>
      <Card className="receipt-card">
        <Card.Header style={{ fontSize: "20px" }}>
          {invoiceData.invoiceNumber} - {invoiceData.status}
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h5>Invoice From:</h5>
              <Card.Text> {invoiceData.serviceCenter},</Card.Text>
              {invoiceData.serviceLocation}
            </Col>
            <Col md={6}>
              <h5>Invoice To:</h5>
              <Card.Text style={{ marginTop: "-5px" }}>{invoiceData.customer.name}</Card.Text>
              <Card.Text style={{ marginTop: "-15px" }}>{invoiceData.customer.address}</Card.Text>
              <Card.Text style={{ marginTop: "-5px" }}>{invoiceData.customer.phoneNumber}</Card.Text>
            </Col>
          </Row>
          <Row style={{ marginTop: "10px" }}>
            <Col md={6}>
              <Row>
                <Col md={4}>
                  <h5>Service Date: </h5>
                </Col>
                <Col md={8}>{invoiceData.serviceDate}</Col>
              </Row>
            </Col>
            <Col md={6}>
              <Row>
                <Col md={4}>
                  <h5>Invoice Date: </h5>
                </Col>
                <Col md={8}>{invoiceData.InvoiceDate}</Col>
              </Row>
            </Col>
          </Row>
          <hr />
          <h4>Details</h4>
          <Table>
            <thead>
              <tr style={{ backgroundColor: "rgb(241, 243, 244)" , fontWeight:"600"}}>
                <td className="text-center">Service Id</td>
                <td className="text-center">Service Title</td>
                <td className="text-center">Service Description</td>
                <td className="text-center">Price</td>
                <td className="text-center">Labor Charges</td>
                <td className="text-center">Discount</td>
              </tr>
            </thead>
            <tbody>
              {invoiceData.serviceDetails.map((service) => (
                <tr key={service.id}>
                  <td>{service.id}</td>
                  <td>{service.title}</td>
                  <td>{service.description}</td>
                  <td>
                    <BiRupee /> {service.price}
                  </td>
                  <td>
                    <BiRupee /> {service.laborCharge}
                  </td>
                  <td>
                    <BiRupee /> {service.discount}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <hr />
          <Card.Text style={{ textAlign: "right" }}>
            Taxes: <BiRupee /> {calculateTaxesTotal()}
          </Card.Text>
          <Card.Text style={{ textAlign: "right" }}>
            Labour Charges: <BiRupee /> {calculateLabourChargesTotal()}
          </Card.Text>
          <Card.Text style={{ textAlign: "right" }}>
            Discounts: <BiRupee /> {calculateDiscountsTotal()}
          </Card.Text>
          <Row>
            <h4 style={{ textAlign: "right" }}>
              Total: <BiRupee /> {calculateTotal()}
            </h4>
          </Row>
        </Card.Body>
      </Card>
    </Container></Box></Box>
  );
};

export default Receipt;
