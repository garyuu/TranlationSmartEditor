let __dataInterface

class Content {
  constructor(type, isRender, title, color, size,
              titleLabel, showTitle, showColor, showSize, battle){
    this.type = type;
    this.isRender = isRender || true;
    this.title = title || '';
    this.color = color || 0;
    this.size = size || 1;
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
    this.TARGET = element
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
    const slideFunc = this.slideToContent
    setTimeout(function(){
      slideFunc(targetContent)
    }, 100)
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
}
