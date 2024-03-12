import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateEmployeeForm from "./CreateEmployeeForm";
import axios from "axios";
import EmployeeFormEdit from "./EmployeeFormEdit";

const StaffList = () => {
  const serviceCenterId = localStorage.getItem("_id");
  const [selectedRows, setSelectedRows] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEditEmployeeForm, setShowEditEmployeeForm] = useState(false);
  const [editEmployeeData, setEditEmployeeData] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const token = localStorage.getItem("token");

  const fetchData = () => {
    axios
      .get(`https://gocarsmithbackend.onrender.com/api/ServiceCenter/getEmployees/${serviceCenterId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setEmployees(response.data.employeeDetails);
      })
      .catch((error) => {
        console.error("Error fetching total employees:", error);
      });
  };

  useEffect(() => {
    // Fetch total employees when the component mounts
    fetchData();
  }, []);

  const handleDeleteEmployee = (employeeId) => {
    axios
      .delete(`https://gocarsmithbackend.onrender.com/api/ServiceCenter/deleteEmployee/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data.message);
        fetchData(); // Fetch data after delete
      })
      .catch((error) => {
        console.error("Error deleting employee:", error);
      });
  };

  const handleEditEmployee = (employeeId) => {
    const employeeToEdit = employees.find(
      (employee) => employee.employeeId === employeeId
    );
    if (employeeToEdit) {
      setEditEmployeeData(employeeToEdit);
      setShowEditEmployeeForm(true);
    }
  };

  const handleCreateEmployee = () => {
    setShowCreateForm(true);
  };

  const handleFormSubmit = () => {
    fetchData(); // Fetch data after form submission
    setShowEditEmployeeForm(false);
    
  };

  const handleConfirmDelete = () => {
    if (employeeToDelete) {
      handleDeleteEmployee(employeeToDelete.employeeId);
      setShowDeleteConfirmation(false);
    }
  };

  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
  };

  useEffect(() => {
    if (!showCreateForm) {
      fetchData(); // Fetch data after closing the create form
    }
  }, [showCreateForm]);

  return (
    <div style={{ padding: "25px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "700" }}>
          Employee Details
        </Typography>

        <Button
          onClick={handleCreateEmployee}
          sx={{
            marginRight: " 30px",
            backgroundColor: "#FFEEE6",
            color: "#E74D5A",
            fontWeight: "700",
            border: "2px solid #E74D5A",
            borderRadius: "10px",
          }}
        >
          + Create
        </Button>

        {showCreateForm && (
          <Dialog
            open={showCreateForm}
            onClose={handleCloseCreateForm} // Call handleCloseCreateForm
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle style={{ fontWeight: "600", color: "#e74d5a" }}>
              Create Employee
            </DialogTitle>
            <DialogContent>
              <CreateEmployeeForm onFormSubmit={handleFormSubmit} onClose={handleCloseCreateForm}  />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setShowCreateForm(false)}
                style={{
                  border: "2px solid",
                  borderColor: "#e74d5a",
                  backgroundColor: "#ffeee6",
                  borderRadius: "5px",
                  color: "#e74d5a",
                  fontSize: "12px",
                  padding: "6px",
                }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
      <div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow
                style={{
                  backgroundColor: "#FFEEE6",
                }}
              >
                <TableCell>
                  <strong>Employee Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Employee ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Phone Number</strong>
                </TableCell>
                <TableCell>
                  <strong>Role </strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee._id}>
                  <TableCell>
                    {employee.employeeName
                      .split(" ")
                      .map((namePart) => (
                        namePart.charAt(0).toUpperCase() +
                        namePart.slice(1).toLowerCase()
                      ))
                      .join(" ")}
                  </TableCell>
                  <TableCell>{employee.employeeId}</TableCell>
                  <TableCell>{employee.contactNumber}</TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEditEmployee(employee.employeeId)}
                      style={{ color: "green" }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setEmployeeToDelete(employee);
                        setShowDeleteConfirmation(true);
                      }}
                      style={{ color: "red" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {showEditEmployeeForm && editEmployeeData && (
        <Dialog
          open={showEditEmployeeForm}
          onClose={() => setShowEditEmployeeForm(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle style={{ fontWeight: "600", color: "#e74d5a" }}>
            Edit Employee
          </DialogTitle>
          <DialogContent>
            <EmployeeFormEdit
              employee={editEmployeeData}
              onFormSubmit={handleFormSubmit}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowEditEmployeeForm(false)}
              style={{
                border: "2px solid",
                borderColor: "#e74d5a",
                backgroundColor: "#ffeee6",
                borderRadius: "5px",
                color: "#e74d5a",
                fontSize: "12px",
                padding: "6px",
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Dialog
        open={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle style={{ fontWeight: "600", color: "#e74d5a" }}>
          Are you sure you want to delete this employee?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {employeeToDelete && (
              <>
                <div>Employee Name: {employeeToDelete.employeeName}</div>
                <div>Employee ID: {employeeToDelete.employeeId}</div>
                <div>Phone Number: {employeeToDelete.contactNumber}</div>
                <div>Role: {employeeToDelete.role}</div>
              </>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowDeleteConfirmation(false)}
            style={{
              border: "2px solid",
              borderColor: "#e74d5a",
              backgroundColor: "#ffeee6",
              borderRadius: "5px",
              color: "#e74d5a",
              fontSize: "12px",
              padding: "6px",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            style={{
              border: "2px solid #e74d5a",
              backgroundColor: "#e74d5a",
              borderRadius: "5px",
              color: "#fff",
              fontSize: "12px",
              padding: "6px",
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StaffList;
