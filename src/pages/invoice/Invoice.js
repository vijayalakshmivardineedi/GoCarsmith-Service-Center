import * as React from "react";
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { BiRupee } from "react-icons/bi";
import { BiSolidReceipt, BiSolidTimer } from "react-icons/bi";
import { BsFillFileEarmarkCheckFill } from "react-icons/bs";
import { RiDraftFill } from "react-icons/ri";
import axios from "axios";
import InvoiceList from "./InvoiceList";

const Invoice = () => {
  const serviceCenterId = localStorage.getItem("_id");
  const [invoices, setInvoices] = React.useState([]);
  const token = localStorage.getItem("token");

  React.useEffect(() => {
    fetchInvoices();
  }, [serviceCenterId]);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get(
        `https://gocarsmithbackend.onrender.com/api/ServiceCenter/getServiceCenterInvoiceBy/${serviceCenterId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setInvoices(response.data || []);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const fetchInvoicesAfterCRUD = async () => {
    await fetchInvoices();
  };

  const countInvoices = (invoices) => {
    const counts = invoices.reduce(
      (accumulator, invoice) => {
        if (invoice.status === "Pending") {
          accumulator.pendingCount += 1;
          accumulator.pendingAmount += invoice.total;
        } else if (invoice.status === "Completed") {
          accumulator.completedCount += 1;
          accumulator.completedAmount += invoice.total;
        } else if (invoice.status === "Draft") {
          accumulator.draftCount += 1;
          accumulator.draftAmount += invoice.total;
        }
        return accumulator;
      },
      {
        pendingCount: 0,
        completedCount: 0,
        draftCount: 0,
        pendingAmount: 0,
        completedAmount: 0,
        draftAmount: 0,
      }
    );
    return counts;
  };

  const invoiceCounts = countInvoices(invoices);

  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Grid container spacing={2} style={{ marginBottom: "10px" }}>
            <Grid item xs={12}>
              <Typography variant="h4" sx={{ fontWeight: "700" }}>
                Invoice
              </Typography>
            </Grid>
          </Grid>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              marginBottom: "15px",
              marginTop: "15px",
              justifyContent: "space-between",
              marginLeft: "15px",
              marginRight: "15px",
            }}
          >
            <div>
              <Grid container spacing={3}>
                <Grid item>
                  <div
                    style={{
                      position: "relative",
                      width: "75px",
                      height: "75px",
                      marginLeft: "150px",
                    }}
                  >
                    <CircularProgress
                      variant="determinate"
                      value={100}
                      size={75}
                      style={{ color: "green" }}
                    />
                    <BiSolidReceipt
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        color: "green",
                        transform: "translate(-50%, -50%)",
                        fontSize: 35,
                      }}
                    />
                  </div>
                </Grid>
                <Grid
                  item
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <Stack spacing={0}>
                    <Typography variant="h6">Total</Typography>
                    <p style={{ marginBottom: "5px" }}>
                      {invoices.length} Invoices
                    </p>
                    <h5 style={{ marginTop: "-3px" }}>
                      <BiRupee />{" "}
                      {invoiceCounts.completedAmount +
                        invoiceCounts.pendingAmount}
                    </h5>
                  </Stack>
                </Grid>
              </Grid>
            </div>
            <div>
              <Grid container spacing={3}>
                <Grid item>
                  <div
                    style={{
                      position: "relative",
                      width: "75px",
                      height: "75px",
                    }}
                  >
                    <CircularProgress
                      variant="determinate"
                      value={40}
                      size={75}
                      style={{ color: "steelblue" }}
                    />
                    <BsFillFileEarmarkCheckFill
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        color: " steelblue ",
                        transform: "translate(-50%, -50%)",
                        fontSize: 35,
                      }}
                    />
                  </div>
                </Grid>
                <Grid
                  item
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <Stack spacing={0}>
                    <Typography variant="h6">Paid</Typography>
                    <p style={{ marginBottom: "5px" }}>
                      {invoiceCounts.completedCount} Invoices
                    </p>
                    <h5 style={{ marginTop: "-3px" }}>
                      <BiRupee />
                      {invoiceCounts.completedAmount}
                    </h5>
                  </Stack>
                </Grid>
              </Grid>
            </div>
            <div>
              <Grid container spacing={3} style={{ marginRight: "150px" }}>
                <Grid item>
                  <div
                    style={{
                      position: "relative",
                      width: "75px",
                      height: "75px",
                    }}
                  >
                    <CircularProgress
                      variant="determinate"
                      value={20}
                      size={75}
                      style={{ color: "orange" }}
                    />
                    <BiSolidTimer
                      style={{
                        position: "absolute",
                        top: "50%",
                        color: "orange",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: 35,
                      }}
                    />
                  </div>
                </Grid>
                <Grid
                  item
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <Stack spacing={0}>
                    <Typography variant="h6">Pending</Typography>
                    <p style={{ marginBottom: "5px" }}>
                      {invoiceCounts.pendingCount} Invoices
                    </p>
                    <h5 style={{ marginTop: "-3px" }}>
                      <BiRupee />
                      {invoiceCounts.pendingAmount}
                    </h5>
                  </Stack>
                </Grid>
              </Grid>
            </div>
          </Stack>
          <InvoiceList
            invoices={invoices}
            fetchInvoicesAfterCRUD={fetchInvoicesAfterCRUD}
          />
        </Box>
      </Box>
    </div>
  );
};
export default Invoice;
