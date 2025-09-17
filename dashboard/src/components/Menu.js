import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState({ fullName: "", avatar: "" });
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/getUserDetails", {
          withCredentials: true,
        });
        const fullName = res.data.fullName;
        const avatar = fullName ? fullName.substring(0, 2).toUpperCase() : "";
        setUser({
          fullName,
          avatar,
        });
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
    setIsProfileDropdownOpen(false);
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/logout", {}, { withCredentials: true });
      toast.success("Logout successful!");
      window.location.href = "https://stock-trading-app-amber.vercel.app";
    } catch (err) {
      toast.error("Logout Failed!");
      console.error("Logout failed:", err);
      window.location.href = "https://stock-trading-app-amber.vercel.app";
    }
  };

  const menuStyle = {};
  const activeMenuStyle = {};

  return (
    <div className="menu-container">
      <img src="logo.png" style={{ width: "50px" }} alt="Logo" />
      <div className="menus">
        <ul>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/"
              onClick={() => handleMenuClick(0)}
            >
              <p style={selectedMenu === 0 ? activeMenuStyle : menuStyle}>
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/orders"
              onClick={() => handleMenuClick(1)}
            >
              <p style={selectedMenu === 1 ? activeMenuStyle : menuStyle}>
                Orders
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/holdings"
              onClick={() => handleMenuClick(2)}
            >
              <p style={selectedMenu === 2 ? activeMenuStyle : menuStyle}>
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/positions"
              onClick={() => handleMenuClick(3)}
            >
              <p style={selectedMenu === 3 ? activeMenuStyle : menuStyle}>
                Positions
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="funds"
              onClick={() => handleMenuClick(4)}
            >
              <p style={selectedMenu === 4 ? activeMenuStyle : menuStyle}>
                Funds
              </p>
            </Link>
          </li>
        </ul>
        <hr />
        <div className="profile-container" ref={dropdownRef}>
          <div className="profile" onClick={handleProfileClick}>
            <div className="avatar">{user.avatar}</div>
            <p className="username">{user.fullName}</p>
          </div>
          {isProfileDropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-item" onClick={handleLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
