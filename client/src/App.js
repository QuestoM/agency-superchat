import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { SettingsProvider } from './contexts/SettingsContext';
import GlobalStyles from './styles/GlobalStyles';
import SettingsModal from './components/SettingsModal';
import { testServerConnection } from './api';

const lightTheme = {
  primary: '#4a90e2',
  secondary: '#50e3c2',
  background: '#f5f7fa',
  surface: '#ffffff',
  text: '#333333',
  chatBackground: '#e6eaf0',
  userMessage: '#4a90e2',
  aiMessage: '#ffffff',
  sidebarText: '#333333',
};

const darkTheme = {
  primary: '#bb86fc',
  secondary: '#03dac6',
  background: '#121212',
  surface: '#1e1e1e',
  text: '#ffffff',
  chatBackground: '#2d2d2d',
  userMessage: '#bb86fc',
  aiMessage: '#1e1e1e',
  sidebarText: '#ffffff',
};

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MainContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);
  const logout = () => {
    // Implement logout functionality
    console.log('Logout clicked');
  };

  useEffect(() => {
    testServerConnection()
      .then(() => console.log('Server connection successful'))
      .catch(error => console.error('Server connection failed:', error));
  }, []);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <SettingsProvider>
        <Router>
          <GlobalStyles />
          <AppContainer>
            <Header 
              toggleTheme={toggleTheme} 
              isDarkMode={isDarkMode} 
              toggleSidebar={toggleSidebar} 
              isSidebarOpen={isSidebarOpen}
              openSettings={openSettings}
              logout={logout}
            />
            <MainContainer>
              <Sidebar isOpen={isSidebarOpen} />
              <ContentContainer>
                <ChatWindow />
              </ContentContainer>
            </MainContainer>
          </AppContainer>
          <SettingsModal isOpen={isSettingsOpen} onClose={closeSettings} />
        </Router>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;