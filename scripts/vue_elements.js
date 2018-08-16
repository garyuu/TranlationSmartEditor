// Load after window is loaded
let videoArea
let jsonArea
let editArea

videoArea = new Vue({
  el: '#videoArea',
  data: {
    videoSource: null,
    recordButtonText: 'Record',
  },
  methods: {
    loadVideo: function(){
      const file = this.$refs.fileinput.files[0];
      const type = file.type;
      this.videoSource = URL.createObjectURL(file)
      try {
        this.$refs.video.load();
      }
      catch (err){
          console.log("Loading video error! " + err);
      }
    },
    clickVideo: function(){
      /*
      if (this.$refs.video.paused) {
        this.$refs.video.play()
        this.$refs.video.setAttribute('controls', 'controls')
      }
      else {
        this.$refs.video.pause()
        this.$refs.video.removeAttribute('controls')
      }
      */
    },
    clickRecord: function(){
      DataInterface.recordTime(this.$refs.video.currentTime)
    },
    onTimeUpdate: function(){
      if (!this.$refs.video.paused)
        DataInterface.focusCurrentContent(this.$refs.video.currentTime)
    },
  },
})

jsonArea = new Vue({
  el: '#jsonArea',
  data: {
    exportButtonText: 'Export',
    importButtonText: 'Import',
  },
  methods: {
    exportJSON: function(){
      this.$refs.json.value = DataInterface.exportJSON()
      DataInterface.copy(this.$refs.json)
    },
    importJSON: function(){
      DataInterface.importJSON(this.$refs.json.value)
    },
    exportJSONFile: function(){
      this.$refs.export.download = DataInterface.JSONFileName()
      this.$refs.export.href = DataInterface.exportJSONFileURL()
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
  },
  methods: {
    resetAll: function() {
      DataInterface.resetEditor()
    },
    jumpToTime: function(time) {
      DataInterface.jumpToTime(videoArea.$refs.video, time)
    },
    deleteContent: function(groupId, contentId) {
      DataInterface.deleteContent(groupId, contentId)
    },
    sizeClass: function(sizeIndex) {
      return SizeDataList[sizeIndex].class
    },
    colorClass: function(colorIndex) {
      return ColorDataList[colorIndex].class
    },
    titleChange: function(){
      DataInterface.saveTitleToLocalStorage()
    },
    groupChange: function(index) {
      DataInterface.saveGroupToLocalStorage(index)
    },
    changeType: function(groupId, contentId, index) {
      DataInterface.changeContentType(groupId, contentId, index)
      this.groupChange(groupId)
    },
    changeColor: function(groupId, contentId, index) {
      DataInterface.changeContentColor(groupId, contentId, index)
      this.groupChange(groupId)
    },
    changeSize: function(groupId, contentId, index) {
      DataInterface.changeContentSize(groupId, contentId, index)
      this.groupChange(groupId)
    },
    copyContent: function(groupId, contentId) {
      DataInterface.copy($('#' + groupId + '-' + contentId + " textarea"))
    }
  },
})
