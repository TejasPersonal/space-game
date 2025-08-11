class Vector {
    x: number
    y: number

    constructor (x: number = 0, y: number = 0) {
        this.x = x
        this.y = y
    }
}

enum Shapes {
    Circle
}

class Physics {
    public mass: number
    public force: Vector
    private acceleration: Vector
    private velocity: Vector
    private position: Vector

    constructor (mass: number) {
        this.mass = mass
        this.force = new Vector()
        this.acceleration = new Vector()
        this.velocity = new Vector()
        this.position = new Vector()
    }

    nextPosition (dt: number): Vector {
        this.acceleration.x = this.force.x / this.mass
        this.acceleration.y = this.force.y / this.mass

        this.velocity.x += this.acceleration.x * dt
        this.velocity.y += this.acceleration.y * dt

        this.position.x += this.velocity.x * dt
        this.position.y += this.velocity.y * dt

        this.force.x = 0
        this.force.y = 0

        return this.position
    }
}

class Thing {
    public element: HTMLElement

    constructor (width: number, height: number, x: number, y: number) {
        this.element = document.createElement('thing')

        this.element.style.position = 'absolute'
        
        this.element.style.left = x + '%'
        this.element.style.bottom = y + '%'

        this.element.style.aspectRatio = (width / height).toString()
        this.element.style.height = height + '%'
    }

    get x (): number {
        return parseFloat(this.element.style.left)
    }
    
    get y (): number {
        return parseFloat(this.element.style.bottom)
    }

    set x (value: number) {
        this.element.style.left = value + '%'
    }

    set y (value: number) {
        this.element.style.bottom = value + '%'
    }

    get aspect_ratio (): number {
        return parseFloat(this.element.style.aspectRatio)
    }

    private set aspect_ratio (value: number) {
        this.element.style.aspectRatio = value.toString()
    }
    
    get width (): number {
        return this.height * this.aspect_ratio
    }

    get height (): number {
        return parseFloat(this.element.style.height)
    }

    set width (value: number) {
        this.aspect_ratio = value / this.height
    }

    set height (value: number) {
        this.aspect_ratio = this.width / value
        this.element.style.height = value + '%'
    }
}

class GameBox {
    private element: Element

    constructor () {
        this.element = document.querySelector('game-box')!
    }

    add (thing: Thing) {
        this.element.appendChild(thing.element)
    }

    remove (thing: Thing) {
        this.element.removeChild(thing.element)
    }

    get rectangle (): DOMRect {
        return this.element.getBoundingClientRect()
    }
}

let keys: { [key: string]: boolean } = {}

window.onkeyup = (event: KeyboardEvent) => {
    keys[event.key] = false
}

window.onkeydown = (event: KeyboardEvent) => {
    keys[event.key] = true
}

let game_box = new GameBox()

let player = new Thing(6, 6, 0, 0)
game_box.add(player)
let physics_object = new Physics(1)

let last_time = 0

function gameLoop(time: number) {
    const dt = time - last_time
    last_time = time
    //

    let force_mag = 10
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

    physics_object.force.x = force.x
    physics_object.force.y = force.y

    let screen = game_box.rectangle
    let screen_aspect_ratio = screen.width / screen.height

    function scalePosition(position: Vector): Vector {
        return new Vector(position.x, position.y * screen_aspect_ratio)
    }

    let player_position = scalePosition(physics_object.nextPosition(dt / 1000))
    player.x = player_position.x
    player.y = player_position.y

    //
    requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop)