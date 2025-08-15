class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    add(other) {
        this.x += other.x;
        this.y += other.y;
    }
    static add(a, b) {
        return new Vector2D(a.x + b.x, a.y + b.y);
    }
    sub(other) {
        this.x -= other.x;
        this.y -= other.y;
    }
    static sub(a, b) {
        return new Vector2D(a.x - b.x, a.y - b.y);
    }
    mul(other) {
        this.x *= other.x;
        this.y *= other.y;
    }
    static mul(a, b) {
        return new Vector2D(a.x * b.x, a.y * b.y);
    }
    div(other) {
        this.x /= other.x;
        this.y /= other.y;
    }
    static div(a, b) {
        return new Vector2D(a.x / b.x, a.y / b.y);
    }
    scale(scaler) {
        this.x *= scaler;
        this.y *= scaler;
    }
    static scale(vector, scaler) {
        return new Vector2D(vector.x * scaler, vector.y * scaler);
    }
    dot(other) {
        return this.x * other.x + this.y * other.y;
    }
    magnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    distance(other) {
        return Math.sqrt(Math.pow((other.x - this.x), 2)
            +
                Math.pow((other.y - this.y), 2));
    }
    normalize() {
        const mag = this.magnitude();
        this.x /= mag;
        this.y /= mag;
    }
    normal() {
        const mag = this.magnitude();
        return new Vector2D(this.x / mag, this.y / mag);
    }
}
class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}
// dt means they are not made for predictions
class Particle {
    constructor(mass) {
        this.force = new Vector2D();
        this.acceleration = new Vector2D();
        this.velocity = new Vector2D();
        this.position = new Vector2D();
        this.mass = mass;
    }
    integrate(dt) {
        this.acceleration.x = this.force.x / this.mass;
        this.acceleration.y = this.force.y / this.mass;
        this.velocity.x += this.acceleration.x * dt;
        this.velocity.y += this.acceleration.y * dt;
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
        this.force.x = 0;
        this.force.y = 0;
    }
}
class Item {
    constructor(value) {
        this._next = null;
        this._previous = null;
        this.value = value;
    }
}
class LinkedList {
    constructor() {
        this.first = null;
    }
    add(value) {
        let item = new Item(value);
        if (this.first) {
            this.first._previous = item;
            item._next = this.first;
            this.first = item;
        }
        else {
            this.first = item;
        }
        return item;
    }
    remove(item) {
        if (item === this.first) {
            this.first = item._next;
        }
        if (item._previous) {
            item._previous._next = item._next;
        }
        if (item._next) {
            item._next._previous = item._previous;
        }
        item._previous = null;
        item._next = null;
    }
    [Symbol.iterator]() {
        let current = this.first;
        return {
            next() {
                if (current) {
                    const value = current;
                    current = current._next;
                    return { value, done: false };
                }
                return { value: null, done: true };
            }
        };
    }
}
class PhysicalCircle extends Particle {
    constructor(radius, mass) {
        super(mass);
        this.radius = radius;
    }
}
const display = document.getElementById('game');
class DisplayCircle extends PhysicalCircle {
    constructor(radius, mass) {
        super(radius, mass);
        this.element = document.createElement('div');
        this.element.classList.add('thing', 'circle');
        display.append(this.element);
    }
    updateDisplay(scale) {
        const scaler = display.offsetWidth * scale;
        this.element.style.width = (this.radius * 2 * scaler) + 'px';
        this.element.style.height = this.element.style.width;
        this.element.style.left = (this.position.x * display.offsetWidth) + 'px';
        this.element.style.bottom = (this.position.y * display.offsetWidth) + 'px';
    }
}
let keydown = {};
window.onkeydown = (event) => {
    keydown[event.code] = true;
};
window.onkeyup = (event) => {
    keydown[event.code] = false;
};
const particle_system = new LinkedList();
let player = new DisplayCircle(0.02, 1);
player.position.x = 0;
player.position.y = 0;
particle_system.add(player);
player.element.style.backgroundColor = 'green';
let ball = new DisplayCircle(0.02, 2e8);
ball.position.x = 0.5;
ball.position.y = 0.3;
particle_system.add(ball);
const force = player.mass / 2;
let last_time = 0;
const gravity = true;
function gameLoop(time) {
    let dt = time - last_time;
    last_time = time;
    dt /= 1000;
    if (keydown['ArrowUp']) {
        console.log('UP');
        player.force.y += force;
    }
    if (keydown['ArrowDown']) {
        console.log('DOWN');
        player.force.y -= force;
    }
    if (keydown['ArrowRight']) {
        console.log('RIGHT');
        player.force.x += force;
    }
    if (keydown['ArrowLeft']) {
        console.log('LEFT');
        player.force.x -= force;
    }
    for (const particle_item of particle_system) {
        const particle = particle_item.value;
        particle.integrate(dt);
        const G = 6.67430e-11;
        for (const other_particle_item of particle_system) {
            const other_particle = other_particle_item.value;
            if (particle !== other_particle) {
                const d = Vector2D.sub(particle.position, other_particle.position);
                const dn = d.normal();
                const distance = d.magnitude();
                const overlap = particle.radius + other_particle.radius - distance;
                const overlap_error = 0.001;
                if (overlap > overlap_error) {
                    // console.log('collition overlap detected')
                    const v1 = particle.velocity.dot(dn);
                    const v2 = -other_particle.velocity.dot(dn);
                    const vs = v1 + v2;
                    const push = Vector2D.scale(dn, overlap);
                    if (vs === 0) {
                        const mass_sum = particle.mass + other_particle.mass;
                        const particle_push = Vector2D.scale(push, particle.mass / mass_sum);
                        const other_particle_push = Vector2D.scale(push, other_particle.mass / mass_sum);
                        particle.position.add(particle_push);
                        other_particle.position.sub(other_particle_push);
                    }
                    else {
                        // console.log('velocity collision detected')
                        const particle_push = Vector2D.scale(push, v1 / vs);
                        const other_particle_push = Vector2D.scale(push, v2 / vs);
                        particle.position.add(particle_push);
                        other_particle.position.sub(other_particle_push);
                        const mass_sum = particle.mass + other_particle.mass;
                        const n = Vector2D.sub(particle.position, other_particle.position).normal();
                        const v_rel = Vector2D.sub(particle.velocity, other_particle.velocity).dot(n);
                        const c1 = (2 * other_particle.mass * v_rel) / mass_sum;
                        const c2 = (2 * particle.mass * v_rel) / mass_sum;
                        particle.velocity.sub(Vector2D.scale(n, c1));
                        other_particle.velocity.add(Vector2D.scale(n, c2));
                    }
                }
                // else if (overlap > 0) {
                //     console.log('collition touch detected')
                // }
                if (gravity) {
                    const r3 = Math.pow(distance, 3);
                    particle.force.x += (G * other_particle.mass * particle.mass * (other_particle.position.x - particle.position.x)) / r3;
                    particle.force.y += (G * other_particle.mass * particle.mass * (other_particle.position.y - particle.position.y)) / r3;
                }
            }
        }
        particle.updateDisplay(1);
    }
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
