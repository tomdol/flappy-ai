class Renderer {
    // jcanvas based renderer positions objects based on their center
    OBJECTS_POSITIONING = VerticalPositioning.CENTER_POINT;

    constructor(canvas) {
        this.c = canvas;
        this.c.removeLayers();
    }

    init() {
        const skyGradient = this.c.createGradient({
            x1: 0,
            y1: 0,
            x2: 0,
            y2: this.c.height(),
            c1: "#2980b9",
            c2: "#82bfe8"
        });

        // sky
        this.c.addLayer({
            type: "rectangle",
            fillStyle: skyGradient,
            index: 0,
            x: this.c.width() / 2,
            y: this.c.height() / 2,
            width: this.c.width(),
            height: this.c.height()
        });
    }

    addSprite(obj) {
        if (obj.LAYER_GROUP) {
            this.c.addLayer({
                type: "image",
                source: obj.img.src,
                scale: obj.scale || 1.0,
                groups: [obj.LAYER_GROUP],
                index: 2,
                x: obj.x,
                y: obj.y
            });
        } else {
            this.c.addLayer({
                type: "image",
                source: obj.img.src,
                scale: obj.scale || 1.0,
                name: obj.LAYER_NAME,
                index: 1,
                x: obj.x,
                y: obj.y
            });
        }
    }

    updateSprite(obj) {
        this.c.setLayer(obj.LAYER_NAME, {
            x: obj.x,
            y: obj.y,
            rotate: obj.nose ? obj.nose : 0
        });
    }

    updateGroupLayer(layer_name, dx) {
        this.c.setLayerGroup(layer_name, {
            x: `-=${dx}`
        });
    }

    renderScore(score) {
        this.c.removeLayer("score");
        this.c.drawText({
            layer: true,
            name: "score",
            fillStyle: "#e74c3c",
            strokeStyle: "#000",
            strokeWidth: 2,
            fontFamily: "GTA",
            fontSize: "50pt",
            fontStyle: "bold",
            x: this.c.width() - 100,
            y: 75,
            text: score
        });
    }

    wasted() {
        this.c.drawText({
            layer: true,
            name: "wasted",
            fillStyle: "#e74c3c",
            strokeStyle: "#000",
            strokeWidth: 7,
            fontFamily: "GTA",
            fontSize: "100pt",
            fontStyle: "bold",
            x: this.c.width() / 2,
            y: this.c.height() / 2,
            text: "wAsted"
        }).drawLayers();
    }

    render() {
        this.c.drawLayers();
    }
}
