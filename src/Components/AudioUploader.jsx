import { useState, useRef } from "react";
import { CloudUpload, Mic, MicOff, Loader, Eye } from "lucide-react";
import "./AudioUploader.css";

const AudioUploader = () => {
    const [file, setFile] = useState(null);
    const [filename, setFilename] = useState(""); // ✅ Store filename separately
    const [transcription, setTranscription] = useState("");
    const [pastTranscriptions, setPastTranscriptions] = useState([]);
    const [recording, setRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const fileInputRef = useRef(null);

    // ✅ Retrieve user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    const openFileSelector = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
            setFilename(selectedFile.name); // ✅ Set filename
            setErrorMessage("");
        }
    };

    const uploadFile = async () => {
        if (!file) return setErrorMessage("Please select or record an audio file.");
        if (!user) return setErrorMessage("You must be logged in to upload audio.");

        setIsLoading(true);
        setErrorMessage("");

        const formData = new FormData();
        formData.append("audio", file);
        formData.append("userId", user.id);

        try {
            const response = await fetch("https://speech-to-text-backend-henna.vercel.app/transcribe", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (!response.ok || !data.transcript) throw new Error("Failed to transcribe audio.");

            setTranscription(data.transcript);
            setFile(null);
            setFilename(""); // ✅ Clear filename after upload
        } catch (error) {
            setErrorMessage(error.message || "Error uploading file. Please try again.");
            console.error("Upload Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Fetch past transcriptions
    const fetchPastTranscriptions = async () => {
        if (!user) return setErrorMessage("You must be logged in to view transcriptions.");

        setIsLoading(true);
        try {
            const response = await fetch(`https://speech-to-text-backend-henna.vercel.app/transcriptions/${user.id}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });

            const data = await response.json();
            if (!response.ok) throw new Error("Failed to fetch transcriptions.");
            setPastTranscriptions(data.transcriptions);
        } catch (error) {
            setErrorMessage(error.message || "Error fetching transcriptions.");
            console.error("Fetch Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorder.current.ondataavailable = (event) => {
                audioChunks.current.push(event.data);
            };

            mediaRecorder.current.onstop = async () => {
                const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
                const newFile = new File([audioBlob], "recording.wav", { type: "audio/wav" });

                setFile(newFile);
                setFilename("recording.wav"); // ✅ Set filename for recording
            };

            mediaRecorder.current.start();
            setRecording(true);
        } catch (error) {
            setErrorMessage("Microphone access denied. Please allow access to record audio.");
            console.error("Microphone error:", error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current) {
            mediaRecorder.current.stop();
            setRecording(false);
        }
    };

    return (
        <div className="audio-uploader-container">
            <div className="audio-uploader-card">
                {/* ✅ Display Hi, Username */}
                {user && <h1 className="title">Hi, {user.name}!</h1>}

                <h2 className="subtitle">Upload or record audio to get a transcription.</h2>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                {filename && <p className="file-name">Selected File: {filename}</p>}


                <input type="file" accept="audio/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                <div className="button-group">
                    <button onClick={openFileSelector} className="btn select-file-btn">
                        <CloudUpload className="icon" /> Choose Audio File
                    </button>
                    <button onClick={uploadFile} className="btn upload-btn" disabled={isLoading || !file}>
                        {isLoading ? <Loader className="icon spin" /> : "Upload & Transcribe"}
                    </button>
                    <button onClick={fetchPastTranscriptions} className="btn view-transcriptions-btn">
                        <Eye className="icon" /> View Past Transcriptions
                    </button>
                </div>

                {/* ✅ Show the filename if a file is selected */}

                <div className="recording-section">
                    {recording ? (
                        <button onClick={stopRecording} className="btn stop-recording-btn">
                            <MicOff className="icon" /> Stop Recording
                        </button>
                    ) : (
                        <button onClick={startRecording} className="btn start-recording-btn">
                            <Mic className="icon" /> Start Recording
                        </button>
                    )}
                </div>

                {transcription && (
                    <div className="transcription-box">
                        <h2>Latest Transcription:</h2>
                        <p>{transcription}</p>
                    </div>
                )}

                {/* ✅ Display past transcriptions with file_url */}
                {pastTranscriptions.length > 0 && (
                    <div className="transcription-box">
                        <h2>Past Transcriptions:</h2>
                        <ul>
                            {pastTranscriptions.map((t, index) => (
                                <li key={index}>
                                    <strong>File:</strong> {t.file_url || "N/A"} <br />
                                    <strong>Text:</strong> {t.transcript}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AudioUploader;
