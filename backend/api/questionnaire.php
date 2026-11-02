
<?php

// first it will connect to our database
require_once __DIR__ . "/../config/db.php";

// it will return data in JSON format
header("Content-Type: application/json");

try {
    // to get the questionnaire ID from the URL
    $id = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

    if (!$id || $id < 1) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid questionnaire ID"]);
        exit;
    }

    $db = getDatabaseConnection();

    // to find the questionnaire
    $sql = "SELECT qid, description, active
            FROM questionnaire
            WHERE qid = :id";

    $stmt = $db->prepare($sql);
    $stmt->execute(["id" => $id]);

    $questionnaire = $stmt->fetch();

    if (!$questionnaire) {
        http_response_code(404);
        echo json_encode(["error" => "Questionnaire not found"]);
        exit;
    }

    echo json_encode($questionnaire);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error"]);
}
