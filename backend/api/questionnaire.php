
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

    // Nora's configuration files
    $configPath = __DIR__ . "/../../public/config/";

    $presentationFile = $configPath . "presentation.json";
    $metadataFile = $configPath . "questionnaire-metadata.json";

    // Read and validate the presentation configuration
    $presentation = json_decode(
        file_get_contents($presentationFile),
        true,
        512,
        JSON_THROW_ON_ERROR
    );

    // Read and validate the questionnaire metadata
    $metadata = json_decode(
        file_get_contents($metadataFile),
        true,
        512,
        JSON_THROW_ON_ERROR
    );

    // Add presentation settings to the questionnaire
    $questionnaire["version"] = $presentation["version"] ?? "1.0";
    $questionnaire["introduction"] = $presentation["introduction"] ?? [];
    $questionnaire["results"] = $presentation["results"] ?? [];

    // Get metadata for the requested questionnaire
    $questionMetadata = $metadata[(string) $id]["questions"] ?? [];

    // Apply metadata to each database-generated question
    foreach ($questionnaire["questions"] as $questionId => &$question) {
        $settings = $questionMetadata[(string) $questionId] ?? [];

        // Keep database-generated content unchanged
        $question["required"] = $settings["required"] ?? false;
        $question["scored"] = $settings["scored"] ?? false;
    }
    unset($question);

    // Return complete questionnaire JSON
    echo json_encode(
        $questionnaire,
        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR
    );

} catch (InvalidArgumentException $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);

} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Database error"]);

} catch (Throwable $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Questionnaire generation failed"]);
}
