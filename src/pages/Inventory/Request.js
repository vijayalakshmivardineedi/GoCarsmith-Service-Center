import React, { useState } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
} from '@mui/material';

const Request = () => {
  const [requests, setRequests] = useState([
    { id: 5, item: 'Item A', quantity: 10, status: 'Pending' },
    { id: 6, item: 'Item A', quantity: 10, status: 'Pending' },
    { id: 1, item: 'Item A', quantity: 10, status: 'Pending' },
    { id: 2, item: 'Item B', quantity: 5, status: 'Approved' },
    { id: 3, item: 'Item C', quantity: 8, status: 'Pending' },
  ]);

  const handleApprove = (id) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) => {
        if (request.id === id) {
          return { ...request, status: 'Approved' };
        }
        return request;
      })
    );
  };

  const handleReject = (id) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) => {
        if (request.id === id) {
          return { ...request, status: 'Rejected' };
        }
        return request;
      })
    );
  };

  return (
    <Container>
      <h2>Inventory Requests</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.item}</TableCell>
                <TableCell>{request.quantity}</TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell>
                  {request.status === 'Pending' ? (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        sx={{ marginRight: 1 }}
                        onClick={() => {
                          handleApprove(request.id);
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          handleReject(request.id);
                        }}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <span style={{ color: request.status === 'Approved' ? 'green' : 'red' }}>
                      {request.status}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Request;
