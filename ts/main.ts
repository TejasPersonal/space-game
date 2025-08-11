import { Thing } from "./thing.js"

const game_screen = document.getElementById('game-screen')!
const player = new Thing('player', 4)

let keys: { [key: string]: boolean } = {}

window.onkeyup = function (event) {
    keys[event.key] = false
}

window.onkeydown = function (event) {
    keys[event.key] = true
}

class Vector {
    x: number
    y: number

    constructor (x: number = 0, y: number = 0) {
        this.x = x
        this.y = y
    }
}

class Physics {
    private acceleration: Vector
    private velocity: Vector
    private mass: number

    constructor (mass: number) {
        this.mass = mass
        this.acceleration = new Vector()
        this.velocity = new Vector()
    }

    apply_force(force: Vector) {
        this.acceleration.x = force.x / this.mass
        this.acceleration.y = force.y / this.mass
    }

    calculate_velocity(): Vector {
        console.log(this.acceleration.x)
        this.velocity.x += this.acceleration.x
        this.velocity.y += this.acceleration.y
        this.acceleration.x = 0
        this.acceleration.y = 0
        return this.velocity
    }
}

let physics = new Physics(1)

let interval = 0
let last_time = performance.now()

setInterval(() => {
    const current_time = performance.now()
    const delta_time = current_time - last_time
    last_time = current_time
    
    const screen_rect = game_screen.getBoundingClientRect()
    const screen_aspect_ratio = screen_rect.width / screen_rect.height
    
    let force_mag = 0.0001
    let force = new Vector()

    if (keys["ArrowRight"]) {
        force.x += force_mag
    }
    if (keys["ArrowLeft"]) {
        force.x -= force_mag
    }
    if (keys["ArrowUp"]) {
        force.y += force_mag
    }
    if (keys["ArrowDown"]) {
        force.y -= force_mag
    }

    physics.apply_force(force)
    let vel = physics.calculate_velocity()
    
    player.x += vel.x * delta_time
    player.y += vel.y * delta_time * screen_aspect_ratio

}, interval)

// vel.y * delta_time * screen_aspect_ratio
// vel.x * delta_time