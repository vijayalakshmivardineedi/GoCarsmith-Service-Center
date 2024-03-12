import React, { useState } from "react";
import { Form, Container, Row, Col, Card } from "react-bootstrap";
import { Box  } from "@mui/material";
import Sidebar from "../../components/Sidebar/Sidebar";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleSharpIcon from "@mui/icons-material/AddCircleSharp";
import "./Invoice.css";
import { BiRupee } from "react-icons/bi";
import {BiArrowBack} from "react-icons/bi";
import {IconButton} from '@mui/material';
import Table from "@mui/material/Table";
import { useNavigate } from "react-router-dom";
function CreateInvoice() {
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [status, setStatus] = useState("");
  const token = localStorage.getItem("token");
  const [serviceDate, setServiceDate] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [serviceItems, setServiceItems] = useState([
    {
      serviceId: "",
      serviceTitle: "",
      serviceDescription: "",
      price: "",
      labourCharges: "",
      discounts: "",
      taxes: "",
    },
  ]);

  const handleCreateReceipt = () => {
    if (
      customerName &&
      phoneNumber &&
      fromAddress &&
      toAddress &&
      invoiceNumber &&
      status &&
      serviceDate &&
      invoiceDate &&
      serviceItems.every(
        (item) =>
          item.serviceId &&
          item.serviceTitle &&
          item.serviceDescription &&
          item.price
      )
    ) {
      setShowReceipt(true);
    } else {
      // Display an error message or alert to inform the user that all fields are required.
      alert("Please fill in all the required fields.");
    }
  };

  const handleAddServiceItem = () => {
    setServiceItems([
      ...serviceItems,
      {
        serviceId: "",
        serviceTitle: "",
        serviceDescription: "",
        price: "",
        labourCharges: "",
        discounts: "",
        taxes: "",
      },
    ]);
  };

  const handleServiceItemChange = (index, property, value) => {
    const updatedServiceItems = [...serviceItems];
    updatedServiceItems[index][property] = value;
    setServiceItems(updatedServiceItems);
  };

  const handleDeleteServiceItem = (index) => {
    const updatedServiceItems = [...serviceItems];
    updatedServiceItems.splice(index, 1);
    setServiceItems(updatedServiceItems);
  };

  const calculateTotal = () => {
    let total = 0;

    serviceItems.forEach((item) => {
      const price = parseFloat(item.price) || 0;
      const labourCharges = parseFloat(item.labourCharges) || 0;
      const discounts = parseFloat(item.discounts) || 0;
      const taxes = parseFloat(item.taxes) || 0;

      const itemTotal = price + labourCharges - discounts + taxes;
      total += itemTotal;
    });

    return total;
  };

  const [showReceipt, setShowReceipt] = useState(false);

  const calculateLabourChargesTotal = () => {
    let total = 0;

    serviceItems.forEach((item) => {
      total += parseFloat(item.labourCharges) || 0;
    });

    return total;
  };

  const calculateDiscountsTotal = () => {
    let total = 0;

    serviceItems.forEach((item) => {
      total += parseFloat(item.discounts) || 0;
    });

    return total;
  };

  const calculateTaxesTotal = () => {
    let total = 0;

    serviceItems.forEach((item) => {
      total += parseFloat(item.taxes) || 0;
    });

    return total;
  };
const navigate = useNavigate();
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "45px" }}>
        
    <IconButton><BiArrowBack onClick={()=>navigate("/Invoice")} /></IconButton>
        <h2>Invoice Form</h2>

        <Container className="invoice_container">
          <Form className="form-group">
            <Row className="mt-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                {" "}
                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel" // Change the type to "tel" for phone number
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={fromAddress}
                    onChange={(e) => setFromAddress(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Service Center Location</Form.Label>
                  <Form.Control
                    as="select" // Use "as" with "select" to create a select dropdown
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                    required
                  >
                    <option value="location1">Location 1</option>
                    <option value="location2">Location 2</option>
                    <option value="location3">Location 3</option>
                    {/* Add more options as needed */}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Invoice Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>{" "}
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    as="select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                  >
                    <option value="paid">Paid</option>
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                  </Form.Control>
                </Form.Group>
              </Col>{" "}
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Service Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>{" "}
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Invoice Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>{" "}
            </Row>
            <hr />
            <div>
              <h5>Details:</h5>
              {serviceItems.map((item, index) => (
                <Row key={index} className="service-item">
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Service ID</Form.Label>
                      <Form.Control
                        type="text"
                        value={item.serviceId}
                        onChange={(e) =>
                          handleServiceItemChange(
                            index,
                            "serviceId",
                            e.target.value
                          )
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Service Title</Form.Label>
                      <Form.Control
                        type="text"
                        value={item.serviceTitle}
                        onChange={(e) =>
                          handleServiceItemChange(
                            index,
                            "serviceTitle",
                            e.target.value
                          )
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Service Description</Form.Label>
                      <Form.Control
                        type="text"
                        value={item.serviceDescription}
                        onChange={(e) =>
                          handleServiceItemChange(
                            index,
                            "serviceDescription",
                            e.target.value
                          )
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          handleServiceItemChange(
                            index,
                            "price",
                            e.target.value
                          )
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={1}>
                    <button
                      onClick={() => handleDeleteServiceItem(index)}
                      className="create_button"
                      style={{
                        width: "45px",
                        borderRadius: "50%",
                        marginTop: "30px",
                      }}
                    >
                      <DeleteIcon />
                    </button>
                  </Col>
                </Row>
              ))}
            </div>
            <hr />
            <Row>
              <Col md={1}>
                <button
                  onClick={handleAddServiceItem}
                  className="create_button"
                  style={{
                    width: "45px",
                    borderRadius: "50%",
                    marginTop: "10px",
                  }}
                >
                  <AddCircleSharpIcon />
                </button>
              </Col>
              <Col md={5}></Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Labour Charges</Form.Label>
                  <Form.Control
                    type="number"
                    value={
                      serviceItems.length > 0
                        ? serviceItems[serviceItems.length - 1].labourCharges
                        : ""
                    }
                    onChange={(e) =>
                      handleServiceItemChange(
                        serviceItems.length - 1,
                        "labourCharges",
                        e.target.value
                      )
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Discounts</Form.Label>
                  <Form.Control
                    type="number"
                    value={
                      serviceItems.length > 0
                        ? serviceItems[serviceItems.length - 1].discounts
                        : ""
                    }
                    onChange={(e) =>
                      handleServiceItemChange(
                        serviceItems.length - 1,
                        "discounts",
                        e.target.value
                      )
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Taxes</Form.Label>
                  <Form.Control
                    type="number"
                    value={
                      serviceItems.length > 0
                        ? serviceItems[serviceItems.length - 1].taxes
                        : ""
                    }
                    onChange={(e) =>
                      handleServiceItemChange(
                        serviceItems.length - 1,
                        "taxes",
                        e.target.value
                      )
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}></Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Total</Form.Label>
                  <Form.Control
                    type="number"
                    value={calculateTotal()} // Display the calculated total
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={8}></Col>
              <Col md={2}></Col>
              <Col md={2}>
                <button
                  type="button"
                  variant="primary"
                  onClick={handleCreateReceipt}
                  className="create_button mt-4"
                >
                  Create Invoice
                </button>
              </Col>
            </Row>
          </Form>
        </Container>
        {showReceipt && (
          <Container>
            <Card className="receipt-card">
              <Card.Header style={{ fontSize: "20px" }}>
                {invoiceNumber} - {status}
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <h5>Invoice From:</h5>
                    {toAddress}
                  </Col>
                  <Col md={6}>
                    <h5>Invoice To:</h5>
                    <Card.Text style={{ marginTop: "-5px" }}>
                      {customerName}
                    </Card.Text>
                    <Card.Text style={{ marginTop: "-5px" }}>
                      {fromAddress}
                    </Card.Text>
                    <Card.Text style={{ marginTop: "-5px" }}>
                      {phoneNumber}
                    </Card.Text>
                  </Col>
                </Row>
                <Row style={{ marginTop: "10px" }}>
                  <Col md={6}>
                    <Row>
                      <Col md={3}>
                        <h6>Service Date: </h6>{" "}
                      </Col>{" "}
                      <Col md={6}>{serviceDate}</Col>
                    </Row>
                  </Col>
                  <Col md={6}>
                    <Row>
                      <Col md={3}>
                        <h6>Invoice Date: </h6>
                      </Col>{" "}
                      <Col md={6}>{invoiceDate}</Col>
                    </Row>
                  </Col>
                </Row>
                <hr />

                <h4>Details</h4>
                <Table>
                  <thead>
                    <tr style={{ backgroundColor: "rgb(241, 243, 244)" }}>
                      <th className="text-center">Service Id</th>
                      <th className="text-center">Service Title</th>
                      <th className="text-center">Service Description</th>
                      <th className="text-center">Price</th>
                    </tr>
                  </thead>
                  <tbody striped hover>
                    {serviceItems.map((item, index) => (
                      <tr key={index}>
                        <td>{item.serviceId}</td>
                        <td>{item.serviceTitle}</td>
                        <td>{item.serviceDescription}</td>
                        <td>
                          <BiRupee /> {item.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <hr />
                <Card.Text style={{ textAlign: "right" }}>
                  Labour Charges: <BiRupee /> {calculateLabourChargesTotal()}
                </Card.Text>
                <Card.Text style={{ textAlign: "right" }}>
                  Discounts: <BiRupee /> {calculateDiscountsTotal()}
                </Card.Text>
                <Card.Text style={{ textAlign: "right" }}>
                  Taxes: <BiRupee /> {calculateTaxesTotal()}
                </Card.Text>

                <Row>
                  <h4 style={{ textAlign: "right" }}>
                    Total: <BiRupee /> {calculateTotal()}
                  </h4>
                </Row>
              </Card.Body>
            </Card>
          </Container>
        )}
      </Box>
    </Box>
  );
}

export default CreateInvoice;
