/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useEffect, useRef } from "react"
import glb from "../../assets/HumanoidCells.glb?url"
import { useSkinnedMeshClone } from "./SkinnedMeshClone"
import { useAnimations } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"

const CharModel = ({ anim, model, transition, speedMultiplier={current:1} }) => {
  const { scene, nodes, animations } = useSkinnedMeshClone(glb)
  const { mixer, actions } = useAnimations(animations, scene)
  const lastAnim = useRef(anim.current)

  // Initial Setup
  useEffect(()=>{
    console.log(nodes, actions)

    Object.keys(nodes).forEach(nodeName => {
      const node = nodes[nodeName]
      if (node.type === "Mesh" || node.type === "SkinnedMesh") { 
        node.visible = false
        node.castShadow = true
      }
    })

    if (actions[anim.current]){
      actions[anim.current].play()
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[nodes, actions])

  // Set Model
  useEffect(()=>{
    if (!model) return

    const visibleNodes = []

    if (model === "Diver") {
      visibleNodes.push("SurvivorGen", "Hair-TiedBack002", "Mask", "Flippers", "Backpack")
      changeSkin("SurvivorGen", 0, visibleNodes)
    }
    else if (model === "Diver Alt") {
      visibleNodes.push("SurvivorGen", "Hair-TiedBack002", "Mask", "Flippers", "Backpack")
      changeSkin("AnaGen", 1, visibleNodes)
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, nodes])

  // Skin change
  const changeSkin = (charNode, index, visibleNodes=[]) => {
    const node = nodes[charNode]
    if (!node || node.type !== "Group") return

    if (node.children.length <= index) return
    node.children.forEach(child=>{
      child.material = node.children[index].material
    })

    Object.keys(nodes).forEach(nodeName => {
      const node = nodes[nodeName]
      if (node.type === "Mesh" || node.type === "SkinnedMesh") node.visible = false
    })

    visibleNodes.forEach(vn => {
      const node = nodes[vn]
      if (!node) return

      node.visible = true
      if (node.type === "Group") {
        node.children.forEach(child => {
          child.visible = true
        })
      }
    })
  }
  
  // Mixer Settings
  useEffect(()=>{
    if (!mixer) return

    const oneShotAnims = ["float jab"]
    oneShotAnims.forEach(osa => {
      if (!actions[osa]) {
        console.log("No such action: ", osa)
        return
      }
      actions[osa].clampWhenFinished = true
      actions[osa].repetitions = 1
    })

    mixer.addEventListener("finished", (e) => {
      const action = e.action.getClip().name
      // console.log(action)
      if (anim.current === "Dying") return

      if (action === "Take Damage") {
        if (transition.current) anim.current = transition.current
        return
      }
      if (action === "Dying") {
        return
      }

      anim.current = "float idle"
    })

    return mixer.removeEventListener("finished")
  }, [mixer, actions, anim, transition])

  // Animation Speed
  const getTimeScale = () => {
    let timescale = 1

    if (["float fwd"].includes(anim.current)) timescale *= speedMultiplier.current

    return timescale
  }

  // Update Animations
  const updateAnimations = () => {
    if (anim.current === lastAnim.current) return
    if (!actions[anim.current]) console.log("Couldnt find animation", anim.current, lastAnim.current)

    const fadeTime = 0.1
    actions[lastAnim.current].fadeOut(fadeTime)

    const action = actions[anim.current].reset().fadeIn(fadeTime).play()

    const timescale = getTimeScale()
    action.setEffectiveTimeScale(timescale)

    lastAnim.current = anim.current
  }

  // Game Loop
  // eslint-disable-next-line no-unused-vars
  useFrame((state, delta) => {
    updateAnimations()
  })
  
  return (
    <>
      <primitive object={scene} />
    </>
  )
}

export default CharModel