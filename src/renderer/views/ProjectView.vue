<template>
  <div class="wrapper">
    <!-- 内容区 -->
    <div class="main" :style="mainStyle">
      <div :style="{ 'width': targetW + 'px' }" class="container">
        <img ref="image" :style="{ 'width': targetW + 'px' }" :src="bgImage" />
        <Layer
          v-on:selected="selected"
          v-for="(item, index) in elems"
          :key="index"
          :data.sync="item"
          :current="current"
          :ratio="(targetW / originW)"
        >
        </Layer>
      </div>
    </div>
    <!-- 面板区 -->
    <div class="dashboard">
      <div v-if="current.text" class="">
        <input type="text" name="" :value="current.text.value">
        <div v-if="current.text.font" class="">
          <p>字体名称： {{ current.text.font.name }}</p>
          <p>字体大小： {{ current.text.font.sizes[0] }}</p>
          <p>颜色：{{ current.text.font.colors }}</p>
        </div>
      </div>
      <div class="">width: {{ current.width }}</div>
      <div class="">height: {{ current.height }}</div>
      <div class="">top: {{ current.top }}</div>
      <div class="">left: {{ current.left }}</div>
      <div class="">right: {{ current.right }}</div>
      <div class="">bottom: {{ current.bottom }}</div>
      <!-- {{ current }} -->
    </div>
  </div>
</template>

<script>
import psd from '../assets/data/audio.json'
import Layer from '@/components/Layer'
const fs = require('fs')
const Mousetrap = require('mousetrap')
const { clipboard } = require('electron')

export default {
  name: 'project',
  data () {
    return {
      data: psd,
      bgImage: 'static/img/audio.png',
      targetW: 300,
      originW: psd.document.width,
      elems: [],
      current: {}
    }
  },
  components: {
    Layer
  },
  created: function () {
    this.index = 0
    this.parseData(this.data.children)
  },
  mounted: function () {
    this.$el.addEventListener('dragover', this.dragIgnore)
    this.$el.addEventListener('dragleave', this.dragIgnore)
    this.$el.addEventListener('dragend', this.dragIgnore)
    this.$el.addEventListener('drop', this.dropHandler)
    Mousetrap.bind('command+shift+c', this.copyColor)
    Mousetrap.bind('command+shift+b', this.copyBgColor)
    Mousetrap.bind('command+shift+t', this.copyText)
    Mousetrap.bind('command+shift+f', this.copyFont)
  },
  computed: {
    mainStyle: function () {
      if (this.$refs['image']) {
        console.log(window.outerHeight)
        return {
          alignItems: this.$refs['image'].offsetHeight > window.outerHeight ? 'flex-start' : 'center'
        }
      } else {
        return {}
      }
    }
  },
  methods: {

    // 解析数据
    parseData: function (child) {
      for (var i = child.length - 1; i >= 0; i--) {
        this.elems.push(child[i])
        if (child[i].children) {
          this.parseData(child[i].children)
        }
      }
    },

    // 当前元素
    selected: function (data) {
      this.current = data
    },

    // 禁止 drag 事件默认行为
    dragIgnore: function (e) {
      e.preventDefault()
      return false
    },

    // 拖文件进来时
    dropHandler: function (ev) {
      let bgPath = ev.dataTransfer.files[0].path
      let dataPath = bgPath.replace(/\.[\w]+$/, '.json')
      ev.preventDefault()
      try {
        fs.readFile(bgPath, (err, data) => {
          if (err) throw err
          this.bgImage = 'data:image/png;base64,' + Buffer.from(data, 'binary').toString('base64')
        })

        fs.readFile(dataPath, 'utf8', (err, data) => {
          if (err) throw err
          this.elems = []
          this.data = JSON.parse(data)
          this.parseData(this.data.children)
          console.log(this.elems.length)
        })
      } catch (err) {
        throw err
      }
    },

    // 拖文件进来时
    fileDropHandler: function (e) {
      e = e || window.event
      e.preventDefault()
      this.file = e.dataTransfer.files[0]
      alert(JSON.stringify(this.file))
      // if (!this.file.type.match(/image\/.*/i)) {
      //   var self = this
      //   this.errorTips = '不支持的文件格式'
      //   setTimeout(function () {
      //     self.errorTips = ''
      //   }, 2000)
      // }
      // this.fileReader.readAsDataURL(this.file)
      return false
    },

    copyColor: function () {
      console.log(this.current.color)
    },

    copyBgColor: function () {
      console.log(this.current.color)
    },

    copyText: function () {
      clipboard.writeText(this.current.text.value)
      console.log(this.current.text.value)
    },

    copyFont: function () {
      console.log(this.current.color)
    }
  }
}
</script>

<style>
.wrapper {
  height: 100%;
  display: flex;
  background-color: #EEE;
  flex-direction: row;
  align-items: center;
}
.main {
  display: flex;
  height: 100%;
  flex-grow: 1;
  justify-content: center;
  /*align-items: center;*/
  /*margin: 0 auto;*/
  overflow: auto;
}
.container {
  position: relative;
}
.dashboard {
  width: 10rem;
}
</style>
