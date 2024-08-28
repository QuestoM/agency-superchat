import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  display: flex;
  padding: 15px;
  background-color: var(--surface-color);
`;

const Input = styled.textarea`
  flex-grow: 1;
  padding: 10px;
  border: none;
  border-radius: 20px;
  margin-right: 10px;
  resize: none;
  min-height: 40px;
  max-height: 120px;
  overflow-y: auto;
  direction: ${props => props.direction};
`;

const SendButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
`;

function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState('');
  const [direction, setDirection] = useState('ltr');
  const inputRef = useRef(null);

  const detectLanguage = (text) => {
    const hebrewRegex = /[\u0590-\u05FF]/;
    return hebrewRegex.test(text) ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    setDirection(detectLanguage(message));
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <InputContainer>
      <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%' }}>
        <Input
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          direction={direction}
        />
        <SendButton type="submit">Send</SendButton>
      </form>
    </InputContainer>
  );
}

export default MessageInput;