// Load after window is loaded
let videoArea
let jsonArea
let editArea

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

  changeType(data){
    this.type = data[0]
    this.titleLabel = data[1].titleLabel
    this.showTitle = data[1].showTitle
    this.showColor = data[1].showColor
    this.showSize = data[1].showSize
    this.color = data[1].defaultColorIndex
  }

  changeColor(data){
    this.color = data[0]
  }

  changeSize(data){
    this.size = data[0]
  }
}

class Group {
  constructor(frametime) {
    this.frametime = frametime
    this.contents = []
  }
}

videoArea = new Vue({
  el: '#videoArea',
  data: {
    videoSource: '',
    saveButtonText: 'Save',
  },
  methods: {
    loadVideo: function(e){
      const file = e.target.files[0];
      const type = file.type;
      this.videoSource = URL.createObjectURL(file)
      try {
        this.$ref.video.load();
      }
      catch (err){
        console.log("Loading video error! " + err);
      }
    },
    clickVideo: function(e){
      if (this.$ref.video.paused) {
        this.$ref.video.play()
        this.$ref.video.setAttribute('controls')
      }
      else {
        this.$ref.video.pause()
        this.$ref.video.removeAttribute('controls')
      }
    },
    clickSave: function(e){
      DataInterface.saveTime(this.$ref.video.currentTime)
    },
  },
})

jsonArea = new Vue({
  el: '#jsonArea',
  data: {
    json: '',
    exportButtonText: 'Export',
    importButtonText: 'Import',
  },
  method: {
    exportJson: function(e){
      this.json = DataInterface.exportJSON()
      DataInterface.copy(this.$ref.json)
    },
    importJson: function(e){
      DataInterface.importJSON(this.json)
    },
  },
})

editArea = new Vue({
  el: '#editArea',
  data: {
    resetButtonText: 'ResetAll',
    title: '',
    groups: [],
  },
  methods: {
    resetAll: function(e) {
      DataInterface.resetEditor()
    },
    jumpToTime: function(time) {
      DataInterface.JumpToTime(videoArea.$ref.video, time)
    },
    delete: function(frameTime, contentId) {
      DataInterface.deleteContent(frametime, contentId)
    },
  },
})
