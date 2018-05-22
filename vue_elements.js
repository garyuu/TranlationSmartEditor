// Load after window is loaded

var videoArea = new Vue({
  el: '#videoArea',
  data: {
    videoController: '',
    saveButtonText: 'Save',
  },
  methods: {
    loadVideo: function(e){

    },
    clickVideo: function(e){

    },
    clickSave: function(e){

    },
  },
})

var jsonArea = new Vue({
  el: '#jsonArea',
  data: {
    json: '',
    exportButtonText: "Export",
    importButtonText: "Import",
  },
  method: {
    exportJson: function(e){

    },
    importJson: function(e){

    },
  },
})
