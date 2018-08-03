const SpeechRecognition = webkitSpeechRecognition
const SpeechGrammarList = webkitSpeechGrammarList
const SpeechRecognitionEvent = webkitSpeechRecognitionEvent

let diagnostic = document.querySelector('.output')

const testBtn = document.querySelector('button')

const controls = ['up', 'down', 'left', 'right']
const grammar = 'JSGF V1.0; grammar controls; public <control> = ' + controls.join(' | ') + ' ;'

const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.onresult = (event) => {
  let last = event.results.length - 1;
  let control = event.results[last][0].transcript;

  diagnostic.textContent = 'Result received: ' + control + '.';

  console.log('Confidence: ' + event.results[0][0].confidence)
}

recognition.onstart = (event) => {
  console.log('SpeechRecognition.onstart')
}
recognition.onaudiostart = (event) => {
  console.log('SpeechRecognition.onaudiostart')
}

recognition.onsoundstart = (event) => {
  console.log('SpeechRecognition.onsoundstart')
}

recognition.onspeechstart = (event) => {
  console.log('SpeechRecognition.onspeechstart')
}

// recognition.onresult happens here

recognition.onspeechend = () => {
  console.log('SpeechRecognition.onspeechend')
  recognition.stop();
}

recognition.onsoundend = (event) => {
  console.log('SpeechRecognition.onsoundend')
}

recognition.onaudioend = (event) => {
  console.log('SpeechRecognition.onaudioend')
}

recognition.onend = (event) => {
  console.log('SpeechRecognition.onend')
}

recognition.onerror = (event) => {
  console.log('ERROR!!!!!')
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}

recognition.onnomatch = (event) => {
  diagnostic.textContent = "I didn't recognise that control.";
  console.log('SpeechRecognition.onnomatch')
}

testBtn.onclick = () => {
  recognition.start();
  console.log('Ready to receive voice command.');
}

export default recognition
