import SList from 'subtitle';

let video; // Get the video for future usage

window.addEventListener('load', function(){
  document.getElementById("testButton").addEventListener('touchstart', startTouch, false);
  document.getElementById("testButton").addEventListener('mousedown', startTouch, false);
  video = document.getElementById('video');
}, false);

document.addEventListener('keypress', (e) => {
  const keyName = e.key;
  if (keyName == 's') {
    saveFrameTime();
  }
});

function saveFrameTime(){
  const timeList = document.getElementById('timeList');
  console.log(video.currentTime);

  SList.addTimeStamp();
  timeList.innerHTML += '<li onclick="fastSeek(' + video.currentTime + ')" id="' + video.currentTime + '">' + video.currentTime + '</li>';

}

function startTouch(){
  console.log(video.currentTime);
}

function fastSeek(){
  const value = document.getElementById("seekTimeValue").value;
  console.log(value);
  video.currentTime = value;
}

function fastSeek(time){
  video.currentTime = time;
}
