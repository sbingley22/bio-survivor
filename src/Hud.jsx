import { useEffect, useState } from "react"
import { useGameStore } from "./components/useGameStore"

const Hud = () => {
  const { options, setPlayerFlag, xp, nextLevelXp, xpLevel, score, hudInfo, inventory, inventorySlot, setInventorySlot } = useGameStore()
  const [clickMark, setClickMark] = useState({x: -99, y: -99})

  // Mouse Events
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (!options.useMouse) return
      setClickMark({x: e.clientX - 3, y: e.clientY - 3})
    }

    const handleMouseUp = () => {
      setClickMark({x:-99,y:-99})
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchstart', handleMouseDown)
    window.addEventListener('touchend', handleMouseUp)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchstart', handleMouseDown)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [options.useMouse])

  const getHudImg = () => {
    let hudImg = "./status/SurvivorHealthy.png"
    let status = "Healthy"
    let char = "Survivor"

    if (hudInfo.health < 50) status = "Hurt"
    
    const character = options.character
    if (character === "Survivor") char = "Survivor"

    hudImg = `./status/${char}${status}.png`
    return hudImg
  }
  const hudImg = getHudImg()

  const inventoryItemClicked = (index) => {
    setInventorySlot(index)
    setPlayerFlag("inventoryFlag", index)
  }

  return (
    <>
      {clickMark.x > 0 && (
        <div 
          className="absolute rounded-2xl bg-slate-600 border-8 border-slate-100" 
          style={{ top: `${clickMark.y - 16}px`, left: `${clickMark.x - 16}px`, borderWidth: "8px", width: "32px", height: "32px" }} 
        />
      )}

      <div className="absolute top-0 left-0 m-0 text-yellow-50 flex w-full box-border justify-center items-center text-center">
        {inventory.map((inv, index) => (
          <button
            key={"inventory"+index}
            className={`${index===inventorySlot? "border-slate-200" : "border-slate-800"} p-1 m-1 bg-slate-950 border-2 inline-block flex-grow`}
            onClick={()=>inventoryItemClicked(index)}
          >{`${inv.name !== "" ? inv.name + " x" + inv.amount : ""}`}</button>
        ))}
      </div>

      <div
        className="absolute bottom-0 left-0 w-full"
      >
        <div className="flex">
          <img 
            className="p-4"
            style={{ width: 160 }}
            src={hudImg} 
          />
          <div className="flex flex-col justify-end">
            <p className="m-2 text-green-500 bg-slate-800 p-2">{hudInfo.msg}</p>
          </div>
        </div>

        <div className="w-full bg-slate-800">
          <p className="inline-block pl-4 pr-4 text-cyan-300">Level: {xpLevel}</p>
          <div 
            className="p-1 bg-yellow-700 inline-block"
            style={{ width: `${xp/nextLevelXp}%` }}
          ></div>
        </div>

      </div>
    </>
  )
}

export default Hud
