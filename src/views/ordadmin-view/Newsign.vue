<template>
  <div class="newsign">
    
    <!--
    <div>
        <el-radio v-model="radio7" label="1" border>选用已有签到域</el-radio>
        <el-radio v-model="radio7" label="2" border>新建签到域</el-radio>
    </div>
    <el-select v-model="value" filterable="true" placeholder="请选择" >
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    -->
    
    <el-steps :active="4" finish-status="success" simple style="margin-top: 20px;border:3px solid #658aac; border-radius:50px;">
      <el-step title="步骤 1" ></el-step>
      <el-step title="步骤 2" ></el-step>
      <el-step title="步骤 3" ></el-step>
      <el-step title="步骤 4" ></el-step>
      <el-step title="步骤 5" ></el-step>
    </el-steps>
    <div class="swiper-container">
      <div class="swiper-wrapper">
          <div class="swiper-slide swiper-no-swiping">
            <span class="step-title step-welcome">
              请按照步骤顺序依次填写签到信息
            </span>
          </div>
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
              <div class="gps_circle" @click="handleGPS()">

              </div>
            </div>
          </div>
          <div class="swiper-slide swiper-no-swiping">
            <span class="step-title step-end">
              点击提交并发布新签到
            </span>
          </div>
      </div>
      
      <!-- 如果需要导航按钮 -->
      <div class="swiper-button-prev">上一步</div>
      <div class="swiper-button-next">下一步</div>
    </div>
    
    <el-dialog title="GPS范围选定" width="80%" :visible.sync ="GPSmapVisible" :close-on-click-modal="false" class="gps_dia" >
      <Bmap class="bmap"></Bmap>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="GPSmapVisible = false">取消</el-button>
        <el-button type="primary" @click.native="GPSmapVisible = false">完成</el-button>
      </div>
    </el-dialog>
  </div>
  
  
</template>

<script>
import Swiper from '../../../static/js/swiper' 
import '../../../static/css/swiper.css'
import GeoUtils from '../../../static/js/GeoUtils.js'
import BMap from 'BMap'


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

        //GPS范围确定
        GPSmapVisible:false,

    }
  },
  methods: {
    //显示GPS地图选择对话框
    handleGPS() {
      this.GPSmapVisible = true;
      var _this = this;
    },
    
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
      
      effect : 'coverflow',//切换效果
      slidesPerView: 3,//同时显示页数
      centeredSlides: true,
      initialSlide :1,//初始化在第几页
    
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
        height: 400px;
        background: #81c1eb;
        margin-bottom: 20px;
    }
    
    
    /*
    .line_block{
      width: 20%;
      height: 10px;
      position: relative;
      left: 0;
      top: 0;
      border-radius: 5px;
      background-color: #6a3906;
    }
    */
    .swiper-container {
      top: 70px;
      height: 320px;
      width: 100%;
      position: relative;
    } 
    .swiper-slide{
      background-color: #81c1eb;
      border-radius: 10px;
      margin-top:5px;
      border:5px solid #fff;
      height: 300px;
      margin-left: -9px;
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
    .step-welcome{
      border-radius: 5px;
      top: 50%;
      margin-top: -50px;
    }
    .step-end{
      border-radius: 5px;
      top: 50%;
      margin-top: -50px;
      cursor: pointer;
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
      top: 60%;
    }
    .gps_circle{
      background:url(../../../static/img/small_map.png);
      width:200px;
      height: 200px;
      position: relative;
      left:50%;
      top:50%;
      margin-left:-100px;
      margin-top:-100px;
      border-radius: 100px;
      border:5px solid #658aac;
      cursor: pointer;
    }

    /*地图初始化*/
    .bmap{
      width: 500px;
      height: 500px;
      position: absolute;
    }

    
    
</style>
