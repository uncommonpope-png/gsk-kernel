module.exports = { skill_sherpa_onnx_tts };

function skill_sherpa_onnx_tts() {
  return {
    name: "Sherpa ONNX TTS",
    description: "Local text-to-speech synthesis using Sherpa-ONNX neural TTS models (offline, no API)",
    when: "Generating speech audio from text locally, offline TTS, high-quality neural voice synthesis",
    commands: {
      cli: {
        basic: 'sherpa-onnx-tts --text "Hello, world!" --output hello.wav',
        withModel: `sherpa-onnx-tts --model /path/to/model.onnx --tokens /path/to/tokens.txt \\
  --text "Hello world" --output output.wav`,
        speed: 'sherpa-onnx-tts --text "Hello" --speed 1.2 --output fast.wav',
        listVoices: "sherpa-onnx-tts --list-voices"
      },
      download: {
        english: `wget https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-ljspeech.tar.bz2
tar xf vits-ljspeech.tar.bz2`,
        runModel: `sherpa-onnx-tts \\
  --vits-model=vits-ljspeech/vits-ljspeech.onnx \\
  --vits-tokens=vits-ljspeech/tokens.txt \\
  --text="Hello from sherpa-onnx" \\
  --output-filename=hello.wav`
      },
      playback: {
        macOS: "afplay output.wav",
        linux: "aplay output.wav",
        ffplay: "ffplay output.wav"
      },
      install: {
        pip: "pip install sherpa-onnx",
        brew: "brew install k2-fsa/sherpa-onnx/sherpa-onnx"
      }
    },
    notes: [
      "Fully offline — no internet required after model download",
      "Models: VITS, MeloTTS, Kokoro, Piper",
      "Supports 50+ languages with appropriate models",
      "Models available at: github.com/k2-fsa/sherpa-onnx"
    ],
    alternatives: {
      local: ["Coqui TTS", "Piper TTS"],
      free: ["Piper (offline, open source)", "MaryTTS (Java server)"]
    }
  };
}