<?php

class QuestionBuilder
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function buildQuestions(array $groupIds): array
    {
        if (empty($groupIds)) {
            return [];
        }

        $groupIds = array_map('intval', $groupIds);
        $placeholders = implode(',', array_fill(0, count($groupIds), '?'));

        $stmt = $this->db->prepare(
            "SELECT fid, gid, fseqnum, ftitle
             FROM qfield
             WHERE gid IN ($placeholders)
             ORDER BY gid ASC, fseqnum ASC, fid ASC"
        );

        $stmt->execute($groupIds);

        $questions = [];

        foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $fid = (int) $row['fid'];

            // fxy is not handled yet
            $details = $this->getTextQuestion($fid)
                ?? $this->getSliderQuestion($fid)
                ?? $this->getChoiceQuestion($fid);

            if ($details === null) {
                continue;
            }

            $questions[(string) $fid] = array_merge([
                'categoryId' => (string) $row['gid'],
                'text' => $row['ftitle'],
                'required' => false,
                'order' => (int) ($row['fseqnum'] ?? 0)
            ], $details);
        }

        return $questions;
    }

    private function getTextQuestion(int $fid): ?array
    {
        $stmt = $this->db->prepare(
            "SELECT ftlabel, ftstoreas
             FROM ftext
             WHERE ftid = :id
             LIMIT 1"
        );

        $stmt->execute(['id' => $fid]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            return null;
        }

        $question = [
            'type' => $row['ftstoreas'] === 'DATE' ? 'date' : 'text',
            'scored' => false
        ];

        if (!empty($row['ftlabel'])) {
            $question['placeholder'] = $row['ftlabel'];
        }

        return $question;
    }

    private function getSliderQuestion(int $fid): ?array
    {
        $stmt = $this->db->prepare(
            "SELECT fsrangeb, fsrangee
             FROM fslider
             WHERE fsid = :id
             LIMIT 1"
        );

        $stmt->execute(['id' => $fid]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            return null;
        }

        return [
            'type' => 'slider',
            'scored' => true,
            'min' => (float) $row['fsrangeb'],
            'max' => (float) $row['fsrangee'],
            'step' => 1
        ];
    }

    private function getChoiceQuestion(int $fid): ?array
    {
        $stmt = $this->db->prepare(
            "SELECT fclabel, fcoutvalid, fcpresentation
             FROM fchoice
             WHERE fcid = :id
             ORDER BY fcseqnum ASC, dummyid ASC"
        );

        $stmt->execute(['id' => $fid]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!$rows) {
            return null;
        }

        $types = [
            'RADIO' => 'radio',
            'CHECKBOX' => 'multiselect',
            'BOXDROPDOWN' => 'select',
            'HOVERDROPDOWN' => 'select'
        ];
        $type = $types[$rows[0]['fcpresentation']];

        $options = [];

        foreach ($rows as $row) {
            $options[] = [
                'label' => $row['fclabel'],
                'value' => (int) $row['fcoutvalid']
            ];
        }

        return [
            'type' => $type,
            'scored' => $type !== 'multiselect',
            'options' => $options
        ];
    }
}