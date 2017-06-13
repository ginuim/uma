<template>
  <div class="wrapper">
    <router-link to="/">返回</router-link>
    <!-- 内容区 -->
    <div class="main" :style="mainStyle">
      <div :style="{ 'width': targetW + 'px' }" class="container">
        <img ref="image" :style="{ 'width': targetW + 'px' }" :src="bgImage" />
        <Layer
          v-on:selected="selected"
          v-on:hover="hover"
          v-for="(item, index) in elems"
          :index="index"
          :key="index"
          :data.sync="item"
          :current="currentItem"
          :ratio="ratio"
        >
        </Layer>
        <div v-if="isShowGuides" :style="{left: hoverItem.left * ratio + 'px'}" class="line line-left"></div>
        <div v-if="isShowGuides" :style="{left: (hoverItem.left + hoverItem.width) * ratio + 'px'}" class="line line-right"></div>
        <div v-if="isShowGuides" :style="{top: hoverItem.top * ratio + 'px'}" class="line line-top"></div>
        <div v-if="isShowGuides" :style="{top: (hoverItem.top + hoverItem.height) * ratio + 'px'}" class="line line-bottom"></div>

        <div v-if="isShowBorder" :style="{left: hoverItem.left * ratio + 'px', top: hoverItem.top * ratio + 'px', height: hoverItem.height * ratio + 'px', borderLeft: 'rgba(68, 192, 255, 1) solid 1px'}" class="line"></div>
        <div v-if="isShowBorder" :style="{left: (hoverItem.left + hoverItem.width) * ratio + 'px', top: hoverItem.top * ratio + 'px', height: hoverItem.height * ratio + 'px', borderLeft: 'rgba(68, 192, 255, 1) solid 1px'}" class="line line-right"></div>
        <div v-if="isShowBorder" :style="{left: hoverItem.left * ratio + 'px', top: hoverItem.top * ratio + 'px', height: '1px', width: hoverItem.width * ratio + 'px', borderTop: 'rgba(68, 192, 255, 1) solid 1px'}" class="line"></div>
        <div v-if="isShowBorder" :style="{left: hoverItem.left * ratio + 'px', top: (hoverItem.top + hoverItem.height) * ratio + 'px', height: '1px', width: hoverItem.width * ratio + 'px', borderTop: 'rgba(68, 192, 255, 1) solid 1px'}" class="line line-bottom"></div>
      </div>
    </div>
    <!-- 面板区 -->
    <div class="dashboard">
      <div v-if="currentItem.text" class="">
        <input type="text" name="" :value="currentItem.text.value">
        <div v-if="currentItem.text.font" class="">
          <p>字体名称： {{ currentItem.text.font.name }}</p>
          <p>字体大小： {{ currentItem.text.font.sizes[0] }}</p>
          <p>颜色：{{ currentItem.text.font.colors }}</p>
        </div>
      </div>
      <div class="">width: {{ currentItem.width }}</div>
      <div class="">height: {{ currentItem.height }}</div>
      <div class="">top: {{ currentItem.top }}</div>
      <div class="">left: {{ currentItem.left }}</div>
      <div class="">right: {{ currentItem.right }}</div>
      <div class="">bottom: {{ currentItem.bottom }}</div>
      <!-- {{ currentItem }} -->
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
      targetW: 400,
      originW: psd.document.width,
      elems: [],
      currentItem: {},
      hoverItem: {}
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
      console.log(this.$refs['image'])
      if (this.$refs['image']) {
        console.log(window.outerHeight)
        return {
          alignItems: this.$refs['image'].offsetHeight > window.outerHeight ? 'flex-start' : 'center'
        }
      } else {
        return {}
      }
    },
    ratio: function () {
      return (this.targetW / this.originW)
    },
    isShowGuides: function () {
      return (this.currentItem && (this.hoverItem !== this.currentItem))
    },
    isShowBorder: function () {
      return ((this.hoverItem !== this.currentItem))
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
      this.currentItem = data
    },

    hover: function (data) {
      this.hoverItem = data
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
      console.log(this.currentItem.color)
    },

    copyBgColor: function () {
      console.log(this.currentItem.color)
    },

    copyText: function () {
      clipboard.writeText(this.currentItem.text.value)
      console.log(this.currentItem.text.value)
    },

    copyFont: function () {
      console.log(this.currentItem.color)
    }
  }
}
</script>

<style>
.wrapper {
  height: 100%;
  display: flex;
  background-color: #F5F5F5;
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
.container img {
  box-shadow: 0 0 4px rgba(7,40,107,.2);
}
.dashboard {
  width: 10rem;
}
.line {
  box-sizing: border-box;
  position: absolute;
}
.line-left,
.line-right {
  width: 1px;
  height: 100%;
  top: 0;
  border-left: rgba(68, 192, 255, 0.2) solid 1px;
}
.line-top,
.line-bottom {
  width: 100%;
  height: 1px;
  left: 0;
  border-top: rgba(68, 192, 255, 0.2) solid 1px;
}
</style>
