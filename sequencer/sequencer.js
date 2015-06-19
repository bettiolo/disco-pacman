var beatCount = 32;

function Sequencer(samples) {
  this._samples = samples;
  this._context = new window.AudioContext();
  this._gain = this._context.createGain();
  this._gain.connect(this._context.destination);
  this._tracks = [];
  this._beatIndex = 0;
}

Sequencer.prototype.init = function (onBeat) {
  this._onBeat = onBeat;
  for (var sampleIndex = 0; sampleIndex < this._samples.length; sampleIndex++) {
    this.addTrack(this._samples[sampleIndex]);
  }
};

Sequencer.prototype.getFile = function(url, cb) {
  var self = this;
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  request.onload = function () {
    console.log('Loaded', url);
    self.onLoadFile(this.response, cb)
  };
  request.send();
};

Sequencer.prototype.onLoadFile = function(response, cb) {
  this._context.decodeAudioData(response,
    cb,
    function () { throw new Error("Error decoding the file " + url); }
  );
};

Sequencer.prototype.addTrack = function (url) {
  var self = this;
  var trackIndex = this._tracks.length;
  var title = decodeURIComponent(url.split('/').slice(-1)[0]);
  title = title.substr(0, title.length - 4);
  var track = {
    title: title,
    beats: [],
    enabled: false
  };
  for (var beatIndex = 0; beatIndex < beatCount; beatIndex++) {
    track.beats.push({
      enabled: false
    });
  }
  this._tracks.push(track);
  this.getFile(url, function (audioData) {
    self._tracks[trackIndex].audioData = audioData;
  });
};

Sequencer.prototype.getRandomBeats = function () {
  var beatsEnabled = [];
  for (var beatIndex = 0; beatIndex < beatCount; beatIndex++) {
    beatsEnabled.push(Math.random() < 0.5);
  }
  return beatsEnabled;
};

Sequencer.prototype.setBeatsEnabled = function(trackIndex, beatsEnabled) {
  for (var beatIndex = 0; beatIndex < beatCount; beatIndex++) {
    this.changeBeatState(trackIndex, beatIndex, beatsEnabled[beatIndex]);
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
  }
  this._onBeat(this._beatIndex);
  for (var trackIndex = 0; trackIndex < this._samples.length; trackIndex++) {
    var track = this._tracks[trackIndex];
    var beat = track.beats[this._beatIndex];
    var hasAudioData = this._tracks[trackIndex].audioData;
    if (hasAudioData && track.enabled && beat.enabled) {
      var delayInSeconds = 0;
      var source = this._context.createBufferSource();
      source.buffer = this._tracks[trackIndex].audioData;
      source.connect(this._gain);
      source.start(this._context.currentTime + delayInSeconds);
    }
  }
  this.scheduleNextBeat();
  this._beatIndex++;
};

Sequencer.prototype.scheduleNextBeat = function() {
  if (this._bpm === 0) {
    console.log('bpm stop');
    clearInterval(this._interval);
    return;
  }
  if (!this._intervalMs || this._intervalMs != this._nextIntervalMs) {
    console.log('bpm change:', this._bpm);
    this._intervalMs = this._nextIntervalMs;
    clearInterval(this._interval);
    this._interval = setInterval(this.beat.bind(this), this._intervalMs);
  }

};

Sequencer.prototype.setBpm = function (bpm) {
  if (bpm == 0) {
    this._nextIntervalMs = 0;
    this._intervalMs = 0;
    this._bpm = bpm;
    return;
  }

  if (bpm < 80) {
    bpm = 80;
  }
  this._bpm = bpm;
  this._nextIntervalMs = (60 * 1000) / bpm;
};

Sequencer.prototype.changeTrackState = function(trackIndex, enabled) {
  this._tracks[trackIndex].enabled = enabled;
  console.log('enabled' + this._tracks[trackIndex].title);
};

Sequencer.prototype.changeBeatState = function(trackIndex, beatIndex, enabled) {
  this._tracks[trackIndex].beats[beatIndex].enabled = enabled;
};
