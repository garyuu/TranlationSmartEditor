const ContentType = {
  MessageBox: 0,
  Comment: 1,
  Info: 2,
  Haigu: 3
};

const typeList = ["對話框", "註解/上海/空耳", "背景資訊", "俳句"];

const colors = [
  '#FFFFFF',
  '#EC0404',
  '#FCFC14',
  '#00F904',
  '#06F7F3',
  '#E80CED'
];
let colorListHtml = undefined;

class Content {
  constructor(id, data = undefined) {
    this.id = id;
    this.type = '';
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
      this.color = colors[0];
      this.size = 1.0;
    }
  }

  idList(){
    let result = '';
    result += `<select onchange="changeType('${this.id}', this)">`;
    const thisType = this.type;
    typeList.forEach(function(item, index, array){
      const selected = index == thisType ? ' selected="selected" ' : '';
      result += `<option value="${index}"${selected}>${item}</option>`;
    });
    result += `</select>`;
    return result;
  }

  toHTMLTitle(label = ''){
    return `${label}
            <input class="title" type="text" value="${this.title}"
                   onchange="contentChange('${this.id}', 'title', this)" />`;
  }

  toHTMLSize(label = ''){
    return `${label}
            <input class="size" type="number" step="0.05" value="${this.size}"
                   onchange="contentChange('${this.id}', 'size', this)" />`;
  }

  toHTML(title, color, size){
    let result = this.idList();
    result += `<button onclick="deleteContent('${this.id}')">刪除</button>`;
    result += '<br />';
    result += `<input name="isRender" type="checkbox"
                      ${this.isRender ? ' checked' : ''}
                      onchange="contentChange('${this.id}', 'isRender', this)" />`;
    result += title + color + size;
    result += `<br />
               <textarea onchange="contentChange('${this.id}', 'content', this)"
                         class="content">${this.content}</textarea>`;
    result += `<button onclick="copyContent(this.previousSibling)">複製</button>`
    return result;
  }

  toImage(){
    return null;
  }

  colorList(){
    const color = this.color;
    let result = `<select name="color" class="colorlist" style="background:${color}"
                          onchange="contentChange('${this.id}', 'color', this)">`;
    colors.forEach(function(item, index, array){
      let selected = item == color ? ' selected="selected" ' : '';
      result += `<option value="${item}" class="colorblock"
                         ${selected} style="background: ${item}"></option>`;
    });
    result += '</select>';
    colorListHtml = result;
    return result;
  }
}

class ContentMessageBox extends Content{
  constructor(id, data = undefined) {
    super(id, data);
    this.type = ContentType.MessageBox;
  }

  toHTML(){
    const title = this.toHTMLTitle('名字:');
    const color = this.colorList();
    const size = this.toHTMLSize('內容大小:');
    return super.toHTML(title, color, size);
  }
}

class ContentComment extends Content{
  constructor(id, data = undefined) {
    super(id, data);
    this.type = ContentType.Comment;
  }

  toHTML(){
    const color = this.colorList();
    const size = this.toHTMLSize('內容大小:');
    return super.toHTML('', color, size);
  }
}

class ContentInfo extends Content{
  constructor(id, data = undefined) {
    super(id, data);
    this.type = ContentType.Info;
  }

  toHTML(){
    const title = this.toHTMLTitle('標題:');
    const size = this.toHTMLSize('內容大小:');
    return super.toHTML(title, '', size);
  }
}

class ContentHaigu extends Content{
  constructor(id, data = undefined) {
    super(id, data);
    this.type = ContentType.Haigu;
  }

  toHTML(){
    return super.toHTML('', '', '');
  }
}

class SubtitleContentGroup {
  constructor(time, data = undefined) {
    this.list = [];
    if (data) {
      this.time = data.time;
      for (let i in data.list){
        this.addSubtitleContent(data.list[i].type, data.list[i]);
      }
    }
    else {
      this.time = time;
    }
  }

  addSubtitleContent(type = ContentType.MessageBox, data = undefined) {
    switch (type) {
      case ContentType.MessageBox:
        if (data)
          this.list.push(new ContentMessageBox(data.id, data));
        else
          this.list.push(new ContentMessageBox(`${this.time}#${this.list.length}`));
        break;
      case ContentType.Comment:
        if (data)
          this.list.push(new ContentComment(data.id, data));
        else
          this.list.push(new ContentComment(`${this.time}#${this.list.length}`));
        break;
      case ContentType.Info:
        if (data)
          this.list.push(new ContentInfo(data.id, data));
        else
          this.list.push(new ContentInfo(`${this.time}#${this.list.length}`));
        break;
      case ContentType.Haigu:
        if (data)
          this.list.push(new ContentHaigu(data.id, data));
        else
          this.list.push(new ContentHaigu(`${this.time}#${this.list.length}`));
        break;
      default:
        throw new Error("Content type error!");
    }
    this.type = type;;
  }

