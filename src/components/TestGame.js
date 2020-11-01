import React from 'react';
import { GameEngine } from 'react-game-engine';
import { MoveBox } from '../game-logic/systems';
import Box from './Box';

function TestGame() {
  return (
    <GameEngine
      style={{
        width: 800,
        height: 600,
        backgroundColor: 'blue',
      }}
      systems={[MoveBox]}
      entities={{
        box1: {x: 200, y: 200, blackPlayer: true, renderer: <Box />}
      }}
    />
  )
}

export default TestGame
