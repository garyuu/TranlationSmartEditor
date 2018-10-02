let __dataInterface

class Content {
  constructor(type, isRender, title, color, size,
              titleLabel, showTitle, showColor, showSize, battle){
    this.type = type;
    this.isRender = isRender !== undefined ? isRender : true;
    this.title = title || '';
    this.color = color || 0;
    this.size = size !== undefined ? size : 1;
    this.titleLabel = titleLabel || '';
    this.showTitle = showTitle || false;
    this.showColor = showColor || false;
    this.showSize = showSize || false;
    this.battle = battle || false;
    this.content = '';
    this.battleInfo = [[], []];
  }
}

class Group {
  constructor(frametime) {
    this.frametime = frametime
    this.contents = []
  }
}

class DataInterface {
  constructor(element) {
    this.TARGET = element;
    this.focusTextArea = null;
  }

  get title() {
    return this.TARGET.title
  }

  set title(value) {
    this.TARGET.title = value
  }

  get groups() {
    return this.TARGET.groups
  }

  set groups(value) {
    this.TARGET.groups = value
  }

  get data() {
    return this.TARGET.$data
  }

  static get instance() {
    return __dataInterface
  }

  static set instance(value) {
    __dataInterface = value
  }

  static isCreated() {
    return !(this.instance === undefined)
  }

  static create(editElement) {
    this.instance = new DataInterface(editElement)
  }

  static recordTime(frameTime){
    let index = this.findNearestGroupIndex(frameTime)
    if (this.instance.groups.length <= index || this.instance.groups[index].frametime != frameTime)
    {
      this.instance.groups.splice(index, 0, new Group(frameTime))
      this.insertItemFromLocalStorage(index)
    }
    const typeData = TypeDataList[0].data
    const cIndex = this.instance.groups[index].contents.length
    this.instance.groups[index].contents.push(new Content(
        0, true, "", typeData.defaultColorIndex, typeData.defaultSizeIndex, typeData.titleLabel,
        typeData.showTitle, typeData.showColor, typeData.showSize, typeData.battle))
    this.saveGroupToLocalStorage(index)
    const targetContent = '#' + index + '-' + cIndex;
    setTimeout(function(){
      this.slideToContent(targetContent)
    }, 100).bind(this)
  }

  static jumpToIndex(index) {
    this.slideToContent('#' + index + '-0');
  }

  static jumpToLast() {
    const pair = this.findLastContent();
    if (pair != null)
      this.slideToContent('#' + pair[0] + '-' + pair[1]);
  }

  static slideToContent(targetContent){
    $('html,body').animate({scrollTop: $(targetContent).offset().top - 100}, 500)
    $(targetContent).focus()
  }

  static findNearestGroupIndex(frameTime) {
    for (let i in this.instance.groups)
      if (this.instance.groups[i].frametime >= frameTime)
        return i
    return this.instance.groups.length
  }

  static importJSON(json) {
    try {
      let obj = DataTransformer.parse(json)
      this.instance.title = obj.title
      this.instance.groups = obj.groups
      this.refreshLocalStorage()
    }
    catch (e) {
      console.log("JSON parse error! " + e)
    }
  }

  static exportJSON() {
    return DataTransformer.stringify(this.instance.data)
  }

  static JSONFileName() {
    return this.instance.title + ".json"
  }

  static exportJSONFileURL() {
    return window.URL.createObjectURL(new Blob([this.exportJSON()], {type: 'application/json'}))
  }

  static copy(element) {
    try {
      element.select()
    }
    catch {
      let range = document.getSelection().getRangeAt(0)
      range.selectNode(element)
      window.getSelection().addRange(range)
    }
    document.execCommand('copy')
  }

  static duplicateTitle(groupId, contentId) {
    let sourceContent;
    if (contentId != 0) {
      sourceContent = this.instance.groups[groupId].contents[contentId - 1];
    }
    else {
      if (groupId == 0)
        return;
      const contents = this.instance.groups[groupId - 1].contents;
      sourceContent = contents[contents.length - 1];
    }
    const targetContent = this.instance.groups[groupId].contents[contentId];
    if (targetContent.showTitle) {
        targetContent.title = sourceContent.title;
        if (targetContent.showColor) {
          targetContent.color = sourceContent.color;
        }
    }
  }