  toHTML(){
    let result = `<ul onclick="fastSeek(${this.time})">`;
    this.list.forEach(function(item, index, array){
      result += `<li>${item.toHTML()}</li>`;
    });
    result += '</ul>';
    return result;
  }

  getContentById(id){
    return this.list[id];
  }
}

class SubtitleList {
  constructor(data = undefined) {
    this.list = [];
    if (data) {
      this.title = data.title;
      for (let i in data.list){
        this.list.push(new SubtitleContentGroup(0, data.list[i]));
      }
    }
    else {
      this.title = '';
    }
  }

  addTimeStamp(time){
    let flag = false;
    for (let i = 0; i < this.list.length; i++) {
      if(this.list[i].time >= time - 1e-9 && this.list[i].time <= time + 1e-9) {
        this.list[i].addSubtitleContent();
        flag = true;
        break; // Why not just return?
      }
    }
    if(!flag) {
      const s = new SubtitleContentGroup(time);
      s.addSubtitleContent();
      this.list.push(s);
      this.sort();
    }
    console.log(this.list);
  }

  sorting_funtion(a, b) {
    return a.time > b.time;
  }

  sort(){
    this.list.sort(this.sorting_funtion);
  }

  toHTML(){
    let result = `<input id="title" type="text" value="${this.title}" onchange="SList.title=this.value;" />`;
    this.list.forEach(function(item, index, array){
      result += '<hr />' + item.toHTML();
    });
    return result;
  }


  save() {
    const timeList = document.getElementById('timeList');
    const contentGroupList = timeList.childNodes;
    let result = [];
    let listi = 0;
    for (let i = 0; i < contentGroupList.length; i++) { // ul
      console.log(`jizz ${i}`);
      if (contentGroupList[i].tagName == 'HR') {
        listi++;
        continue;
      }

      const contents = contentGroupList[i].childNodes;
      const buf = {
        time: this.list[listi].time,
        list: [],
      };
      result.push(buf);
      for (let j = 0; j < contents.length; j++) { // li
        console.log(`${i} ${j}`);
        const elements = contents[j].childNodes;
        /*
        this.list[listi].list[j].isRender = elements[0].checked;
        this.list[listi].list[j].title = elements[2].value;
        this.list[listi].list[j].color = elements[3].value;
        this.list[listi].list[j].size = elements[5].value;
        this.list[listi].list[j].content = elements[6].value;
        */
        const buf = Object.assign({}, this.list[listi].list[j]);
        result[result.length - 1]['list'].push(buf);
      }
    }
    let resString = escape(JSON.stringify(result));
    console.log(resString);
    document.cookie = `data=${resString}`;
    console.log('cookie: ' + document.cookie);
  }

  getContentGroupByTime(time){
    const doubleTime = parseFloat(time);
    for (let i = 0; i < this.list.length; i++)
      if(this.list[i].time >= doubleTime - 1e-9 && this.list[i].time <= doubleTime + 1e-9)
        return this.list[i];
  }

  getContentById(id){
    const idPair = id.split("#");
    return this.getContentGroupByTime(idPair[0]).getContentById(idPair[1]);
  }

  changeContentType(id, type){
    const idPair = id.split("#");
    const group = this.getContentGroupByTime(idPair[0]);
    const content = group.getContentById(idPair[1]);
    const newId = `${group.time}#${idPair[1]}`;
    switch (parseInt(type)) {
      case ContentType.MessageBox:
        group.list[idPair[1]] = new ContentMessageBox(newId, content);
        break;
      case ContentType.Comment:
        group.list[idPair[1]] = new ContentComment(newId, content);
        break;
      case ContentType.Info:
        group.list[idPair[1]] = new ContentInfo(newId, content);
        break;
      case ContentType.Haigu:
        group.list[idPair[1]] = new ContentHaigu(newId, content);
        break;
      default:
        throw new Error("Undefined type!");
    }
  }

  deleteContent(id){
    const idPair = id.split("#");
    const group = this.getContentGroupByTime(idPair[0]);
    group.list.splice(parseInt(idPair[1]), 1);
    group.list.forEach(function(item, index, array){
      const orgId = item.id.split("#");
      item.id = `${orgId[0]}#${index}`;
    });
  }
}
