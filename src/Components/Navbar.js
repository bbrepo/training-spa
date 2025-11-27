/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import Logo from "../Assets/Logo.svg";
import { HiOutlineBars3 } from "react-icons/hi2";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import WorkIcon from "@mui/icons-material/Work";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setOpenMenu(false);
  };

  const menuOptions = [
    {
      text: "Home",
      icon: <HomeIcon />,
      sectionId: "home",
    },
    {
      text: "About",
      icon: <InfoIcon />,
      sectionId: "about",
    },
    {
      text: "Services",
      icon: <WorkIcon />,
      sectionId: "services",
    },
    {
      text: "Testimonials",
      icon: <CommentRoundedIcon />,
      sectionId: "testimonials",
    },
    {
      text: "Contact",
      icon: <PhoneRoundedIcon />,
      sectionId: "contact",
    },
  ];

  return (
    <nav>
      <div className="nav-logo-container">
        <img src={Logo} alt="" />
      </div>
      <div className="navbar-links-container">
        <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a>
        <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Services</a>
        <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>Courses & Fees</a>
        <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>Testimonials</a>
        <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact us</a>
      </div>
      <div className="navbar-register-container">
        {isAuthenticated ? (
          <div className="navbar-user-info">
            <span className="user-name">Hi, {user?.name.split(' ').slice(0, 2).join(' ')}</span>
            <button className="logout-button" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="primary-button" onClick={() => setShowAuthModal(true)}>
            Register Now
          </button>
        )}
      </div>
      <div className="navbar-menu-container">
        <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
      </div>
      <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="right">
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setOpenMenu(false)}
          onKeyDown={() => setOpenMenu(false)}
        >
          <List>
            {menuOptions.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => scrollToSection(item.sectionId)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </nav>
  );
};

export default Navbar;
