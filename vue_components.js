const TypeDataList = [
  {
    name: '對話框',
    data: {
      titleLabel: '名字',
      showTitle: true,
      showColor: true,
      showSize: true,
      defaultColorIndex: 5
    }
  },
  {
    name: '註解/上海/空耳',
    data: {
      titleLabel: '',
      showTitle: false,
      showColor: true,
      showSize: true,
      defaultColorIndex: 5
    }
  },
  {
    name: '背景資訊',
    data: {
      titleLabel: '標題',
      showTitle: true,
      showColor: false,
      showSize: true,
      defaultColorIndex: 0
    }
  },
  {
    name: '俳句',
    data: {
      titleLabel: '',
      showTitle: false,
      showColor: false,
      showSize: false,
      defaultColorIndex: 0
    }
  },
]

const ColorDataList = [
  {
    name: '白',
    class: 'colorBlockWhite'
  },
  {
    name: '紅',
    class: 'colorBlockRed'
  },
  {
    name: '黃',
    class: 'colorBlockYellow'
  },
  {
    name: '綠',
    class: 'colorBlockGreen'
  },
  {
    name: '藍',
    class: 'colorBlockBlue'
  },
  {
    name: '紫',
    class: 'colorBlockPurple'
  },
]

const SizeDataList = [
  {
    name: '小',
    value: 0.5
  },
  {
    name: '中',
    value: 1.0
  },
  {
    name: '大',
    value: 1.8
  },
  {
    name: '特',
    value: 2.2
  },
]

Vue.component('drop',{
  props: ['defaultindex', 'dataarray', 'onselectchange', 'frameclass', 'selectorclass', 'listclass'],
  data: function(){
    return {
      showList: false,
      index: this.defaultindex ? this.defaultindex : 0
    }
  },
  computed: {
    name: function(){
      return this.dataarray[this.index].name
    }
  },
  methods: {
    change: function(index){
      if (this.index != index)
      {
        this.index = index
        this.$emit('onselectchange', index)
      }
    },
    openList: function(){
      this.showList = true
    },
    closeList: function(){
      this.showList = false
    },
    onClick: function(){
      this.showList = !this.showList;
    },
    elementclass: function(index){
      if (this.dataarray[index].class){
        return this.dataarray[index].class
      }
      else {
        return ''
      }
    }
  },
  template:  `<div class="dropFrame" :class="frameclass">
                <span @click="onClick()" @blur="closeList()" class="dropSelector noselect" :class="selectorclass" tabindex="0">
                  {{ name }}
                </span>
                <div v-if="showList" class="dropList noselect" :class="listclass">
                  <div v-for="(data, index) in dataarray" @focus="change(index)" tabindex="0" :class="elementclass(index)">
                    {{ data.name }}
                  </div>
                </div>
              </div>
            `
})

Vue.component('type-list', {
  props: ['defaultindex', 'type-change'],
  computed: {
    typeList: function() {
      return TypeDataList
    }
  },
  methods: {
    changeType: function(index) {
      this.$emit('type-change', [index, this.typeList[index]])
    }
  },
  template: `<drop :defaultindex="defaultindex"
                   :dataarray="typeList"
                   @onselectchange="changeType($event)"
                   frameclass="typeFrame"
                   selectorclass="typeSelector"
                   listclass="typeList"
             ></drop>`
})

Vue.component('color-selector', {
  props: ['defaultindex', 'color-change'],
  data: function(){
    return {
      colorselector: 'colorSelector ' + ColorDataList[this.defaultindex].class
    }
  },
  watch: {
    defaultindex: function(val){
      this.changeColor(val)
    }
  },
  computed: {
    colorList: function() {
      return ColorDataList
    }
  },
  methods: {
    changeColor: function(index) {
      this.colorselector = 'colorSelector ' + this.colorList[index].class
      this.$emit('color-change', [index, this.colorList[index]])
    }
  },
  template: `<drop :defaultindex="defaultindex"
                   :dataarray="colorList"
                   @onselectchange="changeColor($event)"
                   frameclass="colorFrame"
                   :selectorclass="colorselector"
                   listclass="colorList"
             ></drop>`
})

Vue.component('size-selector', {
  props: ['defaultindex', 'size-change'],
  computed: {
    sizeList: function(){
      return SizeDataList
    }
  },
  methods: {
    changeSize: function(index){
      this.$emit('size-change', [index, this.sizeList[index]])
    }
  },
  template: `<drop :defaultindex="defaultindex"
                   :dataarray="sizeList"
                   @onselectchange="changeSize($event)"
                   frameclass="sizeFrame"
                   selectorclass="sizeSelector"
                   listclass="sizeList"
             ></drop>`
})
