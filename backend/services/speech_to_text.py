from google.cloud import speech
import io



client = speech.SpeechClient()
def transcribe_audio(file_path, language_code="en-US"):
    # Load audio file
    with io.open(file_path, "rb") as audio_file:
        content = audio_file.read()
    
    # Configure request with language code
    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code=language_code,
    )
    
    # Send request to Google Cloud
    response = client.recognize(config=config, audio=audio)

    # Process and print results
    for result in response.results:
        print("Transcript:", result.alternatives[0].transcript)

# Example usage with a sample audio file
transcribe_audio("path/to/your_audio_file.wav", language_code="es-ES")  # 'es-ES' for Spanish

def transcribe_multilingual(file_path, language_code="en-US"):
    print(f"Transcribing audio with language code: {language_code}")
    transcribe_audio(file_path, language_code)
    
    
language_map = {
    "English": "en-US",
    "Spanish": "es-ES",
    "French": "fr-FR",
    "Hindi": "hi-IN",
    # Add more languages as needed
}

# User selects language, then transcribe
user_selected_language = "Spanish"  # Simulating user input
language_code = language_map[user_selected_language]
transcribe_multilingual("path/to/your_audio_file.wav", language_code)