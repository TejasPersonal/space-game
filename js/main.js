class Vector {
    x;
    y;
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}
var Shapes;
(function (Shapes) {
    Shapes[Shapes["Circle"] = 0] = "Circle";
})(Shapes || (Shapes = {}));
class Physics {
    mass;
    force;
    acceleration;
    velocity;
    position;
    constructor(mass) {
        this.mass = mass;
        this.force = new Vector();
        this.acceleration = new Vector();
        this.velocity = new Vector();
        this.position = new Vector();
    }
    nextPosition(dt) {
        this.acceleration.x = this.force.x / this.mass;
        this.acceleration.y = this.force.y / this.mass;
        this.velocity.x += this.acceleration.x * dt;
        this.velocity.y += this.acceleration.y * dt;
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
        this.force.x = 0;
        this.force.y = 0;
        return this.position;
    }
}
class Thing {
    element;
    constructor(width, height, x, y) {
        this.element = document.createElement('thing');
        this.element.style.position = 'absolute';
        this.element.style.left = x + '%';
        this.element.style.bottom = y + '%';
        this.element.style.aspectRatio = (width / height).toString();
        this.element.style.height = height + '%';
    }
    get x() {
        return parseFloat(this.element.style.left);
    }
    get y() {
        return parseFloat(this.element.style.bottom);
    }
    set x(value) {
        this.element.style.left = value + '%';
    }
    set y(value) {
        this.element.style.bottom = value + '%';
    }
    get aspect_ratio() {
        return parseFloat(this.element.style.aspectRatio);
    }
    set aspect_ratio(value) {
        this.element.style.aspectRatio = value.toString();
    }
    get width() {
        return this.height * this.aspect_ratio;
    }
    get height() {
        return parseFloat(this.element.style.height);
    }
    set width(value) {
        this.aspect_ratio = value / this.height;
    }
    set height(value) {
        this.aspect_ratio = this.width / value;
        this.element.style.height = value + '%';
    }
}
class GameBox {
    element;
    constructor() {
        this.element = document.querySelector('game-box');
    }
    add(thing) {
        this.element.appendChild(thing.element);
    }
    remove(thing) {
        this.element.removeChild(thing.element);
    }
    get rectangle() {
        return this.element.getBoundingClientRect();
    }
}
let keys = {};
window.onkeyup = (event) => {
    keys[event.key] = false;
};
window.onkeydown = (event) => {
    keys[event.key] = true;
};
let game_box = new GameBox();
let player = new Thing(6, 6, 0, 0);
game_box.add(player);
let physics_object = new Physics(1);
let last_time = 0;
function gameLoop(time) {
    const dt = time - last_time;
    last_time = time;
    //
    let force_mag = 10;
    let force = new Vector();
    if (keys["ArrowRight"]) {
        force.x += force_mag;
    }
    if (keys["ArrowLeft"]) {
        force.x -= force_mag;
    }
    if (keys["ArrowUp"]) {
        force.y += force_mag;
    }
    if (keys["ArrowDown"]) {
        force.y -= force_mag;
    }
    physics_object.force.x = force.x;
    physics_object.force.y = force.y;
    let screen = game_box.rectangle;
    let screen_aspect_ratio = screen.width / screen.height;
    function scalePosition(position) {
        return new Vector(position.x, position.y * screen_aspect_ratio);
    }
    let player_position = scalePosition(physics_object.nextPosition(dt / 1000));
    player.x = player_position.x;
    player.y = player_position.y;
    //
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
