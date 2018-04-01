document.addEventListener('touchstart', startTouch, false);
document.addEventListener('mousedown', startTouch, false);

document.addEventListener('keypress', (e) => {
  const keyName = e.key;
  if (keyName == 's') {
    saveFrameTime();
  }
});

function saveFrameTime(){
  const video = document.getElementById('video');
  console.log(video.currentTime);
}

function startTouch(){
  const video = document.getElementById('video');
  console.log(video.currentTime);
}
