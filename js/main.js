import { Thing } from "./thing.js";
var game_screen = document.getElementById('game-screen');
var player = new Thing('player', 4);
var keys = {};
window.onkeyup = function (event) {
    keys[event.key] = false;
};
window.onkeydown = function (event) {
    keys[event.key] = true;
};
var Vector = /** @class */ (function () {
    function Vector(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    return Vector;
}());
var Physics = /** @class */ (function () {
    function Physics(mass) {
        this.mass = mass;
        this.acceleration = new Vector();
        this.velocity = new Vector();
    }
    Physics.prototype.apply_force = function (force) {
        this.acceleration.x = force.x / this.mass;
        this.acceleration.y = force.y / this.mass;
    };
    Physics.prototype.calculate_velocity = function () {
        console.log(this.acceleration.x);
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;
        this.acceleration.x = 0;
        this.acceleration.y = 0;
        return this.velocity;
    };
    return Physics;
}());
var physics = new Physics(1);
var interval = 0;
var last_time = performance.now();
setInterval(function () {
    var current_time = performance.now();
    var delta_time = current_time - last_time;
    last_time = current_time;
    var screen_rect = game_screen.getBoundingClientRect();
    var screen_aspect_ratio = screen_rect.width / screen_rect.height;
    var force_mag = 0.0001;
    var force = new Vector();
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
    physics.apply_force(force);
    var vel = physics.calculate_velocity();
    player.x += vel.x * delta_time;
    player.y += vel.y * delta_time * screen_aspect_ratio;
}, interval);
// vel.y * delta_time * screen_aspect_ratio
// vel.x * delta_time
