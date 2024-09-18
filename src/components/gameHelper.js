import * as THREE from 'three'

const vec3a = new THREE.Vector3()
const vec3b = new THREE.Vector3()
const vec3c = new THREE.Vector3()
const quat = new THREE.Quaternion()

const camSettings = {
  x: 0,
  y: 16,
  z: 10,
  zoom: 1,
}

export const cameraControls = (inputs, delta=0.01) => {
  if (inputs.keyboard.zoomIn) {
    camSettings.y -= delta * 2
    camSettings.z -= delta * 2
  } else if (inputs.keyboard.zoomOut) {
    camSettings.y += delta * 2
    camSettings.z += delta * 2
  }
}

export const cameraFollow = (cam, player) => {
  if (!cam || !player) return
  // console.log(cam)
  let x = 0
  let y = 8
  let z = 8

  if (camSettings) {
    x = camSettings.x
    y = camSettings.y
    z = camSettings.z
  }

  cam.position.x = player.position.x + x
  cam.position.y = y
  cam.position.z = player.position.z + z
}

export const isUnskippableAnimation = (anim) => {
  if (!anim || !anim.current) return

  const a = anim.current
  if (a === "float dying") return true
  if (a === "float jab") return true

  return false
}
export const playAudio = (src, volume=1, mute=false) => {
  if (mute) return
  const audio = new Audio(src)
  audio.volume = volume
  audio.play()
}

export const rotateToVec = (group, dx, dy, rotSpeed=0.1) => {
  if (!group) return

  // Calculate target rotation
  const direction = vec3b.set(dx, 0, dy).normalize()
  const angle = Math.atan2(direction.x, direction.z)

  // Create quaternions for current and target rotations
  const currentQuaternion = group.quaternion.clone()
  const targetQuaternion = quat.setFromAxisAngle(vec3c.set(0, 1, 0), angle)

  // Interpolate rotation using slerp
  currentQuaternion.slerp(targetQuaternion, rotSpeed)
  group.quaternion.copy(currentQuaternion)
}


// -------------------------
// Player Functions

export const playerMovement = (group, inputs, anim, transition, options, baseSpeed, speedMultiplier, delta ) => {
  if (!group.current) return
  transition.current = "float idle"

  let dx = 0
  let dy = 0

  // keyboard
  if (inputs.keyboard.forward) dy = -1
  else if (inputs.keyboard.backward) dy = 1
  if (inputs.keyboard.left) dx = -1
  else if (inputs.keyboard.right) dx = 1

  // Normalise horizontal movement
  if (dx && dy) {
    dx *= 0.7
    dy *= 0.7
  }

  // Handle mouse/touch input
  if (inputs.mouse.isMouseDown.current && options.useMouse) {
    const dxMouse = inputs.mouse.mouseCurrentPos.current.x - inputs.mouse.mouseStartPos.current.x
    const dyMouse = inputs.mouse.mouseCurrentPos.current.y - inputs.mouse.mouseStartPos.current.y

    const distance = Math.sqrt(dxMouse**2 + dyMouse**2)
    let tempSpeed = distance> 50 ? 1 : distance / 50
    if (distance > 10) {
      dx = dxMouse / distance // Normalize
      dy = dyMouse / distance // Normalize
      dx *= tempSpeed
      dy *= tempSpeed
    }
  }

  // gamepad
  const gpmx = inputs.gamepad.moveX
  const gpmy = inputs.gamepad.moveY
  const moveDeadZone = 0.3
  if (options.useController) {
    if (Math.abs(gpmx) > moveDeadZone) dx = gpmx
    if (Math.abs(gpmy) > moveDeadZone) dy = gpmy * -1
  }

  let speed = baseSpeed * speedMultiplier.current * delta

  // move
  const targetPosition = vec3a.set(group.current.position.x + dx * speed, group.current.position.y, group.current.position.z + dy * speed)

  if (dx || dy) {
    // moving
    rotateToVec(group.current, dx, dy)
    transition.current = "float fwd"

    if (!isUnskippableAnimation(anim)) {
      anim.current = "float fwd"
    }
  }
  else {
    // stationary
    if (!isUnskippableAnimation(anim)) {
      anim.current = "float idle"
    }
  }

  group.current.position.x = targetPosition.x
  group.current.position.y = targetPosition.y
  group.current.position.z = targetPosition.z
}