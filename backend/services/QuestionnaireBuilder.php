<?php
//this makes sure the connection file is only used once
require_once __DIR__ . '/config/db.php';

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
        if ($questionnaireId < 1){
            throw new InvalidArgumentException("Questionnaire ID must be positive");
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
                'includeNestedQuestionsInParent' => true ],
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
    //this retrieves all pages ordered by sequence nbr
    private function getPages(int $questionnaireId): array
    {
        $stmt = $this->db->prepare("
        SELECT pid, ptitle, pseqnum
        FROM qpage
        WHERE qid = :qid
        ORDER BY pseqnum ASC");

        $stmt->execute(['qid' => $questionnaireId]);
        $pages = [];

        foreach ($stmt->fetchAll() as $row) {
        $pages[] = ['id' => "page-{$row['pid']}", 'title' => $row['ptitle'], 'order' => $row['pseqnum']];
        }
        return $pages;
    }
    //this retrieves all teh categories for given pages and ordered by sequence nbr
    private function getCategories(array $pages): array
    {
        if (empty($pages))
        {
        return [];
        }
        $pageIds = array_map(fn($p) => (int)str_replace('page-', '', $p['id']), $pages);
        $placeholders = implode(',', array_fill(0, count($pageIds), '?'));
        $stmt = $this->db->prepare("
        SELECT gid, pid, gseqnum, gtitle, hostgid
        FROM qgroup
        WHERE pid IN ($placeholders)
        ORDER BY gseqnum ASC");

        $stmt->execute($pageIds);
        $categories = [];
        $pageIdMap = [];

        foreach($pages as $page){
        $dbPid = (int)str_replace('page-', '', $page['id']);
        $pageIdMap[$dbPid] = $page['id'];
        }
        foreach($stmt->fetchAll() as $row){
        $pageId = $pageIdMap[$row['pid']] ?? null;
        $parentId = $row['hostgid'] ? "category-{$row['hostgid']}" : null;
        //this maps the db fields into the JSON fields
        $categories[] = [
             'id' => "category-{$row['gid']}",
             'pageId' => $pageId,
             'parentId' => $parentId,
             'title' => $row['gtitle'],
             'order' => $row['gseqnum']
              ];
        }
        return $categories;
    }
    //as seen from teh function name, this outputs the questionnaire in json format
    public function outputAsJson(int $questionnaireId): void
    {
    header('Content-Type: application/json');
    $questionnaire = $this->buildQuestionnaire($questionnaireId);
    //from playing around the net and with AI, i found these two JSON thingies
    //the pretty print makes it readable and the other makes sure non ASCII chars arent escaped
    echo json_encode($questionnaire, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

}

//i asked AI for some way to test this so whoever is able to test this live on XAMPP just un comment the code below
/*
 * WHY: This section allows the file to be run directly for testing.
 * It checks for a query parameter (?qid=9001) and outputs the JSON.
 *
 * WHAT: If ?qid is provided, use that ID. Otherwise, default to 9001 for testing.
if (isset($_GET['qid'])) {
    //* User provided a questionnaire ID via URL parameter
    $questionnaireId = (int)$_GET['qid'];
    $builder = new QuestionnaireBuilder();

    try {
        $builder->outputAsJson($questionnaireId);
    } catch (Exception $e) {
        // *WHY: Catch errors and return them as JSON with HTTP 500 status
        // *This makes debugging easier for API consumers
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    // *Default: use questionnaire 9001 for testing
    // *WHY: Provides a default behavior for quick testing without parameters
    $builder = new QuestionnaireBuilder();
    $builder->outputAsJson(9001);
}
*/

?>
