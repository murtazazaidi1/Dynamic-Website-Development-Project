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


    }

}

?>
