const TypeDataList = [
  {
    name: "對話框",
    data: {
      titleLabel: "名字",
      showTitle: true,
      showColor: true,
      showSize: true
    }
  },
  {
    name: "註解/上海/空耳",
    data: {
      titleLabel: "",
      showTitle: false,
      showColor: true,
      showSize: true
    }
  },
  {
    name: "背景資訊",
    data: {
      titleLabel: "標題",
      showTitle: true,
      showColor: false,
      showSize: true
    }
  },
  {
    name: "俳句",
    data: {
      titleLabel: "",
      showTitle: false,
      showColor: false,
      showSize: false
    }
  }
]

Vue.component('type-list', {
  props: ["type-change"],
  data: function(){
    return {
      showList: false,
      typeIndex: 0
    }
  },
  computed: function(){
    return {
      typeName: function(){
        return TypeDataList[this.typeIndex].name;
      }
      typeList: function(){
        return TypeDataList;
      }
    }
  },
  methods: function(){
    return {
      changeType: function(index){
        this.typeIndex = index
        this.$emit("type-change", TypeDataList[index].data)
        showList = false
      }
    }
  },
  template: `<div @focus="showList = true" @blur="showList = false" :class="class">
               {{ typeName }}
               <ul v-if="showList">
                 <li v-for="(type, index) in typeList" @click="changeType(index)">
                   {{ type.name }}
                 </li>
               </ul>
             </div>
            `
})

Vue.component('color-selector', {
  props: ["color-change"],
})

Vue.component('size-selector', {
  props: ["size-change"],
})
