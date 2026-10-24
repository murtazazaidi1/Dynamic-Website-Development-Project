
import { useState, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline, Box, Button } from "@mui/material";
import type { Questionnaire } from "./types/questionnaire";
import { loadQuestionnaire } from "./services/questionnaireLoader";
import QuestionnaireView from "./components/questionnaire/Questionnaire";
import { useDispatch } from "react-redux";
import { loadQuestionnaire as setReduxQuestionnaire } from "./store/answerSlice";
import "./App.css";

interface Branding {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  logo: string;
  backgroundImage: string;
}

function App() {
  // so it will store the questionnaire after loading it
  const dispatch = useDispatch();
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [error, setError] = useState("");
  const [branding, setBranding] = useState<Branding | null>(null);

  //logic so that the user can switch between the questionnaires and we can add more later if needed
  const availableQuestionnaires = [
      "questionnaire.json",
      "second-questionnaire.json"
  ]
  const [currentIndex, setCurrentIndex] = useState(0)
  const handleNextQuestionnaire = () => {
    setCurrentIndex((prev) => prev + 1)
  }
  const handlePreviousQuestionnaire = () => {
    setCurrentIndex((prev) => prev - 1)
  }

  // Loads the JSON when the page opens by user
  useEffect(() => {
    const selectedFile = availableQuestionnaires[currentIndex]
    loadQuestionnaire(selectedFile)
        .then((data) => {
          setQuestionnaire(data);
          dispatch(setReduxQuestionnaire(data));
        })
        .catch(() => {
          setError("Something went wrong while loading the questionnaire.");
        });
  }, [currentIndex, dispatch]);


  useEffect(() => {
  fetch("/questionnaires/branding.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Could not load branding");
      }
      return response.json();
    })
    .then((data: Branding) => {
      setBranding(data);
    })
    .catch((error) => {
      console.error("Branding error:", error);
    });
}, []);
  //this makes it so as you switch questionnaires it goes to the top of the page
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentIndex])
const theme = createTheme({
  palette: {
    primary: {
      main: branding?.primaryColor || "#1976d2",
    },
    background: {
      default: branding?.backgroundColor || "#ffffff",
    },
    text: {
      primary: branding?.textColor || "#222222",
    },
  },
});

  // I added this so that the user can see if there is an error while loading the JSON
  if (error) {
    return <p>{error}</p>;
  }

  // So that the user can see that the questionnaire is loading
  if (!questionnaire) {
    return <p>Loading questionnaire...</p>;
  }

  return (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Box
      sx={{
        minHeight: "100vh",
        p: 3,
        backgroundColor: theme.palette.background.default,
        backgroundImage: branding?.backgroundImage
          ? `url("${branding.backgroundImage}")`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {branding?.logo && (
        <Box
          component="img"
          src={branding.logo}
          alt="Questionnaire logo"
          sx={{ maxWidth: 180, maxHeight: 100, mb: 2 }}
        />
      )}
      <h1>{questionnaire.title}</h1>
      <p>{questionnaire.description}</p>

      <h2>{questionnaire.introduction.heading}</h2>
      <p>{questionnaire.introduction.text}</p>
      <p>{questionnaire.introduction.instructions}</p>

<QuestionnaireView questionnaire={questionnaire} />
      {/* these are the buttons to switch between the questionnaires */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center'}}>
        <Button variant='outlined' onClick={handlePreviousQuestionnaire} disabled={currentIndex === 0}>Previous Questionnaire</Button>
        <Button variant='contained' onClick={handleNextQuestionnaire} disabled={currentIndex === availableQuestionnaires.length - 1}>Next Questionnaire</Button>
      </Box>
        </Box>
  </ThemeProvider>
);
}

export default App;
