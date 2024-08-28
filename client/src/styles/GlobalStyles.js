import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: ${props => props.theme.primary};
    --secondary-color: ${props => props.theme.secondary};
    --background-color: ${props => props.theme.background};
    --surface-color: ${props => props.theme.surface};
    --text-color: ${props => props.theme.text};
    --chat-bg: ${props => props.theme.chatBackground};
    --user-message-bg: ${props => props.theme.userMessage};
    --ai-message-bg: ${props => props.theme.aiMessage};
    --sidebar-text: ${props => props.theme.sidebarText};
    --transition: all 0.3s ease;
  }

  body {
    font-family: 'Roboto', 'Arial', 'Helvetica', sans-serif;
    margin: 0;
    padding: 0;
    background-color: var(--background-color);
    color: var(--text-color);
    transition: var(--transition);
  }

  .main-container {
    display: flex;
    height: calc(100vh - 60px);
  }

  * {
    box-sizing: border-box;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--surface-color);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--secondary-color);
  }

  .rtl {
    direction: rtl;
    text-align: right;
  }

  .ltr {
    direction: ltr;
    text-align: left;
  }

  .mixed-text {
    unicode-bidi: plaintext;
  }
`;

export default GlobalStyles;