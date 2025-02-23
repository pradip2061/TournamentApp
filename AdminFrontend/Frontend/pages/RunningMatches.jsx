import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';

const RunningMatches = () => {
  const [matches, setMatches] = useState([
    {matchType: 'CS', bet: 200, gunAttribute: true},
  ]);

  useEffect(() => {
    const fetchMatches = async () => {
      const response = await fetch('https://api.example.com/matches');
      const data = await response.json();
      setMatches(data);
    };
    fetchMatches();
  }, [matches]);

  return <></>;
};

export default RunningMatches;
