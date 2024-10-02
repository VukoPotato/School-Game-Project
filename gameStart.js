function gameStart() {
    document.getElementById("game").style.display="block"
    document.getElementById("gamestart").style.display="none"
}

document.getElementById('startbutton').addEventListener('click', startGame);

function startGame() {
    const playerName = document.getElementById('playerName').value;

    // Send the player name to the PHP backend for saving
    fetch('savePlayerName.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `playerName=${encodeURIComponent(playerName)}`,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Set knight name dynamically
            document.querySelector('.playerHealth h1').textContent = playerName;
            localStorage.setItem('playerName', playerName);

            // Show the game, hide the start screen
            document.getElementById("game").style.display = "block";
            document.getElementById("gamestart").style.display = "none";
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
