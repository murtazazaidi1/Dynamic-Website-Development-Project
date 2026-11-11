<?php

class QuestionnaireBuilder
{
    private PDO $db;

    // Use the database connection provided by the API
    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function buildQuestionnaire(int $questionnaireId): array
    {
        if ($questionnaireId < 1) {
            throw new InvalidArgumentException(
                "Questionnaire ID must be positive."
            );
        }

        $questionnaire = $this->getQuestionnaireInfo($questionnaireId);

        if (!$questionnaire) {
            throw new RuntimeException(
                "Questionnaire not found: " . $questionnaireId
            );
        }

        $pages = $this->getPages($questionnaireId);
        $categories = $this->getCategories($pages);

        // Presentation settings are added separately by the API
        return [
            'id' => (string) $questionnaire['qid'],
            'title' => $questionnaire['description'] ?? '',
            'description' => $questionnaire['description'] ?? '',
            'pages' => $pages,
            'categories' => $categories,
            'questions' => []
        ];
    }

    private function getQuestionnaireInfo(int $questionnaireId): ?array
    {
        $stmt = $this->db->prepare(
            "SELECT qid, predecessor, description, root, active
             FROM questionnaire
             WHERE qid = :qid"
        );

        $stmt->execute(['qid' => $questionnaireId]);

        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    private function getPages(int $questionnaireId): array
    {
        $stmt = $this->db->prepare(
            "SELECT pid, ptitle, pseqnum
             FROM qpage
             WHERE qid = :qid
             ORDER BY pseqnum ASC, pid ASC"
        );

        $stmt->execute(['qid' => $questionnaireId]);

        $pages = [];

        foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $pages[] = [
                'id' => (string) $row['pid'],
                'title' => $row['ptitle'],
                'order' => (int) ($row['pseqnum'] ?? 0)
            ];
        }

        return $pages;
    }

    private function getCategories(array $pages): array
    {
        if (empty($pages)) {
            return [];
        }

        // Convert page IDs into database integers
        $pageIds = array_map(
            fn($page) => (int) $page['id'],
            $pages
        );

        $placeholders = implode(
            ',',
            array_fill(0, count($pageIds), '?')
        );

        $stmt = $this->db->prepare(
            "SELECT gid, pid, gseqnum, gtitle, hostgid
             FROM qgroup
             WHERE pid IN ($placeholders)
             ORDER BY pid ASC, gseqnum ASC, gid ASC"
        );

        $stmt->execute($pageIds);

        $groupRows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Collect all category IDs to validate parent references
        $groupIds = [];

        foreach ($groupRows as $row) {
            $groupIds[(int) $row['gid']] = true;
        }

        $categories = [];

        foreach ($groupRows as $row) {
            $parentId = $row['hostgid'] === null
                ? null
                : (int) $row['hostgid'];

            if (
                $parentId !== null &&
                !isset($groupIds[$parentId])
            ) {
                throw new RuntimeException(
                    "Category {$row['gid']} references an invalid parent."
                );
            }

            $categories[] = [
                'id' => (string) $row['gid'],
                'pageId' => (string) $row['pid'],
                'parentId' => $parentId === null
                    ? null
                    : (string) $parentId,
                'title' => $row['gtitle'],
                'order' => (int) ($row['gseqnum'] ?? 0)
            ];
        }

        return $categories;
    }
}

// Compatibility function for the existing demo API
function buildQuestionnaire(PDO $db, int $id): array
{
    $builder = new QuestionnaireBuilder($db);

    return $builder->buildQuestionnaire($id);
}
