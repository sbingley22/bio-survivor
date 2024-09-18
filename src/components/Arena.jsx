import { v4 as uuidv4 } from 'uuid'
import { useGameStore } from './useGameStore'
import { useRef } from 'react'
import { Environment, Stars } from '@react-three/drei'
import Player from './characters/Player'

const Arena = () => {
  const { addScore, player, level, enemies, setEnemies, enemiesAdd, setEnemyGroup } = useGameStore()
  const enemiesGroup = useRef()

  return (
    <>
      <Stars />
      <Environment preset='dawn' />

      <Player />

      {/* <group ref={enemiesGroup} >
        {enemies.map(en => (
          <Enemy 
            key={en.id} 
            id={en.id}
            position={en.position}
            type={en.type}
            splatterFlag={splatterFlag}
            setXpPickups={setXpPickups}
          />
        ))}
      </group> */}
    </>
  )
}

export default Arena
