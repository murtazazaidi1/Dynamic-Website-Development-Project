
<?php

// Connect to the database and load the team builders
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../services/QuestionnaireBuilder.php";
require_once __DIR__ . "/../services/QuestionBuilder.php";

// Return data in JSON format
header("Content-Type: application/json; charset=utf-8");

try {
    // Get questionnaire ID from the URL
    $id = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

    if (!$id || $id < 1) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid questionnaire ID"]);
        exit;
    }

    // Connect to MySQL
    $db = getDatabaseConnection();

    // Henri's builder: questionnaire, pages and categories
    $questionnaire = buildQuestionnaire($db, $id);

    // Linh and Tu's builder: questions and answer options
    $questionnaire["questions"] = buildQuestionsForCategories(
        $db,
        $questionnaire["categories"]
    );

    // Return complete questionnaire JSON
    echo json_encode(
        $questionnaire,
        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
    );

} catch (InvalidArgumentException $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error"]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["error" => "Questionnaire generation failed"]);
}
