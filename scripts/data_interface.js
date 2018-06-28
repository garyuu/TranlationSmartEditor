let __dataInterface

class Content {
  constructor(type, isRender, title, color, size,
              titleLabel, showTitle, showColor, showSize){
    this.type = type
    this.isRender = isRender
    this.title = title
    this.color = color
    this.size = size
    this.titleLabel = titleLabel
    this.showTitle = showTitle
    this.showColor = showColor
    this.showSize = showSize
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
    if (this.instance.groups.length == 0 || this.instance.groups[index].frametime == frameTime)
    {
      this.insertItemFromLocalStorage(index)
      this.instance.groups.splice(index, 0, new Group(frameTime))
    }
    const typeData = TypeDataList[0].data
    this.instance.groups[index].contents.push(new Content(
        0, true, "", typeData.defaultColorIndex, 1, typeData.titleLabel,
        typeData.showTitle, typeData.showColor, typeData.showSize))
    this.saveGroupToLocalStorage(index)
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
    }
    catch (e) {
      console.log("JSON parse error! " + e)
    }
  }

  static exportJSON() {
    return DataTransformer.stringify(this.instance.data)
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

  static changeContentType(groupId, contentId, data) {
    let content = this.instance.groups[groupId].contents[contentId]
    content.type = data[0]
    content.titleLabel = data[1].titleLabel
    content.showTitle = data[1].showTitle
    content.showColor = data[1].showColor
    content.showSize = data[1].showSize
    content.color = data[1].defaultColorIndex
  }

  static changeContentColor(groupId, contentId, data) {
    let content = this.instance.groups[groupId].contents[contentId]
    content.color = data[0]
  }

  static changeContentSize(groupId, contentId, data) {
    let content = this.instance.groups[groupId].contents[contentId]
    content.size = data[0]
  }

  static jumpToTime(video, time) {
    video.currentTime = parseFloat(time)
  }

  static deleteContent(groupId, contentId) {
    let group = this.instance.groups[groupId]
    if (group.contents.length <= 1)
    {
      this.instance.groups.splice(groupId, 1)
      this.removeItemFromLocalStorage(groupId)
    }
    else
    {
      group.splice(contentId, 1)
      this.saveGroupToLocalStorage(groupId)
    }
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
        let group = new Group(obj.frametime)
        group.contents = obj.contents.map(function(val, index){
          let content = new Content(val.type, val.isRender, val.title, val.color, val.size,
                                    val.titleLabel, val.showTitle, val.showColor, val.showSize)
        })
        this.instance.groups.push(group)
      }
    }
  }

  static removeItemFromLocalStorage(index) {
    for (let i = index; i < this.instance.groups.length; i++)
      localStorage[i.toString()] = localStorage[(i+1).toString()]
    localStorage['groupSize'] = this.instance.groups.length
  }

  static insertItemFromLocalStorage(index) {
    for (let i = this.instance.groups.length - 1; i > index; i--)
      localStorage[i.toString()] = localStorage[(i-1).toString()]
    localStorage['groupSize'] = this.instance.groups.length
  }
}
