window.addEventListener('load', function () {
  var sequencerUi = new SequencerUi();
  sequencerUi.init();
});

function SequencerUi() {
  var allSamples = [
    'Clubhouse Kick 01.wav',
    'Clubhouse Kick 02.wav',
    'Clubhouse Kick 03.wav',
    'Clubhouse Kick 04.wav',
    'Clubhouse Kick 05.wav',
    'Clubhouse Kick 06.wav',
    'Clubhouse Kick 07.wav',
    'Clubhouse Kick 08.wav',
    'Clubhouse Kick 09.wav',
    'Clubhouse Kick 10.wav',
    'Clubhouse Kick 11.wav',
    'Clubhouse Kick 12.wav',
    'Clubhouse Kick 13.wav',
    'Clubhouse Kick 14.wav',
    'Clubhouse Kick 15.wav',
    'Clubhouse Kick 16.wav',
    'LS-MH1 Clap 22.wav',
    'LS-MH1 Clap 75.wav',
    'LS-MH1 Clap 91.wav',
    'LS-MH1 Crash 15.wav',
    'LS-MH1 Definite Pitch 44.wav',
    'LS-MH1 Drum Beat 20-2 no kick.wav',
    'LS-MH1 Drum Beat 20-2.wav',
    'LS-MH1 Electronic Sound 119.wav',
    'LS-MH1 Electronic Sound 153.wav',
    'LS-MH1 Laser Sweep 10.wav',
    'LS-MH1 Melodic loop 128 Bpm 01-loop 1.wav',
    'LS-MH1 Metal 39.wav',
    'LS-MH1 Minimal & Tech House Loop 126 Bpm 19-2.wav',
    'LS-MH1 Minimal & Tech House Loop 126 Bpm 20-2.wav',
    'LS-MH1 Minimal High Sound 39.wav',
    'LS-MH1 Minimal Hihat 26.wav',
    'LS-MH1 Noise Drumsound 21.wav',
    'LS-MH1 Noise Drumsound 38.wav',
    'LS-MH1 Rattle Sound 54.wav',
    'LS-MH1 Reverse 49.wav',
    'LS-MH1 Shakers & Maracas 25.wav',
    'LS-MH1 Special Hihat 46.wav',
    'LS-MH1 Special Sound 19-3 (126 bpm).wav',
    'LS-MH1 Special Sound 19-5 (126 bpm).wav',
    'LS-MH1 Subbase 34.wav',
    'LS-MH1 Tone 05.wav',
    'LS-TCD1 Bounce Kick 01.wav',
    'LS-TCD1 Bounce Kick 18.wav',
    'LS-TCD1 Clubby HH Closed 027.wav',
    'LS-TCD1 Clubby HH Closed 059.wav',
    'LS-TCD1 Clubby HH Open 020.wav',
    'LS-TCD1 Clubby HH Open 059.wav',
    'LS-TCD1 Clubby Kick 06.wav',
    'LS-TCD1 Clubby Kick 81.wav',
    'LS-TCD1 Clubby Kick 87.wav',
    'LS-TCD1 Clubby Kick 88.wav',
    'LS-TCD1 Clubby Long Clap 41.wav',
    'LS-TCD1 Clubby Long Clap 76.wav',
    'LS-TCD1 Clubby Ride 50.wav',
    'LS-TCD1 Clubby Short Clap 105.wav',
    'LS-TCD1 Clubby Short Clap 39.wav',
    'LS-TCD1 Clubby Snare 008.wav',
    'LS-TCD1 Clubby Snare 053.wav',
    'LS-TCD1 Distorted Filtered Kick 05.wav',
    'LS-TCD1 Distorted Filtered Kick 30.wav',
    'LS-TCD1 Distorted Filtered Kick 39.wav',
    'LS-TCD1 Distorted Kick 89.wav',
    'LS-TCD1 Hard HH Closed 08.wav',
    'LS-TCD1 Hard Short Clap 20.wav',
    'LS-TCD1 High HH Closed 22.wav',
    'LS-TCD1 High Ride 06.wav',
    'LS-TCD1 Noise Clap 08.wav',
    'LS-TCD1 Resonance Clap 16.wav',
    'LS-TCD1 Short Crash 01.wav',
    'LS-TCD1 Special 32.wav',
    'LS-TCD1 Special 39.wav',
    'LS-TCD1 Special 44.wav',
    'LS-TCD1 Special 80.wav',
    'LS-TCD1 Special HH Closed 08.wav',
    'LS-TCD1 Special HH Open 13.wav',
    'LS-TCD1 Special HH Open 31.wav',
    'LS-TCD1 Special HH Open 51.wav',
    'LS-TCD1 Special Snare 18.wav',
    'LS-TCD1 Special Snare 23.wav',
    'LS-TCD1 Tech-house Kick 41.wav',
    'LS-TCD1 Warm Kick 10.wav',
    'LS-TCD1 Warm Kick 15.wav'
  ];
  allSamples.sort( function() { return 0.5 - Math.random() } ); // randomize
  var samples = allSamples.slice(1, getRandomInt(10, 15)).map(function (sample) {
    return 'samples/' + sample;
  });

  this._sequencer = new Sequencer(samples);
  this._bpmInput = document.getElementById('bpm');
  this._bpmInput.addEventListener('input', function () {
    this._sequencer.setBpm(this._bpmInput.value);
  }.bind(this));
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

SequencerUi.prototype.init = function () {
  var defaultBpm = 130;
  this._bpmInput.value = defaultBpm;
  this._sequencer.setBpm(defaultBpm);
  this._sequencer.init(this.onBeat.bind(this));
  this._sequencer.scheduleNextBeat();
};

SequencerUi.prototype.generateTable = function () {
  var sequencerTable = document.getElementById('sequencerTable');
  sequencerTable.innerHTML = '';
  var alternateTrack = true;
  for (var trackIndex = 0; trackIndex < this._sequencer._tracks.length; trackIndex++) {
    var track = this._sequencer._tracks[trackIndex];
    var tr = document.createElement('tr');
    tr.classList.add('track-' + trackIndex);
    if (alternateTrack) {
      tr.classList.add('regular-track')
    } else {
      tr.classList.add('alternate-track')
    }
    alternateTrack = !alternateTrack;
    var beatGroupIndex = 0;
    var alternateBeatGroup = false;

    var infoTd = document.createElement('td');
    var trackCheckbox = document.createElement('input');
    trackCheckbox.setAttribute('type', 'checkbox');
    trackCheckbox.id = 'track-enabled-' + trackIndex;
    trackCheckbox.checked = track.enabled;
    trackCheckbox.setAttribute('data-track', trackIndex);
    trackCheckbox.addEventListener('change', function (e) {
      console.log(e.target.getAttribute('data-track'), e.target.checked);
      this._sequencer.changeTrackState(e.target.getAttribute('data-track'), e.target.checked);
    }.bind(this), false);
    var trackCheckboxLabel = document.createElement('label');
    trackCheckboxLabel.setAttribute('for', trackCheckbox.id);
    trackCheckboxLabel.innerHTML = track.title;
    infoTd.appendChild(trackCheckbox);
    infoTd.appendChild(trackCheckboxLabel);
    infoTd.classList.add('track-info');
    tr.appendChild(infoTd);

    for (var beatIndex = 0; beatIndex < beatCount; beatIndex++) {
      var beat = track.beats[beatIndex];

      var td = document.createElement('td');
      if (beat.enabled) {
        td.innerText = 'X';
      }
      if (beatGroupIndex % 4 == 0) {
        alternateBeatGroup = !alternateBeatGroup;
      }
      td.classList.add('beat');
      td.classList.add('beat-' + beatIndex);
      if (alternateBeatGroup) {
        td.classList.add('regular-beat-group')
      } else {
        td.classList.add('alternate-beat-group')
      }
      tr.appendChild(td);
      beatGroupIndex++;
    }
    sequencerTable.appendChild(tr);
  }
};

SequencerUi.prototype.higlightBeat = function (beatIndex) {
  var beatElements = this.toArray(document.getElementsByClassName('beat'));
  beatElements.forEach(function (beatElement) {
    beatElement.classList.remove('beat-highlight');
    if (beatElement.classList.contains('beat-' + beatIndex)) {
      beatElement.classList.add('beat-highlight');
    }
  }.bind(this));
};

SequencerUi.prototype.toArray = function (obj) {
  var array = [];
  // iterate backwards ensuring that length is an UInt32
  for (var i = obj.length >>> 0; i--;) {
    array[i] = obj[i];
  }
  return array;
};

SequencerUi.prototype.onBeat = function (beatIndex) {
  if (beatIndex == 0) {
    this.generateTable();
  }
  this.higlightBeat(beatIndex);
};
