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
    const element = document.createElement("SELECT");
    element.setAttribute("onchange", `changeType('${this.id}', this)`);
    const thisType = this.type;
    typeList.forEach(function(item, index, array){
      const e = document.createElement("OPTION");
      e.setAttribute("value", `index`);
      if (index == thisType)
        e.setAttribute("selected", `selected`);
      e.appendChild(document.createTextNode(`${item}`));
      element.appendChild(e);
    });
    return element;
    /*
    let result = '';
    result += `<select onchange="changeType('${this.id}', this)">`;
    const thisType = this.type;
    typeList.forEach(function(item, index, array){
      const selected = index == thisType ? ' selected="selected" ' : '';
      result += `<option value="${index}"${selected}>${item}</option>`;
    });
    result += `</select>`;
    return result;
    */
  }

  toHTMLTitle(label = ''){
    const element = document.createElement("DIV");
    element.style.display = "inline";
    element.appendChild(document.createTextNode(label));
    const input = document.createElement("INPUT");
    input.setAttribute("class", `title`);
    input.setAttribute("type", `text`);
    input.setAttribute("value", `${this.title}`);
    input.setAttribute("onchange", `contentChange('${this.id}', 'title', this)`);
    element.appendChild(input);
    return element;
    /*
    return `${label}
            <input class="title" type="text" value="${this.title}"
                   onchange="contentChange('${this.id}', 'title', this)" />`;
    */
  }

  toHTMLSize(label = ''){
    const element = document.createElement("DIV");
    element.style.display = "inline";
    element.appendChild(document.createTextNode(label));
    const input = document.createElement("INPUT");
    input.setAttribute("class", `size`);
    input.setAttribute("type", `number`);
    input.setAttribute("step", `0.05`);
    input.setAttribute("value", `${this.size}`);
    input.setAttribute("onchange", `contentChange('${this.id}', 'size', this)`);
    element.appendChild(input);
    return element;
    /*
    return `${label}
            <input class="size" type="number" step="0.05" value="${this.size}"
                   onchange="contentChange('${this.id}', 'size', this)" />`;
    */
  }

  toHTML(title, color, size){
    console.log("Content");
    const element = document.createElement("LI");
    element.appendChild(this.idList());

    console.log("Line1");
    const delBtn = document.createElement("BUTTON");
    delBtn.setAttribute("onclick", `deleteContent('${this.id}')`);
    delBtn.appendChild(document.createTextNode("刪除"));
    element.appendChild(delBtn);
    element.appendChild(document.createElement("BR"));

    console.log("Line2");
    const isRdr = document.createElement("INPUT");
    isRdr.setAttribute("name", `isRender`);
    isRdr.setAttribute("type", `checkbox`);
    isRdr.setAttribute("onchange", `contentChange('${this.id}', 'isRender', this)`);
    isRdr.checked = this.isRender;
    element.appendChild(isRdr);
    if (!(title === undefined))
      element.appendChild(title);
    if (!(color === undefined))
      element.appendChild(color);
    if (!(size === undefined))
      element.appendChild(size);
    element.appendChild(document.createElement("BR"));

    console.log("Line3");
    const txt = document.createElement("TEXTAREA");
    txt.setAttribute("class", `content`);
    txt.setAttribute("onchange", `contentChange('${this.id}', 'content', this`);
    txt.appendChild(document.createTextNode(this.content));
    element.appendChild(txt);

    console.log("Final");
    const cpyBtn = document.createElement("BUTTON");
    cpyBtn.setAttribute("onclick", `copyContent(this.previousSibling)`);
    cpyBtn.appendChild(document.createTextNode("複製"));
    element.appendChild(cpyBtn);

    return element;
    /*
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
    */
  }

  toImage(){
    return null;
  }

  colorList(){
    const color = this.color;
    const element = document.createElement("SELECT");
    element.setAttribute("name", `color`);
    element.setAttribute("class", `colorlist`);
    element.style.backgroundColor = color;
    colors.forEach(function(item, index, array){
      const e = document.createElement("OPTION");
      e.setAttribute("class", `colorblock`);
      e.setAttribute("value", `${item}`);
      e.style.backgroundColor = item;
      if (item == color)
        e.setAttribute("selected", "selected");
      e.appendChild(document.createTextNode(item));
      element.add(e);
    })
    colorListHtml = element;
    return element;
    /*
    const color = this.color;
    let result = `<select name="color" class="colorlist" style="background:${color}"
                          onchange="contentChange('${this.id}', 'color', this)">`;
    colors.forEach(function(item, index, array){
      let selected = item == color ? ' selected="selected" ' : '';
      result += `<option value="${item}" class="colorblock"
                         ${selected} style="background: ${item}">${item}</option>`;
    });
    result += '</select>';
    colorListHtml = result;
    return result;
    */
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
    return super.toHTML(undefined, color, size);
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
    return super.toHTML(title, undefined, size);
  }
}

