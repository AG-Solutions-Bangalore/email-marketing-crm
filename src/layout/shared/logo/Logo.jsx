import { styled } from "@mui/material";

import { Link } from "react-router-dom";
import logosmall from "../../../assets/receipt/ag_logo.png";
import logstrucn from "../../../assets/profile/user_1.png";
const LinkStyled = styled(Link)(() => ({
  height: "63px",
  width: "220px",
  overflow: "hidden",
  display: "block",
}));
const LargeLinkStyled = styled(Link)(() => ({
  height: "63px",
  width: "70px",
  overflow: "hidden",
  display: "block",
}));

const Logo = ({ isCollapsed }) => {
  return (
    <>
      {!isCollapsed ? (
        <LinkStyled to="/home">
          <img src={logosmall} alt="logo" className="h-16" priority />
        </LinkStyled>
      ) : (
        <LargeLinkStyled to="/home">
          <img src={logstrucn} alt="logo" className="h-16" priority />
        </LargeLinkStyled>
      )}
    </>
  );
};

export default Logo;
