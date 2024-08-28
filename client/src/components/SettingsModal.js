import React, { useContext } from 'react';
import styled from 'styled-components';
import { SettingsContext } from '../contexts/SettingsContext';

const ModalOverlay = styled.div`
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

const ModalContent = styled.div`
  background-color: var(--surface-color);
  padding: 30px;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const SettingsForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SettingGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: bold;
  color: var(--text-color);
  font-size: 1em;
`;

const SettingsSelect = styled.select`
  padding: 10px;
  border-radius: 6px;
  border: 2px solid var(--primary-color);
  background-color: var(--background-color);
  color: var(--text-color);
  font-size: 0.9em;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--secondary-color);
  }
`;

const SettingsInput = styled.input`
  padding: 10px;
  border-radius: 6px;
  border: 2px solid var(--primary-color);
  background-color: var(--background-color);
  color: var(--text-color);
  font-size: 0.9em;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--secondary-color);
  }
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Slider = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  transition: opacity .2s;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
  }
`;

const NumberInput = styled(SettingsInput)`
  width: 70px;
  padding: 5px;
  text-align: center;
  -moz-appearance: textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const SettingsButton = styled.button`
  padding: 10px 20px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1em;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--secondary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

function SettingsModal({ isOpen, onClose }) {
  const { settings, setSettings } = useContext(SettingsContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <h2>Settings</h2>
        <SettingsForm onSubmit={handleSubmit}>
          <SettingGroup>
            <Label htmlFor="model">Model</Label>
            <SettingsSelect 
              id="model"
              value={settings.model} 
              onChange={e => setSettings({...settings, model: e.target.value})}
            >
              <option value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet</option>
              <option value="claude-3-opus-20240229">Claude 3 Opus</option>
              <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
              <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
            </SettingsSelect>
          </SettingGroup>
          <SettingGroup>
            <Label htmlFor="apiKey">API Key</Label>
            <SettingsInput 
              id="apiKey"
              type="password" 
              placeholder="Enter your API Key" 
              value={settings.apiKey} 
              onChange={e => setSettings({...settings, apiKey: e.target.value})}
            />
          </SettingGroup>
          <SettingGroup>
            <Label htmlFor="temperature">Temperature: {settings.temperature}</Label>
            <SliderContainer>
              <Slider 
                type="range" 
                id="temperature"
                min="0" 
                max="1" 
                step="0.1" 
                value={settings.temperature} 
                onChange={e => setSettings({...settings, temperature: parseFloat(e.target.value)})}
              />
              <NumberInput 
                type="number" 
                min="0" 
                max="1" 
                step="0.1" 
                value={settings.temperature} 
                onChange={e => setSettings({...settings, temperature: parseFloat(e.target.value)})}
              />
            </SliderContainer>
          </SettingGroup>
          <SettingGroup>
            <Label htmlFor="maxTokens">Max Tokens: {settings.maxTokens}</Label>
            <SliderContainer>
              <Slider 
                type="range" 
                id="maxTokens"
                min="1" 
                max="4000" 
                value={settings.maxTokens} 
                onChange={e => setSettings({...settings, maxTokens: parseInt(e.target.value)})}
              />
              <NumberInput 
                type="number" 
                min="1" 
                max="4000" 
                value={settings.maxTokens} 
                onChange={e => setSettings({...settings, maxTokens: parseInt(e.target.value)})}
              />
            </SliderContainer>
          </SettingGroup>
          <SettingsButton type="submit">Save Settings</SettingsButton>
        </SettingsForm>
      </ModalContent>
    </ModalOverlay>
  );
}

export default SettingsModal;