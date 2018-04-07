let URL;
let video; // Get the video for future usage
let jsondisplay;
let timelist;
let SList;

window.addEventListener('load', function(){
  document.getElementById("savebutton").addEventListener('touchstart', startTouch, false);
  document.getElementById("savebutton").addEventListener('mousedown', startTouch, false);
  video = document.getElementById('video');
  jsondisplay = document.getElementById('jsondisplay');
  timelist = document.getElementById('timeList');
  URL = window.URL || window.webkitURL;
  console.log(window.localStorage['json']);
  //showCookies();
  try {
    jsondisplay.value = window.localStorage['json'];
    importJSON(jsondisplay);
  }
  catch (e) {
    throw new Error("Load JSON failed! " + e);
    SList = new SubtitleList();
  }
}, false);
/*
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
*/
function saveFrameTime(){
  const timeList = document.getElementById('timeList');
  console.log(video.currentTime);

  SList.addTimeStamp(video.currentTime);
  drawHTML();
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
  timelist.innerHTML = SList.toHTML();
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
  saveSerializedData();
}

function copyContent(element){
  try {
    element.select();
  }
  catch {
    let range = document.getSelection().getRangeAt(0);
    range.selectNode(element);
    window.getSelection().addRange(range);
  }
  document.execCommand('copy');
}

function deleteContent(id){
  SList.deleteContent(id);
  drawHTML();
}

function toJSON() {
  return JSON.stringify(SList);
}

function loadVideo(element) {
  const file = element.files[0];
  const type = file.type;
  let canPlay = video.canPlayType(type);
  if (canPlay === '') canPlay = 'no';
  const isError = canPlay === 'no';
  if (isError) {
    return
  }
  const fileURL = URL.createObjectURL(file)
  video.setAttribute("src", fileURL);
  try {
    video.load();
  }
  catch (e){
    console.log("Loading video error! " + e);
  }
}

function importJSON(element){
  let obj;
  try {
    obj = JSON.parse(element.value);
    console.log(obj);
    SList = new SubtitleList(obj);
    drawHTML();
  }
  catch (e) {
    throw new Error("JSON Format incorrect! " + e);
  }
}

function drawHTML(){
  timelist.innerHTML = SList.toHTML();
  saveSerializedData();
}

function saveSerializedData() {
  jsondisplay.value = toJSON();
  const json = jsondisplay.value;
  const expire = new Date(Date.now().getDate + 365 * 3);
  window.localStorage['json'] = json;
  //document.cookie = "json="+json+"; expire="+expire+"; path=/";
  //showCookies();
  console.log(window.localStorage['json']);
}

function showCookies() {
  const cookies = getCookieArray();
  for (let i = 0; i <= cookies.length; i++)
    console.log(i + ": " + cookies[i]);
}

function getCookieArray() {
  return document.cookie.split(';');
}

function findCookieByKey(key) {
  const cookies = getCookieArray();
  const cookieKey = key + "=";
  for (let i in cookies) {
    const k = cookies[i].trim();
    if (k.indexOf(cookieKey) == 0)
      return k.substring(cookieKey.length, k.length);
  }
  return undefined;
}
