import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";
import "../styles/admin.css";

function AdminLayout() {
  return (
    <div className="admin-layout">
      <SideBar />

      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;