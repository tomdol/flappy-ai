// tries starting a new game if a user pressed enter
const handleKeyPress = (evt) => {
    if (evt.which == 13) {
        tryStartingNewGame();
    }
};

const tryStartingNewGame = () => {
    const name_field = $('#player_name_field');

    if (name_field.val() === null || name_field.val() === "") {
        emptyPlayerName();
    } else {
        $('#new_game_window').modal('hide');
    }
};

const emptyPlayerName = () => {
    const name_field = $('#player_name_field');

    const error_animation_class = "bounce";

    const removeAnimation = () => {
        name_field.removeClass(error_animation_class);
        name_field.off('animationend', removeAnimation);
    };

    name_field.bind('animationend', removeAnimation);
    name_field.addClass(error_animation_class);
    name_field.trigger('focus');
}

const startNewGame = (player_name) => {
    console.log("Starting new game for: ", player_name);
    window.location.href = `flappy.ai.html?player_name=${player_name}`;
};

const showScoreBoard = (player_name) => {
    window.location.href = "scoreboard.html";
};

const mainPage = () => {
    window.location.href = "index.html";
};

$('#new_game_window').on('shown.bs.modal', () => {
    $('#player_name_field').trigger('focus');
    $('#player_name_field')[0].value = "";
    $('#player_email_field')[0].value = "";
});

$('#new_game_window').on('hidden.bs.modal', (evt) => {
    const player_name = $('#player_name_field').val();
    if (player_name) {
        startNewGame(player_name);
    }
});

$('#player_name_field').keypress(handleKeyPress);
$('#player_email_field').keypress(handleKeyPress);
