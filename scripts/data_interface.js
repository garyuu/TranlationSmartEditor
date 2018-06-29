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
    if (this.instance.groups.length <= index || this.instance.groups[index].frametime != frameTime)
    {
      this.instance.groups.splice(index, 0, new Group(frameTime))
      this.insertItemFromLocalStorage(index)
    }
    const typeData = TypeDataList[0].data
    const cIndex = this.instance.groups[index].contents.length
    this.instance.groups[index].contents.push(new Content(
        0, true, "", typeData.defaultColorIndex, 1, typeData.titleLabel,
        typeData.showTitle, typeData.showColor, typeData.showSize))
    this.saveGroupToLocalStorage(index)
    const targetContent = '#' + index + '-' + cIndex;
    setTimeout(function(){
      $('html,body').animate({scrollTop: $(targetContent).offset().top}, 500)
      $(targetContent).focus()
    }, 100)
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
    let content = this.instance.groups[groupId].contents[contentId]
    const data = TypeDataList[index].data
    content.type = index
    content.titleLabel = data.titleLabel
    content.showTitle = data.showTitle
    content.showColor = data.showColor
    content.showSize = data.showSize
    content.color = data.defaultColorIndex
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
}
