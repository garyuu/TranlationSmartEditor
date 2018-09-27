const DATA_VERSION = 2

class DataTransformer {
  static parse(json) {
    let obj = JSON.parse(json.trim())
    switch (obj.ver) {
      case 1:
        try {
          return this.version1(obj);
        }
        catch(e) {
          throw e;
        }
        break;
      case 2:
        try {
          return this.version2(obj);
        }
        catch(e) {
          throw e;
        }
        break;
      default:
        try {
          return this.version0(obj)
        }
        catch(e) {
          throw e
        }
    }
  }

  static stringify(obj) {
    var result = {
        title: obj.title,
        groups: obj.groups,
        ver: DATA_VERSION,
    }
    return JSON.stringify(result)
  }

  static version0(obj) {
    let output = {title: obj.title, groups: []}
    for (let i in obj.list)
    {
      let group = new Group()
      group.frametime = obj.time
      for (let j in obj.list[i].list)
      {
        const old = obj.list[i].list[j]
        const typeData = TypeDataList[old.type].data
        group.contents.push(new Contents(
          old.type, old.isRender, old.title, this.getColorIndex(old.color), this.getSizeIndex(old.size),
          typeData.titleLabel, typeData.showTitle, typeData.showColor, typeData.showSize))
      }
      output.groups.push(group)
    }
    return output
  }

  static version1(obj) {
    for (let group of obj.groups) {
      for (let content of group.contents) {
        content.content = content.content || '';
        content.battleInfo = content.battleInfo || [[], []];
      }
    }
    return obj;
  }

  static version2(obj) {
    return obj;
  }

  static getColorIndex(color) {
    switch (color) {
      case '#FFFFFF':
        return 0
      case '#EC0404':
        return 1
      case '#FCFC14':
        return 2
      case '#00F904':
        return 3
      case '#06F7F3':
        return 4
      case '#E80CED':
        return 5
      default:
        return 0
    }
  }

  static getSizeIndex(size) {
    let index = 1
    let diff = Math.abs(size - 1)
    for (let i in SizeDataList)
    {
      let temp = Math.abs(size - SizeDataList[i].value)
      if (temp <= diff) {
        diff = temp
        index = i
      }
    }
    return index
  }
}
