const ContentType = {
  MessageBox: 0,
  Comment: 1,
  Info: 2,
  Haigu: 3
};

const Colors = ['#FFFFFF', '#EC0404', '#FCFC14', '#00F904', '#06F7F3', '#E80CED'];
let


class Content {
  constructor(data = undefined) {
    if (data) {
      this.isRender = data.isRender;
      this.title = data.title;
      this.content = data.content;
      this.color = data.color;
      this.size = data.size;
    }
    else {
      this.isRender = true;
      this.title = "";
      this.content = "";
      this.color = Color.White;
      this.size = 1.0;
    }
  }

  toHTML(title, color, size){
    let result = '';
    result += '<input name="isRender" type="checkbox" />';
    result += title + color + size;
    result += '<textarea class="content"></textarea>';
    return result;
  }

  toImage(){
    return null;
  }

  colorList(){
    let result = '<select name="color">';
    Color
    for (let prop in Color){
      if (Color.hasOwnProperty){
        result += '<option>';
        result += '<div class="ColorBlock" style="background: ' + prop.value + ';"></div>';
        result += '</option>';
      }
    }
  }
}

class ContentMessageBox extends Content{

  toHTML(){
    const title = '名字:<input type="text" name="title" />';
    const color = '';
    const size = '內容大小:<input type="number" name="size" step="0.05" />'
  }
}

class ContentComment extends Content{

}

class ContentInfo extends Content{

}

class ContentHaigu extends Content{

}

class SubtitleContentGroup {
  constructor(time, type = ContentType.MessageBox) {
    this.time = time;
    this.list = [];
    addSubtitleContent(type);
  }

  addSubtitleContent(type) {
    switch (this.type) {
      case ContentType.MessageBox:
        this.list.push(new ContentMessageBox());
        break;
      case ContentType.Comment:
        this.list.push(new ContentComment());
        break;
      case ContentType.Info:
        this.list.push(new ContentInfo());
        break;
      case ContentType.Haigu:
        this.list.push(new ContentHaigu());
        break;
      default:
        throw new Error("Content type error!");
    }
  }
}

class SubtitleList {
  constructor() {
    this.list = [];
  }

  addTimeStamp(time){
    let flag = false;
    for (let i = 0; i < this.list.length; i++) {
      if(this.list[i].time > time - 1e-9 && this.list[i].time < time + 1e-9) {
        this.list[i].addSubtitleContent(ContentType.MessageBox);
        flag = true;
        break;
      }
    }
    if(!flag) {
      s = new SubtitleContentGroup(time);
      this.list.push(s);
      sort();
    }
  }

  sort(){
    sorting_funtion = function(a, b){
      return a.time < b.time;
    };
    this.list.sort(sorting_funtion);
  }

}

module.exports = SubtitleList;
