import React from "react";
import Sidebar from "./Components/Sidebar";
import Appointment from "./pages/appointment/Appointment";
import Detailing from "./pages/appointment/Detailing";
import OnsiteAppointment from "./pages/appointment/OnsiteAppointment";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StaffList from "./pages/Employees/StaffList";
import Reviews from "./pages/Reviews/Reviews";
import FeedbackForm from "./pages/Reviews/Feedback";
import Dash from "./pages/dashboard/ServiceDashboard";
import AddInventoryItemForm from "./pages/Inventory/CreateForm";
import Details from "./pages/Inventory/Details";
import RequestForm from "./pages/Inventory/RequestForm";
import InventoryList from "./pages/Inventory/InventoryList";
import RequestFormEdit from "./pages/Inventory/RequestFormEdit";
import Invoice from "./pages/invoice/Invoice";
import CreateAppointment from "./pages/appointment/CreateAppointment";
import CheckEmail from "./auth/CheckEmail";
import Registration from "./auth/Registration";
import SigninCard from "./auth/signin";
import PasswordForgott from "./auth/passwordForgot";
import PasswordChange from "./auth/changingPassword";
import SignOut from "./auth/logout";
import Customers from "./pages/customers/Customers";
import ServiceCenterProfile from "./pages/profile/ServiceCenterProfile";
import EditCenter from "./pages/profile/EditCenter";
import Notifications from "./pages/notification/Notifications";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/*authentication*/}
          <Route path="/" element={<SigninCard />} />
          <Route path="/ServiceCenter/ForgotPassword" element={<PasswordForgott />} />
          <Route path="/ServiceCenter/ChangePassword" element={<PasswordChange />} />
          <Route path="/ServiceCenter/CheckEmail" element={<CheckEmail />} />
          <Route path="/ServiceCenter/Registration" element={<Registration />} />
          <Route path="/ServiceCenter/SignOut" element={<SignOut />} />
          <Route
            path="/*"
            element={
              <>
                <Sidebar />
                <Routes>
                  {/*Dashboard*/}
                  <Route path="/ServiceCenter/Dashboard" element={<Dash />} />
                  {/*Appointments*/}
                  <Route path="/ServiceCenter/Appointment" element={<Appointment />} />
                  <Route path="/ServiceCenter/createAppointment" element={<CreateAppointment />} />

                  <Route path="/ServiceCenter/Onsite" element={<OnsiteAppointment />} />



                  <Route path="/ServiceCenter/appointments" element={<Detailing />} />



                  
                  {/*Employee*/}
                  <Route path="/ServiceCenter/Employees" element={<StaffList />} />
                  {/*Customers*/}
                  <Route path="/ServiceCenter/Customers" element={<Customers />} />
                  {/*Reviwes*/}
                  <Route path="/ServiceCenter/Reviews" element={<Reviews />} />
                  <Route path="/ServiceCenter/Feedback" element={<FeedbackForm />} />
                  {/*Inventory*/}
                  <Route path="/ServiceCenter/Inventory" element={<Details />} />
                  <Route path="/ServiceCenter/CreateForm" element={<AddInventoryItemForm />} />
                  <Route path="/ServiceCenter/RequestForm" element={<RequestForm />} />
                  {/* <Route path="/EditIventory" element={<EditIventory />} /> */}
                  <Route path="/ServiceCenter/InventoryList" element={<InventoryList />} />
                  <Route
                    path="/ServiceCenter/RequestFormEdit"
                    element={<RequestFormEdit />}
                  />
                  {/*Invoice*/}
                  <Route path="/ServiceCenter/Invoice" element={<Invoice />} />
                  {/*Notifications*/}
                  <Route path="/ServiceCenter/Notifications" element={<Notifications />} />
                  {/*Profile*/}
                  <Route path="/ServiceCenter/profile" element={<ServiceCenterProfile />} />
                  <Route path="/ServiceCenter/editDetails" element={<EditCenter />} />
                </Routes>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
export default App;
