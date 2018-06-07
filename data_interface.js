let __dataInterface

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

  static saveTime(frameTime){
    let index = this.findNearestGroupIndex(frameTime)
    if (this.instance.groups[index].frametime == frameTime)
      this.instance.groups.splice(index, 0, new Group(frameTime))
    const typeData = TypeDataList[0]
    this.instance.groups[index].contents.push(new Content(
        0, true, "", typeData.defaultColorIndex, 1, typeData.titleLabel,
        typeData.showTitle, typeData.showColor, typeData.showSize))
  }

  static findNearestGroupIndex(frameTime) {
    for (let i in this.instance.groups)
      if (this.instance.groups[i].frametime >= frameTime)
        return i
    return this.instance.groups.length
  }

  static importJSON(json) {
    try {
      obj = DataTransformer.parse(json)
      this.instance.data = obj
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
    this.instance.data = []
  }

  static jumpToTime(video, time) {
    video.currentTime = parseFloat(time)
  }

  static deleteContent(frameTime, contentId) {
    let index = findNearestGroupIndex(frameTime)
    let group = this.instance.groups[index]
    if (group.frametime == frameTime) {
      if (group.contents.length <= 1)
        this.instance.groups.splice(index, 1)
      else
        group.splice(contentId, 1)
    }
  }
}
