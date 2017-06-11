<template>
  <div
    v-if="data.visible"
    :class="['layer-abs', current && current.name === data.name ? 'layer-current' : '']"
    @click="selected"
    :style="style">
    <div class="dot dot-tl"></div>
    <div class="dot dot-tr"></div>
    <div class="dot dot-bl"></div>
    <div class="dot dot-br"></div>
  </div>
</template>

<script>
export default {
  name: 'Layer',
  props: ['data', 'ratio', 'current'],
  data: function () {
    return {
    }
  },
  created: function () {
    // console.log(this.data)
  },
  computed: {
    style: function () {
      return {
        top: (this.data.top * this.ratio) + 'px',
        left: (this.data.left * this.ratio) + 'px',
        width: this.data.width * this.ratio + 'px',
        height: this.data.height * this.ratio + 'px'
      }
    }
  },
  components: {
    // Layer
  },
  methods: {
    selected: function () {
      this.$emit('selected', this.data)
    }
  }
}
</script>

<style>
.layer-abs {
  font-size: 10px;
  position: absolute;
  box-sizing: border-box;
}
.layer-abs .dot {
  width: 3px;
  height: 3px;
  display: none;
  background: #FFF;
  margin: -3px;
  border: #44D7B6 solid 1px;
  border-radius: 50%;
}
.layer-abs .dot-tl {
  position: absolute;
  top: 0;
  left: 0;
}
.layer-abs .dot-tr {
  position: absolute;
  top: 0;
  right: 0;
}
.layer-abs .dot-bl {
  position: absolute;
  bottom: 0;
  left: 0;
}
.layer-abs .dot-br {
  position: absolute;
  bottom: 0;
  right: 0;
}
.layer-abs:hover {
  border: #44D7B6 solid 1px;
}
.layer-abs:hover .dot {
  display: block;
}
.layer-current,
.layer-current:hover,
.layer-current .dot {
  border: #F60 solid 1px;
}
.layer-current .dot {
  display: block;
}
</style>
