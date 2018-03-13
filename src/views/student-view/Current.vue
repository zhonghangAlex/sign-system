<template>
  <div class="newsign">
    
    <div class="swiper-container">
      <div class="swiper-wrapper">
          <div class="swiper-slide swiper-no-swiping">
            <span class="step-title">
              第一步：请选择签到域
            </span>
            <el-select v-model="value" :filterable="true" placeholder="请选择" class="step1-select" >
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="swiper-slide swiper-no-swiping">
            <span class="step-title">
              第二步：辅助定位选项
            </span>
            <div class="sign_op">
              <el-switch v-model="value_gps" active-text="启用GPS定位" inactive-text="关闭GPS定位" active-color="#13ce66" inactive-color="#eedddd" ></el-switch>
              <el-switch v-model="value_ip" active-text="启用IP追踪定位" inactive-text="关闭IP追踪定位" active-color="#13ce66" inactive-color="#eedddd" ></el-switch>
              <el-switch v-model="value_ewm" active-text="启用二维码签到" inactive-text="关闭二维码签到" active-color="#13ce66" inactive-color="#eedddd" ></el-switch>
              <el-switch v-model="value_code" active-text="启用口令签到" inactive-text="关闭口令签到" active-color="#13ce66" inactive-color="#eedddd" ></el-switch>
            </div>
          </div>
          <div class="swiper-slide swiper-no-swiping">
            <span class="step-title">
              第三步：点名类别选择
            </span>
            <div class="sign_kind">
              <el-radio-group v-model="value_kind">
                <el-radio-button label="宿舍"></el-radio-button>
                <el-radio-button label="教师"></el-radio-button>
                <el-radio-button label="操场"></el-radio-button>
                <el-radio-button label="其他"></el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="swiper-slide swiper-no-swiping">
            <span class="step-title">
              第四步：起止时间设定
            </span>
            <div class="sign_time_start">
              <div>
                <span class="time_start">开始日期</span>
                <el-date-picker class="sign_picker"  v-model="value_time_start" align="right" type="date" placeholder="选择日期" >
                </el-date-picker>
              </div>
              <div>
              <span class="time_start">开始时间</span>
              <el-time-picker class="sign_picker"  v-model="value_date_start" :picker-options="{selectableRange: '18:30:00 - 20:30:00'}"   placeholder="选择时间范围"></el-time-picker>
              </div>
            </div>
            <div class="sign_time_end"> 
              <div>
                <span class="time_end">截止日期</span>
                <el-date-picker class="sign_picker" v-model="value_time_end" align="right" type="date" placeholder="选择日期" >
                </el-date-picker>
              </div>
              <div>
                <span class="time_end">截止时间</span>
                <el-time-picker class="sign_picker" v-model="value_date_end" :picker-options="{selectableRange: '18:30:00 - 20:30:00'}"   placeholder="选择时间范围"></el-time-picker>
              </div>
            </div>
          </div>
          <div class="swiper-slide swiper-no-swiping">
            <span class="step-title">
              第五步：GPS范围确定
            </span>
            <div class="gps_container">
              <div class="gps_circle">

              </div>
            </div>
          </div>
      </div>
      
      <!-- 如果需要导航按钮 -->
      <div class="swiper-button-prev">上一步</div>
      <div class="swiper-button-next">下一步</div>
      
      <!-- 如果需要滚动条 -->
      
    </div>
  </div>
</template>

