let __dataInterface

class DataInterface
{
  static get instance()
  {
    return __dataInterface
  }

  static set instance(value)
  {
    __dataInterface = value
  }

  static isCreated()
  {
    return !(this.instance === undefined)
  }

  static create(editElement){}

  static saveTime(frameTime){}

  static importJSON(obj){}

  static exportJSON(){}

  static copy(element){}

  static resetEditor(){}

  static jumpToTime(){}

  static deleteContent(frameTime, contentId){}
}
