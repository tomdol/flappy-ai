class Game {
    constructor(canvas_id) {
        this.c = $(canvas_id);
        this.bird_img = "img/bird_transparent.png";
        this.pipe_n_img = "img/pipe_north_tr.png";
        this.pipe_s_img = "img/pipe_south_tr.png";
    }

    initCanvas() {
        this.c
        .addLayer({
            type: "rectangle",
            fillStyle: "#3498db",
            x: 0, y: 0,
            width: this.c.width() * 2,
            height: this.c.height() * 2
        })
        .addLayer({
            type: 'image',
            source: this.bird_img,
            scale: 0.33,
            x: 100, y:100
        })
        .addLayer({
            type: 'image',
            source: this.pipe_n_img,
            x: 600, y: -100
        })
        .addLayer({
            type: 'image',
            source: this.pipe_s_img,
            x: 600, y: 800
        })
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
        })
        .drawLayers();
    }
}