<script>
import Swiper from '../../../static/js/swiper' 
import '../../../static/css/swiper.css'
export default {
  name: 'Newsign',
  data () {
    return {
        //是否选用已有签到域
        radio7: '1',

        //选择已有签到域
        options: [{
          value: '选项1',
          label: 'XM3201-1'
        }, {
          value: '选项2',
          label: 'XM132-2'
        }, {
          value: '选项3',
          label: 'XD234-1'
        }, {
          value: '选项4',
          label: 'JD1C-2'
        }, {
          value: '选项5',
          label: 'J5A5-4'
        }],
        value: '',
        //辅助签到选项
        value_gps: true,
        value_ip: false,
        value_ewm:false,
        value_code:false,
        //签到类型
        value_kind:'宿舍',
        //设定具体时间
        
        value_time_start: '',
        value_time_end: '',
        value_date_start: new Date(2016, 9, 10, 8, 40),
        value_date_end: new Date(2016, 9, 10, 8, 40),

    }
  },
  mounted(){
    //初始化swiper
    var mySwiper = new Swiper ('.swiper-container', {
      direction: 'horizontal',
      loop: false,
      speed:1000,
      grabCursor : false,
      onlyExternal:true,
      
      // 如果需要前进后退按钮
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      coverflow: {
        rotate: 30,
        stretch: 100,
        depth: 60,
        modifier: 2,
        slideShadows : false
      },
      
      // 如果需要滚动条
      effect : 'coverflow',
      slidesPerView: 3,
      centeredSlides: true
    
    //上方托条的拉动

      
    })        
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .newsign{
        border-radius: 10px;
        font-size: 40px;
        height: 600px;
        background: #81c1eb;
        margin-bottom: 20px;
    }
    span{
        left: 50px;
        top:50px;
        width: 600px;
    }
    .next_step{
      width: 100%;
      height: 10px;
      position: relative;
      top: 25%;
      background-color:#b28850; 
    }
    .line_block{
      width: 20%;
      height: 10px;
      position: relative;
      left: 0;
      top: 0;
      border-radius: 5px;
      background-color: #6a3906;
    }
    .swiper-container {
      top: 230px;
      height: 320px;
      width: 100%;
      position: absolute;
    }  
    .swiper-slide{
      background-color: #81c1eb;
      border-radius: 10px;
      margin-top:5px;
      border:5px solid #fff;
      height: 300px;
      /*box-shadow: 0px 0px 10px 5px #444;*/
    }
    .step-title{
      font-size: 20px;
      width: 94%;
      height: 50px;
      top: 20px;
      left: 3%;
      border-radius: 50px;
      line-height: 50px;
      text-align: center;
      position: absolute;
      color: #658aac;
      background-color: white;
    }
    .step1-select{
      top: 120px;
      width: 300px;
      height: 60px;
      left: 50%;
      margin-left: -150px;

    }
    .swiper-button-prev{
      background-color: #658aac;
      width:30px;
      height: 70px;
      font-size: 20px;
      text-align: center;
      line-height: 22px;
      border-radius: 10px;
      color:white;
      padding: 5px 5px 5px 5px;
      margin-left: -15px;
      background-image: none;
      box-shadow: 0px 0px 10px 1px #444;
    }
    .swiper-button-next{
      background-color: #658aac;
      width:30px;
      
      height: 70px;
      font-size:20px; 
      text-align: center;
      line-height: 22px;
      border-radius: 10px;
      color:white;
      padding:5px 5px 5px 5px;
      margin-right:-15px;
      background-image: none;
      box-shadow: 0px 0px 10px 1px #444;
    }
    .sign_op{
      top: 100px;
      position: relative;
      left: 50%;
      width: 300px;
      margin-left: -150px;
      text-align: center;
      color:#b28850;
    }
    .sign_kind{
      top: 50%;
      margin-top:-30px;
      left: 50%;
      margin-left:-140px;
      position: relative;  
    }
    .sign_time_start{
      top:18%;
      position: relative;
      color: white;
      font-size: 15px;
      text-align: center;
      padding: 20px 0 20px 0;
    }
    .sign_time_end{
      top:10%;
      position: relative;
      color: white;
      font-size: 15px;
      text-align: center;
      padding: 20px 0 20px 0;
    }
    .sign_picker{
      margin-top:5px;
    }
    .time_start{
      background-color: #658aac;
      color:#fff;
      border-radius: 5px;
      padding:5px 10px 5px 10px;
    }
    .time_end{
      background-color: #658aac;
      color:#fff;
      border-radius: 5px;
      padding:5px 10px 5px 10px;
    }
    .gps_container{
      position: relative;
      top: 20%;
    }
    .gps_circle{
      background: #b28850;
      width:200px;
      height: 200px;
      position: relative;
      left:50%;
      top:50%;
      margin-left:-100px;
      margin-top:-100px;
      border-radius: 100px;
      border:5px solid #fff;
    }
</style>
