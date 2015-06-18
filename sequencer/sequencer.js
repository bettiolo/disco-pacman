var beatCount = 32;

function Sequencer(samples) {
  this._samples = samples;
  this._context = new window.AudioContext();
  this._gain = this._context.createGain();
  this._gain.connect(this._context.destination);
  this._tracks = [];
  this._beatIndex = 0;
}

Sequencer.prototype.start = function (onBeat) {
  this._onBeat = onBeat;
  for (var sampleIndex = 0; sampleIndex < this._samples.length; sampleIndex++) {
    this.addTrack(this._samples[sampleIndex]);
  }
  this.randomizeBeats();
};

Sequencer.prototype.addTrack = function (url) {
  var track = { beats: [] };
  for (var beatIndex = 0; beatIndex < beatCount; beatIndex++) {
    var audio = new Audio();
    // audio.crossOrigin = "anonymous";
    audio.src = url;
    var source = this._context.createMediaElementSource(audio);
    source.connect(this._gain);

    track.beats.push({
      audio: audio,
      source: source
    });
  }
  this._tracks.push(track);
};

Sequencer.prototype.getRandomBeats = function () {
  var beatsEnabled = [];
  for (var beatIndex = 0; beatIndex < beatCount; beatIndex++) {
    beatsEnabled.push(Math.random() < 0.5);
  }
  return beatsEnabled;
};

Sequencer.prototype.setBeatsEnabled = function(trackIndex, beatsEnabled) {
  var track = this._tracks[trackIndex];
  for (var beatIndex = 0; beatIndex < beatCount; beatIndex++) {
    track.beats[beatIndex].enabled = beatsEnabled[beatIndex];
  }
};

Sequencer.prototype.randomizeBeats = function () {
  for (var trackIndex = 0; trackIndex < this._samples.length; trackIndex++) {
    this.setBeatsEnabled(trackIndex, this.getRandomBeats());
  }
};

Sequencer.prototype.beat = function () {
  if (this._beatIndex == beatCount) {
    this._beatIndex = 0;
    this.randomizeBeats();
  }
  console.log('beat', this._beatIndex);
  this._onBeat(this._beatIndex);

  for (var trackIndex = 0; trackIndex < this._samples.length; trackIndex++) {
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
    console.log('bpm', bpm);
    this._intervalMs = newInterval;
    clearInterval(this._interval);
    this._interval = setInterval(this.beat.bind(this), this._intervalMs);
  }
};

Sequencer.prototype.getTrackTitle = function(trackIndex) {
  return decodeURIComponent(this._tracks[trackIndex].beats[0].audio.src.split('/').slice(-1)[0]);
};

