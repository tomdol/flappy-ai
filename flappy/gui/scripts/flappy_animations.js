const animateObject = (animation_target_id, idx = 0) => {
    const obj_to_animate = $(animation_target_id);

    const animation_classes = ["rubberBand", "bounce", "shake", "tada", "wobble", "heartBeat", "flash"];
    const next_animation_class = animation_classes[idx];

    // callback invoked when the animation ends
    // need to remove the current animation class and the callback itself from the animated object
    const removeAnimation = () => {
        obj_to_animate.removeClass(next_animation_class);
        obj_to_animate.off('animationend', removeAnimation);
    };

    obj_to_animate.bind('animationend', removeAnimation);
    obj_to_animate.addClass(next_animation_class);

    // schedule the next animation in 5s
    setTimeout(() => {
        const next_animation_idx = (idx + 1) % animation_classes.length;
        animateObject(animation_target_id, next_animation_idx);
    }, 5000);
};

const startAnimatingBird = (bird_id) => {
    // start with an initial delay of 5s
    setTimeout(() => { animateObject(bird_id); }, 5000);
}
