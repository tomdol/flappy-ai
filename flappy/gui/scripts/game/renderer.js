class Renderer {
    constructor(canvas) {
        this.c = canvas;
        this.positioning = VerticalPositioning.CENTER_POINT;
    }

    init() {
        this.c
            .addLayer({
                type: "rectangle",
                fillStyle: "#3498db",
                x: 0, y: 0,
                width: this.c.width() * 2,
                height: this.c.height() * 2
            })
            // .addLayer({
            //     type: 'image',
            //     source: this.pipe_n_img,
            //     x: 600, y: -100
            // })
            // .addLayer({
            //     type: 'image',
            //     source: this.pipe_s_img,
            //     x: 600, y: 800
            // })
            .addLayer({
                type: "rectangle",
                fillStyle: "#7f8c8d",
                x: 0, y: this.c.height() - 20,
                width: this.c.width() * 2,
                height: 50
            })
            .addLayer({
                type: "rectangle",
                fillStyle: "#2c3e50",
                x: 0, y: this.c.height() - 50,
                width: this.c.width() * 2,
                height: 10
            });
    }

    addSprite(obj, scale = 1.0) {
        this.c.addLayer({
            type: "image",
            source: obj.img.src,
            scale: scale,
            x: obj.x, y: obj.y
        });
    }

    render() {
        this.c.drawLayers();
    }
}