  static resetEditor() {
    this.instance.title = ''
    this.instance.groups = []
    localStorage.clear()
    localStorage['title'] = ''
    localStorage['groupSize'] = 0
  }

  static changeContentType(groupId, contentId, index) {
    let content = this.instance.groups[groupId].contents[contentId];
    const data = TypeDataList[index].data;
    content.titleLabel = data.titleLabel || '';
    content.showTitle = data.showTitle || false;
    content.showColor = data.showColor || false;
    content.showSize = data.showSize || false;
    content.battle = data.battle || false;
    content.color = data.defaultColorIndex || 0;
    content.size = data.defaultSizeIndex !== undefined ? data.defaultSizeIndex : 1;
    content.content = content.content || '';
    content.battleInfo = content.battleInfo || [[],[]];
    content.type = index;
  }

  static changeContentColor(groupId, contentId, index) {
    let content = this.instance.groups[groupId].contents[contentId]
    content.color = index
  }

  static changeContentSize(groupId, contentId, index) {
    let content = this.instance.groups[groupId].contents[contentId]
    content.size = index
  }

  static jumpToTime(video, time) {
    video.currentTime = parseFloat(time)
  }

  static deleteContent(groupId, contentId) {
    let group = this.instance.groups[groupId]
    const cIndex = '#' + groupId + '-' + contentId
    const element = $(cIndex)
    const obj = this
    const onDeleteAnimationDone = function(){
      console.log("DOWN");
      if (group.contents.length <= 1)
      {
        obj.instance.groups.splice(groupId, 1)
        obj.removeItemFromLocalStorage(groupId)
      }
      else
      {
        group.contents.splice(contentId, 1)
        obj.saveGroupToLocalStorage(groupId)
      }
      if (element != null)
        element.animate({opacity: 1}, 0)
    }
    element.animate(
      {
        opacity: 0
      }, {
        duration: 500,
        complete: onDeleteAnimationDone
      }
    )
  }

  static saveTitleToLocalStorage() {
    localStorage['title'] = this.instance.title
  }

  static saveGroupToLocalStorage(index) {
    localStorage[index.toString()] = JSON.stringify(this.instance.groups[index])
  }

  static loadDataFromLocalStorage() {
    if (localStorage['title'] !== undefined){
      this.instance.title = localStorage['title']
      this.instance.groups = []
      const size = parseInt(localStorage['groupSize'])
      for (let i = 0; i < size; i++) {
        const obj = JSON.parse(localStorage[i.toString()])
        /*
        let group = obj;
        group.contents = obj.contents.map(function(val, index){
          if (val === null)
            return null
          return new Content(val.type, val.isRender, val.title, val.color, val.size,
                             val.titleLabel, val.showTitle, val.showColor, val.showSize)
        })
        */
        this.instance.groups.push(obj)
      }
    }
  }

  static findLastContent() {
    for (let i = this.instance.groups.length - 1; i >= 0; i--) {
      for (let j = this.instance.groups[i].contents.length - 1; j >= 0; j--) {
        let content = this.instance.groups[i].contents[j]
        if (content.content != '' || content.battleInfo[0].length != 0 || content.battleInfo[1].length != 0) {
          return [i, j];
        }
      }
    }
    return null;
  }

  static refreshLocalStorage() {
    localStorage['title'] = this.instance.title
    let i;
    for (i = 0; i < this.instance.groups.length; i++)
      this.saveGroupToLocalStorage(i)
    const size = localStorage['groupSize']
    for (i; i < size; i++)
      localStorage.removeItem(i.toString())
    localStorage['groupSize'] = this.instance.groups.length
  }

  static removeItemFromLocalStorage(index) {
    let i;
    for (i = index; i < this.instance.groups.length; i++)
      localStorage[i.toString()] = localStorage[(i+1).toString()]
    const size = localStorage['groupSize']
    for (i; i < size; i++)
      localStorage.removeItem(i.toString())
    localStorage['groupSize'] = this.instance.groups.length
  }