class ContentHaigu extends Content{
  constructor(id, data = undefined) {
    super(id, data);
    this.type = ContentType.Haigu;
  }

  toHTML(){
    return super.toHTML(undefined, undefined, undefined);
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
    console.log("SubtitleContentGroup");
    const element = document.createElement("LI");
    const group = document.createElement("UL");
    group.setAttribute("onclick", `fastSeek(${this.time})`);
    this.list.forEach(function(item, index, array){
      group.appendChild(item.toHTML());
    });
    element.appendChild(group);
    return element;
    /*
    let result = `<ul onclick="fastSeek(${this.time})">`;
    this.list.forEach(function(item, index, array){
      result += `<li>${item.toHTML()}</li>`;
    });
    result += '</ul>';
    return result;
    */
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
    let insertIndex = 0;
    for (let i = 0; i < this.list.length; i++) {
      if(this.list[i].time >= time - 1e-9 && this.list[i].time <= time + 1e-9) {
        this.list[i].addSubtitleContent();
        flag = true;
        break;
      }
      else if(this.list[i].time < time){
        insertIndex = i;
      }
      else {
        break;
      }
    }
    if(!flag) {
      const s = new SubtitleContentGroup(time);
      s.addSubtitleContent();
      this.list.splice(insertIndex, 0, s);
      //this.sort();
    }
    console.log(this.list);
  }

  findInsertIndex(time){
  }

  sorting_funtion(a, b) {
    return a.time > b.time;
  }

  sort(){
    this.list.sort(this.sorting_funtion);
  }

  toHTML(){
    console.log("SubtitleList");
    const element = document.createElement("DIV");
    const title = document.createElement("INPUT");
    title.setAttribute("id", `title`);
    title.setAttribute("type", `text`);
    title.setAttribute("value", `${this.title}`);
    title.setAttribute("onchange", `SList.title=this.value`);
    element.appendChild(title);
    const ul = document.createElement("UL");
    ul.setAttribute("id", `timeList`);
    for (let i = 0; i < this.list.length; i++){
      if (this.list[i].list.length > 0) {
        ul.appendChild(document.createElement("HR"));
        ul.appendChild(this.list[i].toHTML());
      } else {
        this.list.splice(i, 1);
        i--;
      }
    }
    element.appendChild(ul);
    return element;
    /*
    let result = `<input id="title" type="text" value="${this.title}" onchange="SList.title=this.value;" />`;
    for (let i = 0; i < this.list.length; i++){
      if (this.list[i].list.length > 0)
        result += '<hr />' + this.list[i].toHTML();
      else {
        this.list.splice(i, 1);
        i--;
      }
    }
    return result;
    */
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

  cleanEmptyGroups(){
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].list.length == 0) {
        this.list.splice(i, 1);
        i--;
      }
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
    this.cleanEmptyGroups();
  }
}
