<template>
  <div class="border-wrapper">
    <div class="border-content">
      <div class="slot-content">
        <slot name="content">
        </slot>
      </div>
       <div class="slot-introduce" v-show="isSpread">
          <div class="text">
            <slot name="introduce"></slot>
          </div>
      </div>
      <div class="slot-code" v-show="isSpread">
        <slot name="code"></slot>
      </div>
      <div class="border">

      </div>
      <div class="control"
           @click="changeStatus">
           <el-tooltip class="item" effect="dark" :content="content" placement="top">
            <img :src="imgSrc" />
          </el-tooltip>
      </div>
      <!-- <div style="width:100%;height:5px;"></div> -->
    </div>
  </div>
</template>

<script>
import spread from '../icons/spread.png'
import retract from '../icons/retract.png'

export default {
  components: {

  },
  data () {
    return {
      isSpread: false
    }
  },
  computed: {
    imgSrc () {
      return this.isSpread ? retract : spread
    },
    content () {
      return this.isSpread ? '隐藏代码' : '展示代码'
    }
  },
  methods: {
    changeStatus () {
      this.$emit('update')
      this.isSpread = !this.isSpread
    }
  }
}
</script>

<style scoped lang="stylus">
.border-wrapper
  border 1px solid #DEE2E6
  padding 20px
  margin 30px 0
  box-shadow 2px 2px 30px #C7CCD7
  .border-content
    padding 5px 0
    border #979797
    // box-shadow 2px 2px 30px #C7CCD7
    background #fff
    .slot-content
      padding 10px
    .slot-introduce 
      background #e9f0f8
      padding 20px
      margin 30px 10px -16px 10px
      .text
        background #fff
        border 1px solid #ebebeb
        border-radius 3px
        padding 20px
    .slot-code
      display block
      margin-bottom 20px
      padding-left 10px
      padding-right 10px
      & >>> pre
        margin 5px   
    .border 
      height 1px
      background #d3dce6
      margin-left -20px
      margin-right -20px  
      margin-top 15px  
    .control
      height 15px
      width 15px
      margin 0 auto
      border 1px solid #DEE2E6
      border-radius 50%
      display flex
      justify-content center
      align-items center
      margin-bottom -10px
      margin-top 15px
      img
        color #3683D6
        font-weight bold
      &:hover
        border 1px solid #3683D6
        cursor pointer
</style>
