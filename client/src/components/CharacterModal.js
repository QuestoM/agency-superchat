import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: bold;
  color: var(--text-color);
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 2px solid var(--primary-color);
  border-radius: 6px;
  font-size: 1em;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--secondary-color);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 2px solid var(--primary-color);
  border-radius: 6px;
  font-size: 1em;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--secondary-color);
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--secondary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

function CharacterModal({ isOpen, onClose, onSave, character }) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');

  useEffect(() => {
    if (character) {
      setName(character.name);
      setBio(character.bio);
      setSystemPrompt(character.systemPrompt);
    } else {
      setName('');
      setBio('');
      setSystemPrompt('');
    }
  }, [character]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, bio, systemPrompt });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <h2>{character ? 'Edit Character' : 'Add Character'}</h2>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name"
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Character Name" 
              required 
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="bio">Bio</Label>
            <TextArea 
              id="bio"
              value={bio} 
              onChange={e => setBio(e.target.value)} 
              placeholder="Character Bio" 
              required 
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="systemPrompt">System Prompt</Label>
            <TextArea 
              id="systemPrompt"
              value={systemPrompt} 
              onChange={e => setSystemPrompt(e.target.value)} 
              placeholder="System Prompt" 
              required 
            />
          </FormGroup>
          <Button type="submit">Save Character</Button>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
}

export default CharacterModal;