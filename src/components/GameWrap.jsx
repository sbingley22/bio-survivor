import { useGameStore } from "./useGameStore"
import Game from "./Game"
import MainMenu from "./menus/MainMenu"
import ScoreScreen from "./menus/ScoreScreen"

const GameWrap = () => {
  const { mode } = useGameStore()

  return (
    <div className="w-screen h-screen bg-black">
      {mode===0 && <Game
      />}

      {mode===5 && <MainMenu
      />}

      {mode===6 && <ScoreScreen win={false}
      />}

      {mode===7 && <ScoreScreen win={true}
      />}
    </div>
  )
}

export default GameWrap
