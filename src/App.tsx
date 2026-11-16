
import { useState, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
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
  const dispatch = useDispatch();
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [error, setError] = useState("");
  const [branding, setBranding] = useState<Branding | null>(null);

  // Load the questionnaire from the PHP API
  useEffect(() => {
    loadQuestionnaire("questionnaire.json")
      .then((data) => {
        setQuestionnaire(data);
        dispatch(setReduxQuestionnaire(data));
      })
      .catch(() => {
        setError("Something went wrong while loading the questionnaire.");
      });
  }, [dispatch]);

  // Load branding settings
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

  if (error) {
    return <p>{error}</p>;
  }

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

        <QuestionnaireView
          key={questionnaire.id}
          questionnaire={questionnaire}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
