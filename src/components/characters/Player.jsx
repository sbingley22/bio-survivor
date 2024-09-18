/* eslint-disable react/no-unknown-property */
import { useEffect, useRef, useState } from "react"
import { useGameStore } from "../useGameStore"
import { useKeyboardControls } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import CharModel from "./CharModel"
import { playerMovement, cameraControls, cameraFollow } from "../gameHelper"

const Player = () => {
  const { setMode, options, getVolume, getMute, getGamepad, level, setScore, getScore, player, setPlayer, enemyGroup, inventory, inventorySlot, setInventorySlot, inventoryRemoveItem, setHudInfoParameter } = useGameStore()
  const group = useRef()
  const [model, setModel] = useState("Diver")
  const anim = useRef("float idle")
  const transition = useRef("float idle")
  const [, getKeys] = useKeyboardControls()
  const { camera } = useThree()

  const isMouseDown = useRef(false)
  const mouseStartPos = useRef({ x: 0, y: 0 })
  const mouseCurrentPos = useRef({ x: 0, y: 0 })

  const baseSpeed = 4.0
  const speedMultiplier = useRef(1.0)
  const damageMultiplier = useRef(1.0)
  const damageResistanceMultiplier = useRef(1.0)

  const inventoryHeld = useRef(false)
  const inventoryUseHeld = useRef(false)
  const targetedEnemy = useRef(null)

  // Mouse Events
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (!options.useMouse) return
      isMouseDown.current = true
      mouseStartPos.current = { x: e.clientX, y: e.clientY }
      mouseCurrentPos.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseMove = (e) => {
      if (!options.useMouse) return
      if (isMouseDown.current) {
        mouseCurrentPos.current = { x: e.clientX, y: e.clientY }
      }
    }

    const handleMouseUp = () => {
      isMouseDown.current = false
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [options.useMouse])
  
  // Touch Events
  useEffect(() => {
    const handleTouchStart = (e) => {
      if (!options.useMouse) return
      isMouseDown.current = true
      const touch = e.touches[0]
      mouseStartPos.current = { x: touch.clientX, y: touch.clientY }
      mouseCurrentPos.current = { x: touch.clientX, y: touch.clientY }
    }
  
    const handleTouchMove = (e) => {
      if (!options.useMouse) return
      if (isMouseDown.current) {
        const touch = e.touches[0]
        mouseCurrentPos.current = { x: touch.clientX, y: touch.clientY }
      }
    }
  
    const handleTouchEnd = () => {
      isMouseDown.current = false
    }
  
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleTouchEnd)
  
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [options.useMouse])

  // Game Loop
  useFrame((state, delta) => {
    if (!group.current) return
    if (!player) setPlayer(group)
    if (group.current.health <= 0) return

     
    // const { forward, backward, left, right, jump, interact, inventoryLeft, inventoryRight, inventoryUse, shift, zoomIn, zoomOut } = getKeys()
    const keyboard = getKeys()
    const gamepad = getGamepad()
    const mouse = {
      isMouseDown: isMouseDown.current,
      mouseStartPos: mouseStartPos.current,
      mouseCurrentPos: mouseCurrentPos.current,
    }
    const inputs = {
      keyboard: keyboard,
      gamepad: gamepad,
      mouse: mouse,
    }

    playerMovement(group, inputs, anim, transition, options, baseSpeed, speedMultiplier, delta )

    cameraControls(inputs, delta)
    cameraFollow(camera, group.current)
  })

  return (
    <group
      ref={group}
      name="Player"
      health={100}
      shield={100}
      inventoryFlag={null} 
      actionFlag={null}
      dmgFlag={null}
      scoreFlag={null}
      keyFlag={null}
      completeFlag={false}
    >
      <CharModel 
        anim={anim}
        model={model}
        transition={transition} 
        speedMultiplier={speedMultiplier}
      />
      
    </group>
  )
}

export default Player
