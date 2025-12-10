import { ref } from 'vue';

export function useSpeechRecognition() {
  const isListening = ref(false);
  const transcript = ref('');
  const interimTranscript = ref('');
  const error = ref(null);

  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!Recognition) {
    error.value = "API no suportada en aquest navegador/entorn.";
    return { isListening, transcript, interimTranscript, error, start: () => { }, stop: () => { } };
  }

  const recognition = new Recognition();
  recognition.lang = 'ca-ES';
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    isListening.value = true;
    error.value = null;
    interimTranscript.value = '';
    console.log("🎤 Micròfon obert (Continu).");
  };

  recognition.onend = () => {

    isListening.value = false;
    console.log("🛑 Escolta finalitzada.");
  };

  recognition.onerror = (event) => {
    console.error("❌ Error Speech API:", event.error);
    if (event.error === 'no-speech') {
      return;
    }

    isListening.value = false;
    if (event.error === 'network') {
      error.value = "Error de Xarxa. Revisa la connexió.";
    } else if (event.error === 'not-allowed') {
      error.value = "Permís denegat. Revisa el micròfon.";
    } else {
      error.value = `Error: ${event.error}`;
    }
  };

  recognition.onresult = (event) => {
    let finalChunk = '';
    let interimChunk = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalChunk += event.results[i][0].transcript;
      } else {
        interimChunk += event.results[i][0].transcript;
      }
    }

    if (finalChunk) {
      transcript.value = finalChunk;
    }
    interimTranscript.value = interimChunk;
  };

  const start = () => {
    if (isListening.value) return;
    try {
      recognition.start();
    } catch (e) {
      console.error("Error starting recognition", e)
    }
  };
  const stop = () => {
    try {
      recognition.stop();
    } catch (e) { }
  };

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    start,
    stop
  };
}
