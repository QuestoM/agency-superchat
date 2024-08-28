import React from 'react';
import styled from 'styled-components';
import { FaMoon, FaSun, FaBars, FaRobot, FaCog, FaSignOutAlt } from 'react-icons/fa';

const HeaderContainer = styled.header`
  background-color: var(--surface-color);
  color: var(--text-color);
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled(FaRobot)`
  font-size: 1.8em;
  margin-right: 10px;
  color: var(--primary-color);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5em;
  font-weight: bold;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.2em;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;

  &:hover {
    color: var(--primary-color);
  }
`;

function Header({ toggleTheme, isDarkMode, toggleSidebar, isSidebarOpen, openSettings, logout }) {
  return (
    <HeaderContainer>
      <LogoContainer>
        <IconButton onClick={toggleSidebar}>
          <FaBars />
        </IconButton>
        <Logo />
        <Title>SuperChat</Title>
      </LogoContainer>
      <ButtonGroup>
        <IconButton onClick={openSettings} title="Settings">
          <FaCog />
        </IconButton>
        <IconButton onClick={toggleTheme} title={isDarkMode ? "Light Mode" : "Dark Mode"}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </IconButton>
        <IconButton onClick={logout} title="Logout">
          <FaSignOutAlt />
        </IconButton>
      </ButtonGroup>
    </HeaderContainer>
  );
}

export default Header;