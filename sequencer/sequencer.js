var beatCount = 32;
var trackCount = 6;

function Sequencer() {
  this._context = new window.AudioContext();
  this._gain = this._context.createGain();
  this._gain.connect(this._context.destination);
  this._tracks = [];
  this._beatIndex = 0;
}

Sequencer.prototype.start = function () {
  this.addTrack('samples/Clubhouse Kick 01.wav', this.getRandomBeats());
  this.addTrack('samples/LS-TCD1 Clubby Snare 008.wav', this.getRandomBeats());
  this.addTrack('samples/LS-TCD1 Resonance Clap 16.wav', this.getRandomBeats());
  this.addTrack('samples/LS-TCD1 Short Crash 01.wav', this.getRandomBeats());
  this.addTrack('samples/LS-MH1 Laser Sweep 10.wav', this.getRandomBeats());
  this.addTrack('samples/LS-MH1 Subbase 34.wav', this.getRandomBeats());
  this.generateTable();
};

Sequencer.prototype.getRandomBeats = function () {
  var beatsEnabled = [];
  for (var beatIndex = 0; beatIndex < beatCount; beatIndex++) {
    beatsEnabled.push(Math.random() < 0.5);
  }
  return beatsEnabled;
};

Sequencer.prototype.addTrack = function (url, beatsEnabled) {
  var track = { beats: [] };
  for (var beatIndex = 0; beatIndex < beatCount; beatIndex++) {
    var audio = new Audio();
    // audio.crossOrigin = "anonymous";
    audio.src = url;
    var source = this._context.createMediaElementSource(audio);
    source.connect(this._gain);

    track.beats.push({
      audio: audio,
      source: source,
      enabled: beatsEnabled[beatIndex]
    });
  }
  this._tracks.push(track);
};

Sequencer.prototype.beat = function () {
  if (this._beatIndex == beatCount) {
    this._beatIndex = 0;
  }
  console.log('beat', this._beatIndex);

  var beatElements = toArray(document.getElementsByClassName('beat'));
  beatElements.forEach(function (beatElement) {
    beatElement.classList.remove('beat-highlight');
    if (beatElement.classList.contains('beat-' + this._beatIndex)) {
      beatElement.classList.add('beat-highlight');
    }
  }.bind(this));

  for (var trackIndex = 0; trackIndex < trackCount; trackIndex++) {
    var beat = this._tracks[trackIndex].beats[this._beatIndex];
    if (beat.enabled) {
      beat.audio.play();
      console.log(this.getTrackTitle(trackIndex));
    }
  }
  this._beatIndex++;
};

Sequencer.prototype.setBpm = function (bpm) {
  var newInterval = (60 * 1000) / bpm;
  if (this._interval != newInterval) {
    this._intervalMs = newInterval;
    clearInterval(this._interval);
    this._interval = setInterval(this.beat.bind(this), this._intervalMs);
  }
};

Sequencer.prototype.generateTable = function() {
  var sequencerTable = document.getElementById('sequencerTable');
  var alternateTrack = true;
  for (var trackIndex = 0; trackIndex < trackCount; trackIndex++ ){
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
    infoTd.innerText = this.getTrackTitle(trackIndex);
    infoTd.classList.add('track-info');
    tr.appendChild(infoTd);

    for (var beatIndex = 0; beatIndex < beatCount; beatIndex++) {
      var beat = this._tracks[trackIndex].beats[beatIndex];

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

Sequencer.prototype.getTrackTitle = function(trackIndex) {
  return decodeURIComponent(this._tracks[trackIndex].beats[0].audio.src.split('/').slice(-1)[0]);
};

window.addEventListener('load', function () {
  var bpmInput = document.getElementById('bpm');
  var defaultBpm = 130;
  bpmInput.value = defaultBpm;

  var sequencer = new Sequencer();
  bpmInput.addEventListener('input', function () {
    sequencer.setBpm(bpmInput.value);
  });

  sequencer.setBpm(defaultBpm);

  sequencer.start();
});

function toArray(obj) {
  var array = [];
  // iterate backwards ensuring that length is an UInt32
  for (var i = obj.length >>> 0; i--;) {
    array[i] = obj[i];
  }
  return array;
}
