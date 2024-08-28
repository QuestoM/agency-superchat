import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { SettingsContext } from '../contexts/SettingsContext';
import CharacterModal from './CharacterModal';

const SidebarContainer = styled.div`
  width: ${props => props.$isOpen ? '300px' : '0'};
  background-color: var(--surface-color);
  color: var(--sidebar-text);
  height: 100%;
  overflow-y: auto;
  transition: width 0.3s ease;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
`;

const SidebarContent = styled.div`
  padding: 20px;
  opacity: ${props => props.$isOpen ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const CharacterList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const CharacterItem = styled.li`
  margin-bottom: 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: ${props => props.$isActive ? 'rgba(74, 144, 226, 0.1)' : 'transparent'};
  border: 1px solid ${props => props.$isActive ? 'var(--primary-color)' : 'transparent'};
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: rgba(74, 144, 226, 0.05);
  }
`;

const CharacterHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 15px;
  cursor: pointer;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$isActive ? '#4CAF50' : '#bdbdbd'};
  margin-right: 10px;
`;

const CharacterName = styled.div`
  font-weight: ${props => props.$isActive ? 'bold' : 'normal'};
  color: var(--text-color);
`;

const CharacterBio = styled.div`
  position: fixed;
  background-color: var(--surface-color);
  padding: 15px;
  font-size: 0.9em;
  color: var(--text-color);
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 250px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 100;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    border-width: 10px 10px 10px 0;
    border-style: solid;
    border-color: transparent var(--surface-color) transparent transparent;
  }
`;

const AddCharacterButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 15px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;

  &:hover {
    background-color: var(--secondary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

function Sidebar({ isOpen }) {
  const { characters, currentCharacter, setCurrentCharacter, addCharacter, updateCharacter } = useContext(SettingsContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [hoveredCharacter, setHoveredCharacter] = useState(null);

  const handleCharacterClick = (character) => {
    setCurrentCharacter(character);
  };

  const handleAddCharacter = () => {
    setEditingCharacter(null);
    setIsModalOpen(true);
  };

  const handleEditCharacter = (character) => {
    setEditingCharacter(character);
    setIsModalOpen(true);
  };

  const handleSaveCharacter = (character) => {
    if (editingCharacter) {
      updateCharacter(character);
    } else {
      addCharacter(character);
    }
    setIsModalOpen(false);
  };

  const handleMouseEnter = (character, event) => {
    setHoveredCharacter(character);
    const bio = document.getElementById('character-bio');
    if (bio) {
      bio.style.left = `${event.clientX + 10}px`;
      bio.style.top = `${event.clientY + 10}px`;
      bio.style.opacity = '1';
      bio.style.visibility = 'visible';
    }
  };

  const handleMouseLeave = () => {
    setHoveredCharacter(null);
    const bio = document.getElementById('character-bio');
    if (bio) {
      bio.style.opacity = '0';
      bio.style.visibility = 'hidden';
    }
  };

  const handleMouseMove = (event) => {
    const bio = document.getElementById('character-bio');
    if (bio) {
      bio.style.left = `${event.clientX + 10}px`;
      bio.style.top = `${event.clientY + 10}px`;
    }
  };

  return (
    <SidebarContainer $isOpen={isOpen}>
      <SidebarContent $isOpen={isOpen}>
        <h2>Characters</h2>
        <CharacterList>
          {characters && characters.length > 0 ? (
            characters.map(character => (
              <CharacterItem 
                key={character.id} 
                $isActive={currentCharacter && currentCharacter.id === character.id}
                onMouseEnter={(e) => handleMouseEnter(character, e)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                <CharacterHeader 
                  onClick={() => handleCharacterClick(character)}
                  onDoubleClick={() => handleEditCharacter(character)}
                >
                  <StatusDot $isActive={currentCharacter && currentCharacter.id === character.id} />
                  <CharacterName $isActive={currentCharacter && currentCharacter.id === character.id}>
                    {character.name}
                  </CharacterName>
                </CharacterHeader>
              </CharacterItem>
            ))
          ) : (
            <div>No characters available</div>
          )}
        </CharacterList>
        <AddCharacterButton onClick={handleAddCharacter}>Add Character</AddCharacterButton>
        <CharacterModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCharacter}
          character={editingCharacter}
        />
      </SidebarContent>
      <CharacterBio id="character-bio">
        {hoveredCharacter && hoveredCharacter.bio}
      </CharacterBio>
    </SidebarContainer>
  );
}

export default Sidebar;