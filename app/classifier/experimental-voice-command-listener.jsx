/*
Experimental Voice Command Listener
-----------------------------------

This is a hackday experiment that utilises HTML5's experimental new (as of Apr
2018) web speech API to receive voice commands from the user. Basically, instead
of using the mouse/keyboard to interact with the project, you can just shout out
"Spiral Galaxy!", "Giraffes!", "42!" to classify subjects. This will work well
and cannot possibly end badly, especially if you're shouting at your computer in
a public space.

This component will be tied to the TaskNav component, which handles user input
for workflow tasks. (Saying yes/no to a question, clicking survey task buttons,
etc.)

If anything goes wrong, blame Coleman, Darryl, Tim L, and Shaun.

Troubleshooting FAQ:
- If a user can't activate the voice command listener, try checking...
  - Is the user using a compatible web browser? (e.g. Chrome 64)
  - Is the user using a compatible device? (AFAIK the web speech API relies on
    the machine's native speech recognition system.)
  - Is the user in a crowded room? Noise or multiple voices can confuse the
    speech recognition system.
  - Has the user given microphone permissions to the app?

(@shaun.a.noordin 20180412)
 */

import PropTypes from 'prop-types';
import React from 'react';

const LISTEN_STATUS = {
  IDLE: 'idle',
  LISTENING: 'listening',
  FAILED: 'failed',
};

class ExperimentalVoiceCommandListener extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: LISTEN_STATUS.IDLE,
      statusMessage: '',
      text: '',
    };

    //Bind functions.
    //--------------------------------
    this.onListenStart = this.onListenStart.bind(this);
    this.onListenEnd = this.onListenEnd.bind(this);
    this.onListenResults = this.onListenResults.bind(this);
    this.onListenError = this.onListenError.bind(this);
    this.listenButton_onClick = this.listenButton_onClick.bind(this);
    this.onSetResults = this.onSetResults.bind(this);
    //--------------------------------

    //Speech Recognition
    //--------------------------------
    //First check: do we have Speech Recognition on this browser?
    //Chrome uses the webkit prefix, and Chrome 64is the only browser that I've
    //managed to successfully test with.
    this.speechRecognition = null;

    try {
      if ("webkitSpeechRecognition" in window) {  //Chrome
        this.speechRecognition = new window.webkitSpeechRecognition();
      } else if ("SpeechRecognition" in window) {  //Should be the future "standard"
        this.speechRecognition = new window.SpeechRecognition();
      }
    } catch (err) { console.error("SpeechRecognition error: ", err); }

    if (this.speechRecognition) {
      //Note that SpeechRecognition has to be triggered by a user event, e.g.
      //voiceButton.onClick = () => { this.speechRecognition.start() }
      //This will then prompt the user to provide mic permissions.

      this.speechRecognition.onstart = this.onListenStart;
      this.speechRecognition.onend = this.onListenEnd;
      this.speechRecognition.onresult = this.onListenResults;
      this.speechRecognition.onerror = this.onListenError;
    }
    //--------------------------------
  }

  //----------------------------------------------------------------

  render() {
    if (!this.speechRecognition) {
      return <div>No speech recognition, sorry.</div>;
    }


    return (
      <div>
        <div>Status: {this.state.status}</div>
        <div>Text: {this.state.text}</div>
        <button onClick={this.listenButton_onClick}>LISTEN</button>
      </div>
    );
  }

  //----------------------------------------------------------------

  listenButton_onClick() {
    if (!this.speechRecognition) return;

    if (this.state.status !== LISTEN_STATUS.LISTENING) {
      this.speechRecognition.start();
    } else {
      this.speechRecognition.stop();
    }
  }

  //----------------------------------------------------------------

  //onListenStart: update the HTML elements to indicate the current state.
  //Triggers on SpeechRecognition.start()
  onListenStart(e) {
    this.setState({
      status: LISTEN_STATUS.LISTENING,
      statusMessage: '',
      text: '',
    });
  }

  //onListenEnd: update the HTML elements to indicate the current state.
  //Triggers on SpeechRecognition.stop(), or when SpeechRecognition.onresult()
  //returns a result.
  onListenEnd(e) {
    this.setState({
      status: LISTEN_STATUS.IDLE,
    });
  }

  //onListenResults: process all recognised words.
  //Triggers when SpeechRecognition recognises a a series of words. (Usually
  //when it detects a pause, indicating the end of a sentence.) This will
  //trigger SpeechRecognition.onend() as well.
  onListenResults(e) {
    if (e && e.results) {
      let text = "";
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          for (let j = 0; j < e.results.length; j++) {
            text += e.results[i][j].transcript + ' ';
          }
        }
      }

      this.setState({
        text
      }, this.onSetResults);
    }
  }

  userSaid(s) {
    return this.state.text.indexOf(s) > -1;
  }

  onSetResults() {
    if (this.userSaid('next') && this.props.onNext) {
      this.props.onNext();
    } else if (this.userSaid('back') && this.props.onBack) {
      this.props.onBack();
    } else if (this.userSaid('done') && this.props.onDone) {
      this.props.onDone();
    }
  }

  onListenError(err) {
    this.setState({
      status: LISTEN_STATUS.ERROR,
      statusMessage: err,
    });
  }

  //----------------------------------------------------------------

}

export default ExperimentalVoiceCommandListener;
