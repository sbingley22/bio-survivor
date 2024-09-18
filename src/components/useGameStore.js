import { create } from "zustand"

const gamepadState = {
  moveX: 0,
  moveY: 0,
  interact: false,
}

export const useGameStore = create((set, get) => ({
  getGamepad: () => gamepadState,

  mode: 5,
  setMode: (mode) => set({ mode }),

  options: {
    character: "Diver",
    volume: 0.5,
    mute: false,
    useController: true,
    useMouse: true,
  },
  setOptions: (newOptions) => set((state) => ({
    options: { ...state.options, ...newOptions },
  })),
  getVolume: () => get().options.volume,
  getMute: () => get().options.mute,

  level: "Vasculiture",
  setLevel: (level) => set({ level }),

  player: null,
  setPlayer: (player) => set({ player }),
  setPlayerFlag: (flag, value) => {
    const state = get()
    if (state.player.current) state.player.current[flag] = value
  },

  xp: 0,
  nextLevelXp: 100,
  xpLevel: 0,
  score: 0,
  setScore: (score) => set({ score }),
  setXp: (xp) => set({xp}),
  setNextLevelXp: (nextLevelXp) => set({nextLevelXp}),
  setXpLevel: (xpLevel) => set({xpLevel}),
  addScore: (amount) => {
    const state = get()
    const newScore = state.score + amount
    let newXp = state.xp + amount
    if (newXp > state.nextLevelXp) {
      newXp = 0
      const newXpLevel = state.xpLevel + 1
      const newNextLevelXp = state.nextLevelXp * 1.5
      set({ xpLevel: newXpLevel, nextLevelXp: newNextLevelXp })
    }
    set({ score: newScore, xp: newXp })
  },
  getScore: () => get().score,
  getXp: () => get().xp,
  getXpLevel: () => get().xpLevel,
  getNextLevelXp: () => get().nextLevelXp,

  enemyGroup: null,
  setEnemyGroup: (enemyGroup) => set({ enemyGroup }),
  enemies: [],
  setEnemies: (enemies) => set({ enemies }),
  enemiesRemove: (id) => {
    set((state) => ({
    enemies: state.enemies.filter(e => e.id !== id)
  }));
  },
  enemiesAdd: (newEnemies) => {
    const state = get()
    const tempE = [...state.enemies]
    newEnemies.forEach(e=>{
      tempE.push({
        id: e.id,
        type: e.type,
        position: e.position,
      })
    })
    set({ enemies: tempE })
  },
  enemyAdd: (id, type, position) => {
    const state = get()
    const tempE = [...state.enemies]
    tempE.push({
      id: id,
      type: type,
      position: position,
    })
    set({ enemies: tempE })
  },
  
  inventory: [
    {name: "Stun Grenade", amount: 1},
    {name: "", amount: 0},
    {name: "", amount: 0},
    {name: "", amount: 0},
  ],
  setInventory: (inventory) => set({ inventory }),
  inventorySlot: 0,
  setInventorySlot: (inventorySlot) => set({ inventorySlot }),
  inventoryRemoveItem: (slot, amount = 1) => {
    const state = get()
    const tempInv = [...state.inventory]
    tempInv[slot].amount -= amount
    if (tempInv[slot].amount <= 0) {
      tempInv[slot].name = ""
      tempInv[slot].amount = 0
    }
    set({ inventory: tempInv })
  },
  inventoryAddItem: (name, amount) => {
    const state = get()
    const tempInv = [...state.inventory]
    let slot = -1
    let nextSlot = -1
    tempInv.forEach((inv,index)=> {
      if (slot !== -1) return
      if (inv.name === name) slot = index
      else if (inv.name === "" && nextSlot === -1) nextSlot = index
    })
    if (slot === -1) {
      if (nextSlot === -1) return false
      slot = nextSlot
    }
    tempInv[slot].name = name
    tempInv[slot].amount += amount
    set({ inventory: tempInv })
  },

  hudInfo: {
    health: 100,
    armour: 0,
    msg: "",
    status: null,
  },
  setHudInfo: (hudInfo) => set({ hudInfo }),
  setHudInfoParameter: (newParameter) => set((state) => ({
    hudInfo: { ...state.hudInfo, ...newParameter },
  })),

  resetGame: () => {
    set({
      score: 0,
      level: "Vasculiture",
      player: null,
      enemies: [],
      enemyGroup: null,
      inventory: [
        { name: "Stun Grenade", amount: 1 },
        { name: "", amount: 0 },
        { name: "", amount: 0 },
        { name: "", amount: 0 },
      ],
      inventorySlot: 0,
      hudInfo: {
        health: 100,
        armour: 0,
        msg: "",
        status: null,
      },
    });
  }
}))