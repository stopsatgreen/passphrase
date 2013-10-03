document.addEventListener('DOMContentLoaded', function () {
	var canDo = ('register' in document && 'webkitSpeechRecognition' in window);
	function disableBtn (el) {
		el.setAttribute('disabled','true');
		return;
	}
	function enableBtn (el) {
		el.removeAttribute('disabled');
		return;
	}
	if (canDo) {
// Register new element
		var phraseInputProto = Object.create(HTMLInputElement.prototype),
			phraseInput = document.register('phrase-input', {
				prototype: phraseInputProto,
				extends: 'input'
			});
// Create new speech recognition instance
		var	recognition = new webkitSpeechRecognition(),
// String formatting for speech results
			two_line = /\n\n/g,
			one_line = /\n/g,
			linebreak = function (s) {
				return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
			},
// Query the DOM & set up misc vars.
			phraseEl = document.querySelector('input[is="phrase-input"]'),
			phraseTpl = document.getElementById('phrase-input'),
			get = document.getElementById('get'),
			getting = false,
			recognizing = false,
			final_transcript, triggerEl;
// Create Shadow DOM in phrase-input
		phraseEl.removeAttribute('type');
		var newRoot = phraseEl.createShadowRoot(),
			rootTpl = phraseTpl.content.cloneNode(true);
		newRoot.appendChild(rootTpl);
		var getRoot = phraseEl.shadowRoot,
			setBtn = getRoot.querySelector('#set'),
			final_span = getRoot.querySelector('#final_span');
// When recognition process starts, disable buttons		
		recognition.onstart = function () {
			console.time('Listening');
			disableBtn(triggerEl);
			recognizing = true;
		};
// When recognition results are available, add them to final_transcript			
		recognition.onresult = function (e) {
			for (var i = e.resultIndex; i < e.results.length; ++i) {
				if (e.results[i].isFinal) {
					final_transcript += e.results[i][0].transcript;
				}
			}
// Match an existing passphrase; if it matches, do x
			if (getting) {
				var passphrase = localStorage.getItem('passphrase');
				if (final_transcript == passphrase) {
					var dialog = document.createElement('dialog');
					dialog.textContent = 'Success!';
					dialog.addEventListener('click', function() {
						dialog.close();
					});
					document.body.appendChild(dialog);
					dialog.showModal();
				}
				getting = false;
// Create a new passphrase; if confirmed, save it
			} else {
				var isCorrect = document.createElement('button');
				isCorrect.textContent = 'Correct?';
				isCorrect.addEventListener('click', function (e) {
					localStorage.setItem('passphrase',final_transcript);
					e.currentTarget.parentNode.remove();
				});
// Show the passphrase on screen
				final_span.innerHTML = linebreak(final_transcript);
				final_span.appendChild(isCorrect);
			}
		};
// Error detection	
		recognition.onerror = function (e) {
			console.error('Error:',e.error);
		};
// When recognition ends, enable buttons again	
		recognition.onend = function () {
			console.timeEnd('Listening');
			enableBtn(triggerEl);
			recognizing = false;
		};
// Run when either button is clicked
		var startButton = function (e) {
// Stop recognition if it's still running
			if (recognizing) {
				recognition.stop();
				return;
			}
// Set recognition parameters and run it
			recognition.lang = 'en-GB';
			recognition.start();
//	Setting the trigger button to global scope so that it can be accessed by events;
//	Seems a bit hacky, must be a better way to do this.
			triggerEl = e.currentTarget;
// Clear any passphrases on screen	
			final_transcript = '';
			final_span.innerHTML = '';
		};
// Run the function when either button is clicked
		setBtn.addEventListener('click',startButton);
		get.addEventListener('click', function (e) {
			getting = true;
			startButton(e);
		});
	}
});