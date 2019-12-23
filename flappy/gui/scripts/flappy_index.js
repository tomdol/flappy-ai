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
    }
};

const emptyPlayerName = () => {
    const name_field = $('#player_name_field');

    const removeAnimation = () => {
        name_field.removeClass("shake");
        name_field.off('animationend', removeAnimation);
    };

    name_field.bind('animationend', removeAnimation);
    name_field.addClass("shake");
    name_field.trigger('focus');
}


$('#new_game_window').on('shown.bs.modal', () => {
    $('#player_name_field').trigger('focus');
    $('#player_name_field')[0].value = "";
    $('#player_email_field')[0].value = "";
});

$('#player_name_field').keypress(handleKeyPress);
$('#player_email_field').keypress(handleKeyPress);
