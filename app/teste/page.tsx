"use client";

import { Textarea } from "@/components/ui/textarea";
// Import necessary modules and components
import { useEffect, useState, useRef } from "react";

// Declare a global interface to add the webkitSpeechRecognition property to the Window object
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

// Export the MicrophoneComponent function component
export default function MicrophoneComponent() {
  // State variables to manage recording status, completion, and transcript
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [transcript, setTranscript] = useState("");

  // Reference to store the SpeechRecognition instance
  const recognitionRef = useRef<any>(null);

  // Function to start recording
  const startRecording = () => {
    setIsRecording(true);
    // Create a new SpeechRecognition instance and configure it
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;

    // Event handler for speech recognition results
    recognitionRef.current.onresult = (event: any) => {
      const { transcript } = event.results[event.results.length - 1][0];

      // Log the recognition results and update the transcript state
      setTranscript((obj) => {
        const newObj = obj + transcript;
        return newObj;
      });
    };

    // Start the speech recognition
    recognitionRef.current.start();
  };

  // Cleanup effect when the component unmounts
  useEffect(() => {
    return () => {
      // Stop the speech recognition if it's active
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    console.log(transcript.length);
  }, [transcript]);

  // Function to stop recording
  const stopRecording = () => {
    if (recognitionRef.current) {
      // Stop the speech recognition and mark recording as complete
      recognitionRef.current.stop();
      setRecordingComplete(true);
    }
  };

  // Toggle recording state and manage recording actions
  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  // Render the microphone component with appropriate UI based on recording state
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="w-full">
        <div className="max-w-[400px] m-auto rounded-md border p-4 bg-white flex flex-col justify-between gap-2">
          <div className="flex-1 flex w-full justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none text-primary-foreground">
                {!isRecording
                  ? "Gravar"
                  : recordingComplete
                  ? "Gravado"
                  : "Gravando"}
              </p>
              <p className="text-sm text-muted-foreground">
                {!isRecording
                  ? "Aperte o botão para começar a falar"
                  : recordingComplete
                  ? "Finalizado."
                  : "Comece a falar..."}
              </p>
            </div>
            {isRecording && (
              <div className="rounded-full w-4 h-4 bg-red-400 animate-pulse" />
            )}
          </div>
          <div className="flex justify-between gap-2">
            <textarea
              value={transcript}
              rows={Math.ceil(transcript.length / 39)}
              className="px-2 py-1 text-sm text-justify outline-none mb-0 border rounded-md border-muted-foreground text-primary-foreground w-full min-h-24 overflow-hidden"
              onChange={(e) => setTranscript(e.target.value)}
            />
            <div className="flex items-center">
              {isRecording ? (
                // Button for stopping recording
                <button
                  onClick={handleToggleRecording}
                  className="flex items-center justify-center bg-red-400 hover:bg-red-500 rounded-full w-14 h-14 focus:outline-none"
                >
                  <svg
                    className="h-8 w-8 "
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="white" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                </button>
              ) : (
                // Button for starting recording
                <button
                  onClick={handleToggleRecording}
                  className="flex items-center justify-center bg-blue-400 hover:bg-blue-500 rounded-full w-14 h-14 focus:outline-none"
                >
                  <svg
                    viewBox="0 0 256 256"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-white"
                  >
                    <path
                      fill="currentColor" // Change fill color to the desired color
                      d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
