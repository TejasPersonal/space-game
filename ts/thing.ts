export class Thing {
    public element: HTMLElement

    constructor (id: string, width: number, aspect_ratio: number = 1) {
        this.element = document.getElementById(id)!

        this.element.style.left = '0'
        this.element.style.bottom = '0'
        this.element.style.width = width + '%'
        this.element.style.aspectRatio = aspect_ratio.toString()
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

    get width (): number {
        return parseFloat(this.element.style.width)
    }

    get height (): number {
        return parseFloat(this.element.style.height)
    }

    set width (value: number) {
        this.element.style.widows = value + '%'
    }

    set height (value: number) {
        this.element.style.height = value + '%'
    }
}