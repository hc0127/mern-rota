
//import useState hook to create menu collapse state
import React, { useState } from "react";

//import react pro sidebar components
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";

//import icons from react icons
import { FaAddressBook, FaCalculator, FaCalendar, FaCalendarDay, FaList } from "react-icons/fa";
import { FiHome, FiLogOut, FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import { NavLink as Link } from 'react-router-dom';

//import sidebar css from react-pro-sidebar module and our custom css 
import "react-pro-sidebar/dist/css/styles.css";
import styled from 'styled-components';

export const NavLink = styled(Link)`
color: #ffffff;
font-family:Roboto,Helvetica Neue,sans-serif;
font-size: 16px;
display: flex;
align-items: center;
text-decoration: none;
padding: 5px 12px;
height: 100%;
cursor: pointer;
&.active {
	color: white;
	background-color: #0088ff;
}
`;

const Sidebar = () => {
  
    //create initial menuCollapse state using useState hook
    const [menuCollapse, setMenuCollapse] = useState(true)

    //create a custom function that will change menucollapse state from false to true and true to false
  const menuIconClick = () => {
    //condition checking to change state from true to false and vice versa
    menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
  };

  return (
    <>
      <div id="sidebar">
          {/* collapsed props to change menu size using menucollapse state */}
        <div className="closemenu" onClick={menuIconClick}>
            {menuCollapse ? (
            <FiArrowRightCircle/>
            ) : (
            <FiArrowLeftCircle/>
            )}
        </div>
        <ProSidebar collapsed={menuCollapse}>
          <SidebarHeader>
          <div className="logotext mt-5">
                
            </div>
          </SidebarHeader>
          <SidebarContent>
            <Menu iconShape="square">
              <MenuItem icon={<FaAddressBook size='sm' className="text-primary" />}><NavLink to='basic'>Basic</NavLink></MenuItem>
              <MenuItem icon={<FaCalendarDay size='sm' className="text-primary"  />}><NavLink to='assign'>Assign</NavLink></MenuItem>
              <MenuItem icon={<FaCalculator size='sm' className="text-primary" />}><NavLink to='total'>Total</NavLink></MenuItem>
            </Menu>
          </SidebarContent>
          <SidebarFooter>
            <Menu iconShape="square">
              <MenuItem icon={<FiLogOut />}>Logout</MenuItem>
            </Menu>
          </SidebarFooter>
        </ProSidebar>
      </div>
    </>
  );
};

export default Sidebar;
