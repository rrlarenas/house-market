import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import PrivateRoutes from "./components/PrivateRoutes";
import Explore from "./pages/Explore";
import Offers from "./pages/Offers";
import Profile from "./pages/Profile";
import Signin from "./pages/Signin";
import Signout from "./pages/Signout";
import Signup from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Categories from "./pages/Categories";
import CreateListing from "./pages/CreateListing";
import Listing from "./pages/Listing";
import Contact from "./pages/Contact";
import EditListing from "./pages/EditListing";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/category/:categoryName" element={<Categories />} />
          <Route path="/profile" element={<PrivateRoutes />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/sign-out" element={<Signout />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path='/create-listing' element = {<CreateListing />} />
          <Route path="/category/:categoryName/:listingId" element = {<Listing />} />
          <Route path='/contact/:landlordId' element = {<Contact />} />
          <Route path='/edit-listing/:listingId' element = {<EditListing />} />
        </Routes>
        <Navbar />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
