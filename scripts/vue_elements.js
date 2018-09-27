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
    resetButtonText: 'ResetAll',
    loadButtonText: 'LOAD',
    saveButtonText: 'SEND',
    spinnerSrc: this.imageSpinner,
    spinnerWidth: '24',
    spinnerHeight: '24',
    showSpinner: false,
    imageSpinner: 'images/spinner.gif',
    imageSuccess: 'images/Success.png',
    imageFailed: 'images/Failed.png',
  },
  computed: {
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
      sizeIndex = sizeIndex !== undefined ? sizeIndex : 1;
      return SizeDataList[sizeIndex].class
    },
    colorClass: function(colorIndex) {
      colorIndex = colorIndex || 0;
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
    },
    duplicateTitle: function(groupId, contentId) {
      DataInterface.duplicateTitle(groupId, contentId);
      this.groupChange(groupId);
    },
    loadStorage: function() {
      this.showSpinner = true;
      DataInterface.loadFromStorage()
          .then(((status) => {
            this.spinnerSrc = status ? this.imageSuccess : this.imageFailed;
            setTimeout(() => {
                this.showSpinner = false;
                this.spinnerSrc = this.imageSpinner;
            }, 2000);
          }).bind(this));
    },
    saveStorage: function() {
      this.showSpinner = true;
      DataInterface.saveToStorage()
          .then(((status) => {
            this.spinnerSrc = status ? this.imageSuccess : this.imageFailed;
            setTimeout(() => {
                this.showSpinner = false;
                this.spinnerSrc = this.imageSpinner;
            }, 2000);
          }).bind(this));
    },
  },
})
