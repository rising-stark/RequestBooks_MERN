import React, { useState } from "react";
import { AppBar, Tab, Tabs, Toolbar } from "@mui/material";
import { NavLink } from "react-router-dom";
const Header = () => {
  const [value, setValue] = useState(0);
  return (
    <div>
      <AppBar sx={{ backgroundColor: "#232F3D" }} position="sticky">
        <Toolbar>
          <Tabs
            textColor="inherit"
            indicatorColor="primary"
            value={value}
            onChange={(e, val) => setValue(val)}
          >
            <Tab LinkComponent={NavLink} to="/" label="Home" />
            <Tab LinkComponent={NavLink} to="/bookrequest" label="Request a book" />
          </Tabs>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
