var Thing = /** @class */ (function () {
    function Thing(id, width, aspect_ratio) {
        if (aspect_ratio === void 0) { aspect_ratio = 1; }
        this.element = document.getElementById(id);
        this.element.style.left = '0';
        this.element.style.bottom = '0';
        this.element.style.width = width + '%';
        this.element.style.aspectRatio = aspect_ratio.toString();
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
    Object.defineProperty(Thing.prototype, "width", {
        get: function () {
            return parseFloat(this.element.style.width);
        },
        set: function (value) {
            this.element.style.widows = value + '%';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Thing.prototype, "height", {
        get: function () {
            return parseFloat(this.element.style.height);
        },
        set: function (value) {
            this.element.style.height = value + '%';
        },
        enumerable: false,
        configurable: true
    });
    return Thing;
}());
export { Thing };
