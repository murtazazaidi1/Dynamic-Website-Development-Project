import type { Questionnaire } from "../types/questionnaire";

// it will Load a questionnaire from the JSON folder
export async function loadQuestionnaire(
filename?: string
): Promise<Questionnaire> {
const params = new URLSearchParams(window.location.search);

const selectedFile =
  filename ||
  params.get("questionnaire") ||
  "questionnaire.json";

if (!/^[a-zA-Z0-9_-]+\.json$/.test(selectedFile)) {
  throw new Error("Invalid questionnaire filename");
}
const response = await fetch(`/questionnaires/${selectedFile}`);
  // It is a validation to check whether the file exist or not
  if (!response.ok) {
    throw new Error("Could not load the questionnaire");
  }

  // It will convert the JSON file into an object
  const questionnaire = await response.json();

  // It is a validation to check whether the main parts of the questionnaire exist
  if (
    !questionnaire ||
    !questionnaire.pages ||
    !questionnaire.categories ||
    !questionnaire.questions
  ) {
    throw new Error("The questionnaire JSON is not valid");
  }

  return questionnaire as Questionnaire;
}
