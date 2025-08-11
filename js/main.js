var Vector = /** @class */ (function () {
    function Vector(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    return Vector;
}());
var Shapes;
(function (Shapes) {
    Shapes[Shapes["Circle"] = 0] = "Circle";
})(Shapes || (Shapes = {}));
var Physics = /** @class */ (function () {
    function Physics(mass) {
        this.mass = mass;
        this.force = new Vector();
        this.acceleration = new Vector();
        this.velocity = new Vector();
        this.position = new Vector();
    }
    Physics.prototype.nextPosition = function (dt) {
        this.acceleration.x = this.force.x / this.mass;
        this.acceleration.y = this.force.y / this.mass;
        this.velocity.x += this.acceleration.x * dt;
        this.velocity.y += this.acceleration.y * dt;
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
        this.force.x = 0;
        this.force.y = 0;
        return this.position;
    };
    return Physics;
}());
var Thing = /** @class */ (function () {
    function Thing(width, height, x, y) {
        this.element = document.createElement('thing');
        this.element.style.position = 'absolute';
        this.element.style.left = x + '%';
        this.element.style.bottom = y + '%';
        this.element.style.aspectRatio = (width / height).toString();
        this.element.style.height = height + '%';
    }
    Object.defineProperty(Thing.prototype, "x", {
        get: function () {
            return parseFloat(this.element.style.left);
        },
        set: function (value) {
            this.element.style.left = value + '%';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Thing.prototype, "y", {
        get: function () {
            return parseFloat(this.element.style.bottom);
        },
        set: function (value) {
            this.element.style.bottom = value + '%';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Thing.prototype, "aspect_ratio", {
        get: function () {
            return parseFloat(this.element.style.aspectRatio);
        },
        set: function (value) {
            this.element.style.aspectRatio = value.toString();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Thing.prototype, "width", {
        get: function () {
            return this.height * this.aspect_ratio;
        },
        set: function (value) {
            this.aspect_ratio = value / this.height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Thing.prototype, "height", {
        get: function () {
            return parseFloat(this.element.style.height);
        },
        set: function (value) {
            this.aspect_ratio = this.width / value;
            this.element.style.height = value + '%';
        },
        enumerable: false,
        configurable: true
    });
    return Thing;
}());
var GameBox = /** @class */ (function () {
    function GameBox() {
        this.element = document.querySelector('game-box');
    }
    GameBox.prototype.add = function (thing) {
        this.element.appendChild(thing.element);
    };
    GameBox.prototype.remove = function (thing) {
        this.element.removeChild(thing.element);
    };
    Object.defineProperty(GameBox.prototype, "rectangle", {
        get: function () {
            return this.element.getBoundingClientRect();
        },
        enumerable: false,
        configurable: true
    });
    return GameBox;
}());
var keys = {};
window.onkeyup = function (event) {
    keys[event.key] = false;
};
window.onkeydown = function (event) {
    keys[event.key] = true;
};
var game_box = new GameBox();
var player = new Thing(6, 6, 0, 0);
game_box.add(player);
var physics_object = new Physics(1);
var last_time = 0;
function gameLoop(time) {
    var dt = time - last_time;
    last_time = time;
    //
    var force_mag = 10;
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
    physics_object.force.x = force.x;
    physics_object.force.y = force.y;
    var screen = game_box.rectangle;
    var screen_aspect_ratio = screen.width / screen.height;
    function scalePosition(position) {
        return new Vector(position.x, position.y * screen_aspect_ratio);
    }
    var player_position = scalePosition(physics_object.nextPosition(dt / 1000));
    player.x = player_position.x;
    player.y = player_position.y;
    //
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