  static insertItemFromLocalStorage(index) {
    for (let i = this.instance.groups.length - 1; i > index; i--)
      localStorage[i.toString()] = localStorage[(i-1).toString()]
    localStorage['groupSize'] = this.instance.groups.length
  }

  static focusCurrentContent(time) {
    let index = this.findNearestGroupIndex(time)
    if (index > 0) index--
    if (document.activeElement.id.split('-')[0] != index) {
      const targetContent = $('#' + index + '-0')
      this.slideToContent(targetContent)
    }
  }

  static encodeFormData(data) {
    if (!data) return "";    // Always return a string
    var pairs = [];          // To hold name=value pairs
    for (var name in data) {                                  // For each name
      if (!data.hasOwnProperty(name)) continue;            // Skip inherited
      if (typeof data[name] === "function") continue;      // Skip methods
      var value = data[name].toString();                   // Value as string
      name = encodeURIComponent(name.replace(" ", "+"));   // Encode name
      value = encodeURIComponent(value.replace(" ", "+")); // Encode value
      pairs.push(name + "=" + value);   // Remember name=value pair
    }
    return pairs.join('&'); // Return joined pairs separated with &
  }

  static sendHttpRequest(data) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "storage.php");
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
      xhr.onload = function (){
        if (200 <= xhr.status && xhr.status <= 299) {
          resolve(xhr.responseText);
        }
        else {
          reject("SendHttpRequest" + xhr.statusText);
        }
      };
      xhr.onerror = function (){
        reject("SendHttpRequest" + xhr.statusText);
      };
      xhr.send(DataInterface.encodeFormData(data));
    });
  }

  static loadFromStorage() {
    let data = {
      password: $('#password')[0].value,
      title: this.instance.title
    };
    return this.sendHttpRequest(data)
      .then((resp) => {
        let obj = '';
        try {
          obj = JSON.parse(resp);
        }
        catch (e) {
          throw ("LoadFromStorage: " + e + '\n' + resp);
          return false;
        }
        finally {
          if (obj.status) {
            DataInterface.importJSON(obj.message);
            console.log("JSONi loaded!");
            return true;
          }
          else {
            throw ("LoadFromStorage: " + obj.message);
            return false;
          }
        }
      })
      .catch((e) => {
        console.error(e);
        return false;
      });
  }

  static saveToStorage() {
    let data = {
      password: $('#password')[0].value,
      title: this.instance.title,
      content: this.exportJSON()
    };
    return this.sendHttpRequest(data)
      .then((resp) => {
        let obj = '';
        try {
          obj = JSON.parse(resp);
        }
        catch (e) {
          throw ("SaveToStorage: " + e + '\n' + resp);
          return false;
        }
        finally {
          if (obj.status) {
            console.log("JSON saved!");
            return true;
          }
          else {
            throw ("SaveToStorage: " + obj.message);
            return false;
          }
        }
      })
      .catch((e) => {
        console.error(e);
        return false;
      });
  }

  static fastPaste(text) {
    text = text || '';
    const element = this.instance.focusTextArea;
    if (element == null)
        return null;
    if (element.selectionStart || element.selectionStart == '0') {
        const startPos = element.selectionStart;
        const endPos = element.selectionEnd;
        element.value = element.value.substring(0, startPos) +
                        text +
                        element.value.substring(endPos, element.value.length);
        element.selectionStart = startPos + text.length;
        element.selectionEnd = element.selectionStart;
    }
    else {
        element.value += text;
    }
    return element;
  }

  static focusText(element) {
    this.instance.focusTextArea = element;
  }

  static blurText(element) {
    /*
    if (this.instance.focusTextArea === element)
        this.instance.focusTextArea = null;
    */
  }

  static savePasteStr(ary) {
    localStorage['paste'] = JSON.stringify(ary);
  }

  static loadPasteAry() {
    const str = localStorage['paste'];
    if (str !== undefined && str != null && str != '')
      return JSON.parse(str);
    else
      return null;
  }
}
