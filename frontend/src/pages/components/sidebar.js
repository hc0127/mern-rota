
//import useState hook to create menu collapse state
import React, { Component, useState } from "react";

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
import { FaAddressBook, FaCalculator, FaCalendar, FaCalendarDay, FaDashcube, FaList } from "react-icons/fa";
import { FiHome, FiLogOut, FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import { NavLink as Link } from 'react-router-dom';
import {connect} from 'react-redux'
import {
  logOut
} from './../../store/Actions/BasicAction';

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

class Sidebar extends Component{
  constructor(props){
    super(props);
    this.state ={
      menuCollapse:true,
    };
  }
  menuIconClick = () => {
    this.setState({
      menuCollapse:!this.state.menuCollapse
    });
  };

  render(){
      return (
        <>
          <div id="sidebar">
            <div className="closemenu" onClick={this.menuIconClick}>
                {this.state.menuCollapse ? (
                <FiArrowRightCircle/>
                ) : (
                <FiArrowLeftCircle/>
                )}
            </div>
            <ProSidebar collapsed={this.state.menuCollapse}>
              <SidebarHeader>
              <div className="logotext mt-5">
                    
                </div>
              </SidebarHeader>
              <SidebarContent>
                <Menu iconShape="square">
                  <MenuItem icon={<FaDashcube className="text-primary" />}><NavLink to=''>DashBoard</NavLink></MenuItem>
                  <MenuItem icon={<FaAddressBook className="text-primary" />}><NavLink to='basic'>Basic</NavLink></MenuItem>
                  <MenuItem icon={<FaCalendarDay className="text-primary"  />}><NavLink to='roaster'>Assign</NavLink></MenuItem>
                  <MenuItem icon={<FaCalculator className="text-primary" />}><NavLink to='total'>Total</NavLink></MenuItem>
                </Menu>
              </SidebarContent>
              <SidebarFooter>
                <Menu iconShape="square">
                  <MenuItem icon={<FiLogOut />} onClick = {() =>this.props.logOut()}>Logout</MenuItem>
                </Menu>
              </SidebarFooter>
            </ProSidebar>
          </div>
        </>
      );
  }
};

const mapDispatchToProps = (dispatch) => ({
  logOut:() =>dispatch(logOut())
});

export default connect(null,mapDispatchToProps)(Sidebar)
