let video; // Get the video for future usage
let SList = new SubtitleList();

window.addEventListener('load', function(){
  document.getElementById("testButton").addEventListener('touchstart', startTouch, false);
  document.getElementById("testButton").addEventListener('mousedown', startTouch, false);
  video = document.getElementById('video');
}, false);

document.addEventListener('keypress', (e) => {
  const keyName = e.key;
  if (keyName == 's') {
    saveFrameTime();
  } else if (keyName == 'd') {
    if(video.paused) {
      video.play();
    } else {
      video.pause();
    }
  } else if (keyName =='f') {
    SList.save();
  }
});

function saveFrameTime(){
  const timeList = document.getElementById('timeList');
  console.log(video.currentTime);

  SList.addTimeStamp(video.currentTime);
  //timeList.innerHTML += `<li onclick="fastSeek(${video.currentTime})">${video.currentTime}</li>`;
  timeList.innerHTML = SList.toHTML();
}

function startTouch(){
  console.log(video.currentTime);
  saveFrameTime();
}

function fastSeek(){
  const value = document.getElementById("seekTimeValue").value;
  console.log(value);
  video.currentTime = value;
}

function fastSeek(time){
  video.currentTime = parseFloat(time);
}

function colorChange(element){
  const color = element.options[element.selectedIndex].value;
  element.style = `background: ${color}`;
}

function changeType(id, element){
  const type = element.options[element.selectedIndex].value;
  SList.changeContentType(id, type);
  document.getElementById('timeList').innerHTML = SList.toHTML();
}

function contentChange(id, attr, element){
  const object = SList.getContentById(id);
  switch (attr) {
    case 'isRender':
      object.isRender = element.checked;
      break;
    case 'title':
      object.title = element.value;
      break;
    case 'color':
      const color = element.options[element.selectedIndex].value;
      element.style = `background: ${color}`;
      object.color = color;
      break;
    case 'size':
      object.size = element.value;
      break;
    case 'content':
      object.content = element.value;
      break;
    default:
      throw new Error('Undefined attribute!');
  }
}

function copyContent(element){
  element.previousSibling.select();
  document.execCommand('copy');
}

function deleteContent(id){
  SList.deleteContent(id);
  document.getElementById('timeList').innerHTML = SList.toHTML();
}
