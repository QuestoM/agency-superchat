exports.getCharacters = (req, res) => {
  const characters = [
    { id: 1, name: 'Campaign Manager', bio: 'Expert in planning and executing advertising campaigns.' },
    { id: 2, name: 'Media Strategist', bio: 'Specialist in optimizing media buying and placement.' },
    { id: 3, name: 'Creative Director', bio: 'Experienced in developing innovative advertising concepts.' },
    { id: 4, name: 'Data Analyst', bio: 'Skilled in interpreting campaign data and providing insights.' },
    { id: 5, name: 'Programmatic Expert', bio: 'Specialized in programmatic advertising and real-time bidding.' },
  ];
  res.json(characters);
};