import React from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';

const LogViewerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LogViewerContent = styled.div`
  background-color: var(--surface-color);
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  height: 90%;
  max-width: 800px;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: var(--text-color);
`;

const LogEntry = styled.div`
  margin-bottom: 20px;
  border: 1px solid var(--primary-color);
  border-radius: 5px;
  padding: 10px;
`;

const LogTitle = styled.h3`
  margin-top: 0;
`;

const LogText = styled.pre`
  white-space: pre-wrap;
  word-wrap: break-word;
`;

function LogViewer({ isOpen, onClose, logs }) {
  if (!isOpen) return null;

  return (
    <LogViewerOverlay onClick={onClose}>
      <LogViewerContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}><FaTimes /></CloseButton>
        <h2>API Logs</h2>
        {logs.map((log, index) => (
          <LogEntry key={index}>
            <LogTitle>Request:</LogTitle>
            <LogText>{JSON.stringify(log.request, null, 2)}</LogText>
            <LogTitle>Character (System Prompt):</LogTitle>
            <LogText>{log.request.system || "Not provided"}</LogText>
            <LogTitle>Max Tokens:</LogTitle>
            <LogText>{log.request.maxTokens || "Default (1024)"}</LogText>
            <LogTitle>Temperature:</LogTitle>
            <LogText>{log.request.temperature || "Default (0.7)"}</LogText>
            <LogTitle>Response:</LogTitle>
            <LogText>{JSON.stringify(log.response, null, 2)}</LogText>
          </LogEntry>
        ))}
      </LogViewerContent>
    </LogViewerOverlay>
  );
}

export default LogViewer;