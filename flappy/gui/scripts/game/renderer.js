class Renderer {
    // jcanvas based renderer positions objects based on their center
    OBJECTS_POSITIONING = VerticalPositioning.CENTER_POINT;

    constructor(canvas) {
        this.c = canvas;
    }

    init() {
        const skyGradient = this.c.createGradient({
            x1: 0, y1: 0,
            x2: 0, y2: this.c.height(),
            c1: "#2980b9",
            c2: "#82bfe8"
        });

        // sky
        this.c.addLayer({
                type: "rectangle",
                fillStyle: skyGradient,
                index: 0,
                x: this.c.width() / 2, y: this.c.height() / 2,
                width: this.c.width(),
                height: this.c.height()
            });

        // ground
        this.c
            .addLayer({
                type: "image",
                source: "img/concrete.png",
                index: 2,
                x: this.c.width() / 2, y: this.c.height() - 30
            })
            .addLayer({
                type: "rectangle",
                fillStyle: "#2c3e50",
                index: 2,
                x: this.c.width() / 2, y: this.c.height() - 60,
                width: this.c.width(),
                height: 5
            });
    }

    addSprite(obj, scale = 1.0) {
        this.c.addLayer({
            type: "image",
            source: obj.img.src,
            scale: scale,
            index: 1,
            x: obj.x, y: obj.y
        });
    }

    render() {
        this.c.drawLayers();
    }
}
