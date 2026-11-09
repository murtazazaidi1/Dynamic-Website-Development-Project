<?php
//this makes sure the connection file is only used once
require_once __DIR__ . '/database/db.php';

class QuestionnaireBuilder{
    private PDO $db;

    public function __construct(){
        $this->db = getDatabaseConnection();
    }

    public function buildQuestionnaire(int $questionnaireId): array{
        $questionnaire = $this->getQuestionnaireInfo($questionnaireId);
       //error in case we cant find the questionnaire or some other error
        if(!$questionnaire){
            throw new Exception("Questionnaire not found");
        }
        $pages = $this->getPages($questionnaireId);
        $categories = $this->getCategories($pages);

        return[
        'id' => "questionnaire-{$questionnaireId}",
        'title' => $questionnaire['description'] ?? "Questionnaire {$questionnaireId}",
        'description' => $questionnaire['description'] ?? "",
        'version' => "1.0",
        'introduction' => ['heading' => 'Welcome', 'text' => 'Please complete this questionnaire', 'instructions' => 'Answer all required questions'],
        'pages' => $pages,
        'categories' => $categories,
        'questions' => [],
        'results' => [
            'title' => 'Results',
            'calculations' => [
                'method' => 'average',
                'rounding' => 'nearest-integer',
                'excludeUnanswered' => true,
                'includeNestedQuestionIsParent' => true ],
            'radarChart' => [
                'enabled' => true,
                'min' => 0,
                'max' => 5 ],
            'showNonScoredAnswers' => true,
            'allowPrint' => true
                ]
            ];
    }

    private function getQuestionnaireInfo(int $questionnaireId): ?array
    {
    //this is to prevent sql injections here :qid is just a placeholder for now
    //this was suggested by AI and it is a very important thing to have tbh
    $stmt = $this->db->prepare("
    SELECT qid, description, active
    FROM questionnaire
    WHERE qid = :qid");
    $stmt->execute(['qid' => $questionnaireId]);
    return $stmt->fetch() ?: null;
    }

}

?>
