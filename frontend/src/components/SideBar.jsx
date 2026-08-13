import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdInventory,
  MdAddBox,
  MdBarChart,
  MdWarningAmber,
  MdLogout,
} from "react-icons/md";

function SideBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="sidebar">
      <h2>BillMaster</h2>

      <NavLink to="/admin/dashboard">
        <MdDashboard />
        <span>Dashboard</span>
      </NavLink>

      <NavLink to="/admin/products">
        <MdInventory />
        <span>Products</span>
      </NavLink>

      <NavLink to="/admin/add-product">
        <MdAddBox />
        <span>Add Product</span>
      </NavLink>

      <NavLink to="/admin/reports">
        <MdBarChart />
        <span>Sales Report</span>
      </NavLink>

      <NavLink to="/admin/low-stock">
        <MdWarningAmber />
        <span>Low Stock</span>
      </NavLink>

      <div className="sidebar-divider" />

      <button className="logout-btn" onClick={handleLogout}>
        <MdLogout />
        <span>Logout</span>
      </button>
    </div>
  );
}

export default SideBar;