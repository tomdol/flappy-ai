class Renderer {
    constructor(canvas) {
        this.c = canvas;
        this.positioning = VerticalPositioning.CENTER_POINT;
    }

    init() {
        // sky
        this.c.addLayer({
                type: "rectangle",
                fillStyle: "#3498db",
                index: 0,
                x: 0, y: 0,
                width: this.c.width() * 2,
                height: this.c.height() * 2
            });

        // ground
        this.c.addLayer({
                type: "rectangle",
                fillStyle: "#7f8c8d",
                index: 2,
                x: this.c.width() / 2, y: this.c.height() - 20,
                width: this.c.width(),
                height: 50
            })
            .addLayer({
                type: "rectangle",
                fillStyle: "#2c3e50",
                index: 2,
                x: this.c.width() / 2, y: this.c.height() - 50,
                width: this.c.width(),
                height: 10
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
