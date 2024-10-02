<?php
header('Content-Type: application/json');

// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "gierka";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

// Get the player name from the POST request
$playerName = isset($_POST['playerName']) ? $conn->real_escape_string($_POST['playerName']) : '';

if (empty($playerName)) {
    echo json_encode(['success' => false, 'message' => 'Player name is empty']);
    $conn->close();
    exit();
}

// Insert player name into db
$sql = "INSERT INTO players (name) VALUES ('$playerName')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
}

$conn->close();