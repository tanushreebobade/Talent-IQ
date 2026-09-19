import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { PROBLEMS } from "../data/problems";
import Navbar from "../components/Navbar";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import { executeCode } from "../lib/compiler";
import axiosInstance from "../lib/axios";
import { useWindowSize } from "../hooks/useWindowSize";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const [currentProblemId, setCurrentProblemId] = useState(id && PROBLEMS[id] ? id : "two-sum");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(
    PROBLEMS[id && PROBLEMS[id] ? id : "two-sum"].starterCode.javascript
  );
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submissions state
  const [submissions, setSubmissions] = useState([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const currentProblem = PROBLEMS[currentProblemId];

  // Fetch submission history for the current problem
  const fetchSubmissions = useCallback(async (problemId) => {
    try {
      setIsLoadingSubmissions(true);
      const { data } = await axiosInstance.get(`/submissions/${problemId}`);
      if (data && data.submissions) {
        setSubmissions(data.submissions);
      }
    } catch (err) {
      console.warn("Could not fetch submission history:", err?.message);
    } finally {
      setIsLoadingSubmissions(false);
    }
  }, []);

  // update problem when URL param changes
  useEffect(() => {
    if (id && PROBLEMS[id]) {
      setCurrentProblemId(id);
      setCode(PROBLEMS[id].starterCode[selectedLanguage]);
      setOutput(null);
      fetchSubmissions(id);
    }
  }, [id, selectedLanguage, fetchSubmissions]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(currentProblem.starterCode[newLang]);
    setOutput(null);
  };

  const handleProblemChange = (newProblemId) => navigate(`/problem/${newProblemId}`);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });

    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  };

  const normalizeOutput = (out) => {
    if (!out) return "";
    return out
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          .replace(/\[\s+/g, "[")
          .replace(/\s+\]/g, "]")
          .replace(/\s*,\s*/g, ",")
      )
      .filter((line) => line.length > 0)
      .join("\n");
  };

  const checkIfTestsPassed = (actualOutput, expectedOutput) => {
    const normalizedActual = normalizeOutput(actualOutput);
    const normalizedExpected = normalizeOutput(expectedOutput);
    return normalizedActual === normalizedExpected;
  };

  // Run Code Handler
  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);

    if (result.success) {
      const expectedOutput = currentProblem.expectedOutput[selectedLanguage];
      const testsPassed = checkIfTestsPassed(result.output, expectedOutput);

      if (testsPassed) {
        toast.success("All test cases passed!");
      } else {
        toast.error("Output did not match expected test results.");
      }
    } else {
      toast.error(`Code execution failed: ${result.error || "Unknown error"}`);
    }
  };

  // Submit Code Handler (LeetCode Style)
  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setOutput(null);
    const startTime = performance.now();

    const result = await executeCode(selectedLanguage, code);
    const executionDuration = Math.round(performance.now() - startTime);

    setOutput(result);

    let status = "Compile Error";

    if (result.success) {
      const expectedOutput = currentProblem.expectedOutput[selectedLanguage];
      const testsPassed = checkIfTestsPassed(result.output, expectedOutput);
      status = testsPassed ? "Accepted" : "Wrong Answer";
    }

    // Persist submission to MongoDB backend
    try {
      await axiosInstance.post("/submissions", {
        problemId: currentProblemId,
        language: selectedLanguage,
        code,
        status,
        runtime: executionDuration,
        output: result.output || "",
        error: result.error || "",
      });

      // Refresh history list
      await fetchSubmissions(currentProblemId);
    } catch (saveErr) {
      console.error("Failed to persist submission to database:", saveErr);
    } finally {
      setIsSubmitting(false);
    }

    // Feedback
    if (status === "Accepted") {
      triggerConfetti();
      toast.success("Submission Accepted! Great job!");
      setActiveTab("submissions");
    } else if (status === "Wrong Answer") {
      toast.error("Submission Failed: Wrong Answer.");
      setActiveTab("submissions");
    } else {
      toast.error(`Submission Error: ${result.error || "Execution failed"}`);
    }
  };

  return (
    <div className="min-h-screen md:h-screen bg-base-100 flex flex-col overflow-x-hidden md:overflow-hidden">
      <Navbar />

      <div className="flex-1 overflow-x-hidden md:overflow-hidden">
        <PanelGroup key={isMobile ? "mobile" : "desktop"} direction={isMobile ? "vertical" : "horizontal"}>
          {/* Left panel - problem description & submission history */}
          <Panel defaultSize={isMobile ? 50 : 40} minSize={25}>
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={Object.values(PROBLEMS)}
              submissions={submissions}
              isLoadingSubmissions={isLoadingSubmissions}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </Panel>

          <PanelResizeHandle className={isMobile ? "h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" : "w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize"} />

          {/* Right panel - code editor & output */}
          <Panel defaultSize={isMobile ? 50 : 60} minSize={25}>
            <PanelGroup direction="vertical">
              {/* Top panel - Code editor */}
              <Panel defaultSize={70} minSize={30}>
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  isSubmitting={isSubmitting}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                  onSubmitCode={handleSubmitCode}
                />
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              {/* Bottom panel - Output Panel*/}
              <Panel defaultSize={30} minSize={20}>
                <OutputPanel output={output} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ProblemPage;
