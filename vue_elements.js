// Load after window is loaded
let videoArea
let jsonArea
let editArea

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
    title: '',
    groups: [],
  },
  computed: {
    resetButtonText: function(){
      return 'ResetAll'
    }
  }
  methods: {
    resetAll: function(e) {
      DataInterface.resetEditor()
    },
    jumpToTime: function(time) {
      DataInterface.jumpToTime(videoArea.$ref.video, time)
    },
    delete: function(frameTime, contentId) {
      DataInterface.deleteContent(frametime, contentId)
    },
  },
  watch: {
    title: function(value) {
      DataInterface.saveToLocalStorage()
    }
    groups: function(value) {
      DataInterface.saveToLocalStorage()
    }
  }
})
