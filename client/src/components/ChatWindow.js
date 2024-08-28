import React, { useState, useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';
import MessageInput from './MessageInput';
import { SettingsContext } from '../contexts/SettingsContext';
import { sendMessage, exportChat } from '../utils/api';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { FaFileExport, FaSearch, FaSpinner, FaChartLine, FaChartBar, FaChartPie, FaTimes, FaCog, FaCode } from 'react-icons/fa';
import SettingsModal from './SettingsModal';
import LogViewer from './LogViewer';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const ChatWindowContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  background-color: var(--chat-bg);
  transition: var(--transition);
  position: relative;
`;

const MessagesContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  scroll-behavior: smooth;
  display: flex;
  flex-direction: column;
`;

const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  margin-bottom: 20px;
`;

const Message = styled.div`
  padding: 12px 16px;
  border-radius: 18px;
  max-width: 70%;
  word-wrap: break-word;
  background-color: ${props => props.$isUser ? 'var(--user-message-bg)' : 'var(--ai-message-bg)'};
  color: ${props => props.$isUser ? '#ffffff' : 'var(--text-color)'};
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  transition: var(--transition);
  margin-bottom: 4px;

  &:hover {
    box-shadow: 0 2px 5px rgba(0,0,0,0.15);
  }
`;

const ChartContainer = styled.div`
  position: absolute;
  top: 70px;
  right: 20px;
  width: 400px;
  padding: 20px;
  background-color: var(--surface-color);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: var(--transition);
  z-index: 10;
`;

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: var(--surface-color);
  border-bottom: 1px solid var(--primary-color);
`;

const ToolbarGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const ToolbarButton = styled.button`
  padding: 8px 12px;
  font-size: 14px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background-color: var(--secondary-color);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--secondary-color);
  }
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  padding-left: 32px;
  border-radius: 5px;
  border: 1px solid var(--secondary-color);
  background-color: var(--background-color);
  color: var(--text-color);
  transition: var(--transition);
  width: 200px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--primary-color);
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 10px;
  color: var(--text-color);
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: var(--primary-color);
  font-size: 24px;
`;

const ChartTypeSelector = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const ChartTypeButton = styled.button`
  padding: 6px 10px;
  font-size: 12px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background-color: var(--secondary-color);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--secondary-color);
  }
`;

const CloseChartButton = styled(FaTimes)`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  color: var(--text-color);
`;

const Button = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;

  &:hover {
    background-color: var(--secondary-color);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--secondary-color);
  }
`;

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState('line');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { settings, saveChat, currentCharacter } = useContext(SettingsContext);
  const messagesEndRef = useRef(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLogViewerOpen, setIsLogViewerOpen] = useState(false);
  const [logs, setLogs] = useState([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (message) => {
    const currentSettings = {
      character: currentCharacter?.systemPrompt,
      maxTokens: settings?.maxTokens,
      temperature: settings?.temperature
    };
    
    try {
      setIsLoading(true);
      const response = await sendMessage(message, currentSettings);
      console.log('Response from server:', response);
      if (response && response.reply) {
        setMessages(prevMessages => [...prevMessages, { text: message, isUser: true }, { text: response.reply, isUser: false }]);
      } else {
        throw new Error('Invalid response from server');
      }
      setLogs(prevLogs => [...prevLogs, { request: { message, ...currentSettings }, response: response }]);
      
      if (response.chartData) {
        setChartData(response.chartData);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      let errorMessage = "Sorry, an error occurred. Please try again.";
      if (error.response) {
        errorMessage += ` Server responded with: ${error.response.status} ${error.response.statusText}`;
        console.error('Error response:', error.response.data);
      } else if (error.request) {
        errorMessage += " No response received from the server.";
      } else {
        errorMessage += ` Error details: ${error.message}`;
      }
      setMessages(prevMessages => [...prevMessages, { text: errorMessage, isUser: false, isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await exportChat(messages);
      alert('Chat exported successfully!');
    } catch (error) {
      console.error('Error exporting chat:', error);
      alert('Failed to export chat.');
    }
  };

  const renderChart = () => {
    if (!chartData) return null;

    const options = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Campaign Performance' }
      }
    };

    switch (chartType) {
      case 'bar':
        return <Bar options={options} data={chartData} />;
      case 'pie':
        return <Pie options={options} data={chartData} />;
      default:
        return <Line options={options} data={chartData} />;
    }
  };

  const filteredMessages = messages.filter(message => {
    if (!message || typeof message !== 'object') {
      console.error('Invalid message object:', message);
      return false;
    }
    if (!message.text || typeof message.text !== 'string') {
      console.error('Invalid message text:', message.text);
      return false;
    }
    return message.text.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const detectLanguage = (text) => {
    const hebrewRegex = /[\u0590-\u05FF]/;
    return hebrewRegex.test(text) ? 'rtl' : 'ltr';
  };

  const renderMessage = (message, index) => {
    const direction = detectLanguage(message.text);
    return (
      <Message key={index} $isUser={message.isUser} className={`${direction} mixed-text`}>
        {message.text}
      </Message>
    );
  };

  const groupMessages = (messages) => {
    return messages.reduce((groups, message, index) => {
      if (index === 0 || messages[index - 1].isUser !== message.isUser) {
        groups.push([message]);
      } else {
        groups[groups.length - 1].push(message);
      }
      return groups;
    }, []);
  };

  return (
    <ChatWindowContainer>
      <ToolbarContainer>
        <ToolbarGroup>
          <ToolbarButton onClick={handleExport}><FaFileExport /> Export Chat</ToolbarButton>
          <SearchContainer>
            <SearchIcon />
            <SearchInput 
              type="text" 
              placeholder="Search messages..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarButton onClick={() => setIsSettingsOpen(true)}><FaCog /> Settings</ToolbarButton>
          <ToolbarButton onClick={() => setIsLogViewerOpen(true)}><FaCode /> View Logs</ToolbarButton>
        </ToolbarGroup>
      </ToolbarContainer>
      <MessagesContainer>
        {groupMessages(filteredMessages).map((group, groupIndex) => (
          <MessageGroup key={groupIndex} $isUser={group[0].isUser}>
            {group.map((message, messageIndex) => renderMessage(message, `${groupIndex}-${messageIndex}`))}
          </MessageGroup>
        ))}
        {isLoading && (
          <LoadingIndicator>
            <FaSpinner />
          </LoadingIndicator>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      {chartData && (
        <ChartContainer>
          <CloseChartButton onClick={() => setChartData(null)} />
          {renderChart()}
          <ChartTypeSelector>
            <ChartTypeButton onClick={() => setChartType('line')}><FaChartLine /> Line</ChartTypeButton>
            <ChartTypeButton onClick={() => setChartType('bar')}><FaChartBar /> Bar</ChartTypeButton>
            <ChartTypeButton onClick={() => setChartType('pie')}><FaChartPie /> Pie</ChartTypeButton>
          </ChartTypeSelector>
        </ChartContainer>
      )}
      <MessageInput onSendMessage={handleSendMessage} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <LogViewer isOpen={isLogViewerOpen} onClose={() => setIsLogViewerOpen(false)} logs={logs} />
    </ChatWindowContainer>
  );
}

export default ChatWindow;