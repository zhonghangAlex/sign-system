<template>
  <div class="newsign">
    <el-steps :active="step_index" finish-status="success" simple style="margin-top: 20px;border:3px solid #658aac; border-radius:50px;">
      <el-step title="步骤 1" ></el-step>
      <el-step title="步骤 2" ></el-step>
      <el-step title="步骤 3" ></el-step>
      <el-step title="步骤 4" ></el-step>
      <el-step title="步骤 5" ></el-step>
      <el-step title="步骤 6" ></el-step>
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
              第二步：点名类别选择
            </span>
            <div class="sign_kind">
              <center>
                <el-radio-group v-model="value_kind" @change="kind_change">
                  <el-radio-button label="寝室"></el-radio-button>
                  <el-radio-button label="教室"></el-radio-button>
                  <el-radio-button label="其他"></el-radio-button>
                </el-radio-group>
              </center>
              <center>
                <el-select v-model="value_place" v-show="kindone" :filterable="true" placeholder="请选择地点" @change="getsignarearoom"  class="step2-select1" >
                  <el-option v-for="item in options_place" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                
                <el-select v-model="value_room" v-show="kindtwo" :filterable="true" placeholder="请选择地点编号" @change="getxy" class="step2-select2" >
                  <el-option v-for="item in options_room" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </center>
            </div>
          </div>
          <div class="swiper-slide swiper-no-swiping">
            <span class="step-title">
              第三步：辅助定位选项
            </span>
            <div class="sign_op">
              <el-switch v-model="value_gps" active-text="启用GPS定位" inactive-text="关闭GPS定位" active-color="#13ce66" :disabled="true" inactive-color="#eedddd" ></el-switch>
              <el-switch v-model="value_ip" v-show="ip_show" active-text="启用IP追踪定位" inactive-text="关闭IP追踪定位" active-color="#13ce66" inactive-color="#eedddd" ></el-switch>
              <el-switch v-model="value_ewm" active-text="启用二维码签到" inactive-text="关闭二维码签到" active-color="#13ce66" inactive-color="#eedddd" ></el-switch>
              <el-switch v-model="value_code" active-text="启用口令签到" inactive-text="关闭口令签到" active-color="#13ce66" inactive-color="#eedddd" ></el-switch>
            </div>
          </div>
          <div class="swiper-slide swiper-no-swiping">
            <span class="step-title">
              第四步：起止时间设定
            </span>
            <div class="sign_time_start">
              <div>
                <span class="time_start">开始日期</span>
                <el-date-picker class="sign_picker" value-format="yyyy-MM-dd"  v-model="value_date_start" align="right" type="date" placeholder="选择日期" >
                </el-date-picker>
              </div>
              <div>
              <span class="time_start">开始时间</span>
              <el-time-picker class="sign_picker"  value-format="HH:mm:ss" v-model="value_time_start"   placeholder="选择时间范围"></el-time-picker>
              </div>
            </div>
            <div class="sign_time_end"> 
              <div>
                <span class="time_end">截止日期</span>
                <el-date-picker class="sign_picker" value-format="yyyy-MM-dd" v-model="value_date_end" align="right" type="date" placeholder="选择日期" >
                </el-date-picker>
              </div>
              <div>
                <span class="time_end">截止时间</span>
                <el-time-picker class="sign_picker" value-format="HH:mm:ss" v-model="value_time_end"    placeholder="选择时间范围"></el-time-picker>
              </div>
            </div>
          </div>
          <div class="swiper-slide swiper-no-swiping">
            <span class="step-title">
              第五步：自动发布周期设定
            </span>
            <div class="gap_container">
              <center><el-switch v-model="value_gap" @change="if_gap" style="top:100px;" active-text="启用签到周期" inactive-text="关闭签到周期" active-color="#13ce66" inactive-color="#eedddd" ></el-switch></center>
              <el-input-number v-model="num1" v-show="show_pick" @change="handleChange" :min="0" :max="10000" label="签到周期天数" class="gap_date"></el-input-number>
            </div>
          </div>
          <div class="swiper-slide swiper-no-swiping">
            <span class="step-title">
              第六步：GPS范围确定
            </span>
            <div class="gps_container">
              <div class="gps_circle" @click="handleGPS()"></div>
            </div>
          </div>
          <div class="swiper-slide swiper-no-swiping">
            <span class="step-title step-end" @click="submitnewsign()">
              点击提交并发布新签到
            </span>
          </div>
      </div>
      
      <!-- 如果需要导航按钮 -->
      
    </div>
    <div class="swiper-button-prev">上一步</div>
    <div class="swiper-button-next">下一步</div>
    
    <!-- GPS范围确定 -->
    <el-dialog title="GPS范围选定" width="80%" :visible.sync ="GPSmapVisible" :close-on-click-modal="false" class="gps_dia" >
      <!-- <Bmap class="bmap"></Bmap>  -->
      <center><iframe src="../../../static/Bmap.html" width="100%" height= "650px" name="ifmap" scrolling="No"  noresize="noresize" frameborder="0" id="ifmap"></iframe></center> 
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="GPSmapVisible = false" class="cancel">取消</el-button>
        <el-button type="primary" @click.native="submitmap()" class="submit">完成</el-button>
      </div>
    </el-dialog>
    <!--提交成功后显示二维码下载&code界面-->	
		<el-dialog title="发布签到成功" :visible.sync ="codeVisible" :close-on-click-modal="false" >
      <center>
        <el-input placeholder="暂无签到密令，如果需要请重新设置" v-model="code" v-show="if_code" :disabled="true" style="width:200px;text-align:center;"></el-input>
        <el-button style="" size="small"  type="success" v-show="if_qrcode" @click="qr_download()" native-type="submit" target="_blank">本次签到二维码下载</el-button>
      </center>
			
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="codeVisible = false">完成</el-button>
			</div>
		</el-dialog>
  </div>
  
  
</template>

<script language="javascript">
import axios from 'axios'
import Swiper from '../../../static/js/swiper' 
import '../../../static/css/swiper.css'
import GeoUtils from '../../../static/js/GeoUtils.js'
import BMap from 'BMap'


export default {
  name: 'Newsign',
  data () {
    return {
        //步骤条相关
        step_index:1,
        //选择已有签到域
        options: [],
        value: '',

        //点名类别选择
        value_kind:'寝室',
        kindone:false,
        kindtwo:false,

        options_place: [],
        value_place: '',

        options_room: [],
        value_room: '',

        //辅助签到选项
        value_gps: true,
        value_ip: false,
        value_ewm:false,
        value_code:false,
        ip_show:true,

        //签到类型
        

        //设定具体时间
        value_time_start: '',
        value_time_end: '',
        value_date_start: '',
        value_date_end: '',

        //循环周期
        num1: 0,
        value_gap: false,
        show_pick:false,

        //GPS范围确定
        GPSmapVisible:false,
        //纪录GPS相关参数
        x:'',
        y:'',
        dis:'',

        //返回的密码和qrcode
        code:'',
        qrcode:'',
        signid:'',

        //提交成功后的code信息
        codeVisible:false,
        if_code:true,
        if_qrcode:true

    }
  },
  methods: {

    //选择签到域数据获取
    getsignareapick(){
      let _this = this;
      axios.get('http://120.79.12.163/usesignarea')
      .then(function (response) {
        _this.options = response.data.signarea;
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    //点名类别选择——地点选择
    getsignareplace(){
      let _this = this;
      axios.get('http://120.79.12.163/mgetplace?k='+_this.value_kind)
      .then(function (response) {
        _this.options_place = response.data.place;
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    //点名类别选择——编号选择
    getsignarearoom(){
      let _this = this;
      axios.get('http://120.79.12.163/mgetroom?place='+_this.value_place)
      .then(function (response) {
        _this.options_room = response.data.room;
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    getxy(){
      let _this = this;
      axios.get('http://120.79.12.163/mgetxy?place='+_this.value_place+'&room='+_this.value_room)
      .then(function (response) {
        _this.x = response.data.x;
        _this.y = response.data.y;
        _this.dis = response.data.dis;
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    //点名类别，选择寝室默认消失
    kind_change(){
      if(this.value_kind == "寝室"){
        this.kindone = false;
        this.kindtwo = false;
      }
      else{
        this.kindone = true;
        this.kindtwo = true;
      }
      if(this.value_kind == "其他"){
        this.kindone = false;
        this.kindtwo = false;
        this.ip_show = false;
      }
      else{
        this.ip_show = true;
      }
      let _this = this;
      axios.get('http://120.79.12.163/mgetplace?k='+_this.value_kind)
      .then(function (response) {
        _this.options_place = response.data.place;
      })
      .catch(function (error) {
        console.log(error);
      });
      this.value_place = '';
      this.value_room = '';
    },

    //关于循环天数的问题
    if_gap(){
      if(this.value_gap==true){
        this.show_pick=true;
      }
      else{
        this.show_pick=false;
        this.num1=0;
      }
    },
    handleChange(value) {
      console.log(value);
    },
    
    //显示GPS地图选择对话框
    handleGPS() {
      this.GPSmapVisible = true;
      let _this = this;
    },
    submitmap(){
      this.x = document.getElementById("ifmap").contentWindow.document.getElementById('lonlat').value;
      this.y = document.getElementById("ifmap").contentWindow.document.getElementById('lonlat2').value;
      this.dis = document.getElementById("ifmap").contentWindow.document.getElementById('dis').value;
      this.GPSmapVisible = false;
    },

    //提交整个新建签到域
    submitnewsign(){
      let _this = this;
      let start = _this.value_date_start +' ' + _this.value_time_start;
      let end = _this.value_date_end +' '+ _this.value_time_end ;
      
      let params = new URLSearchParams()
      params.append('groupname',_this.value)
      params.append('isip_bssid',_this.value_ip)
      params.append('isqrcode',_this.value_ewm)
      params.append('iscode',_this.value_code)
      params.append('place',_this.value_place)
      params.append('room',_this.value_room)
      params.append('x',_this.x)
      params.append('y',_this.y)
      params.append('dis',_this.dis)
      params.append('kind',_this.value_kind)
      params.append('starttime',start)
      params.append('endtime',end)
      params.append('gap',_this.num1)

      axios.post('http://120.79.12.163/createsign', params)
      .then(function (response) {
        _this.code = response.data.code;
        _this.signid = response.data.signid;
        _this.qrcode = response.data.qrcode;
        if(response.data.status==1){
          if(response.data.code!=''||response.data.qrcode!=''){
            _this.codeVisible = true;
          }
          if(response.data.code==''){
            _this.if_code = false;
          }
          if(response.data.qrcode==''){
            _this.if_qrcode = false;
          }
          
          _this.if_code = true;
          _this.$message({
            message: response.data.message,
            type: 'success',
            duration:2000,
            showClose:true
          });
        }
        else{
          _this.$message({
            message: response.data.message,
            type: 'error',
            duration:2000,
            showClose:true
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    qr_download(){
      window.open("http://120.79.12.163/createqrcode?qr=checkqrcode%3Fsignid%3D"+this.signid+"%26qrcode%3D"+this.qrcode);
    }
    
  },
  mounted(){
    //初始化swiper
    let _this = this;
    let mySwiper = new Swiper ('.swiper-container', {
      direction: 'horizontal',
      loop: false,
      speed:1000,
      grabCursor : false,
      effect : 'coverflow',
      // 如果需要前进后退按钮
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      
      effect : 'coverflow',//切换效果
      slidesPerView: 3,//同时显示页数
      centeredSlides: true,
      initialSlide :1,//初始化在第几页
    
    //上方托条的拉动
    //初始化签到域选择
      on:{
        slideChangeTransitionEnd:function(){
          let swiperindex = this.activeIndex;
          _this.step_index = swiperindex-1;
        },
      },
    });
    
    
    this.getsignareapick(); 
    this.getsignareplace();
    this.getsignarearoom();
  }
}
</script>

<style scoped>

    .newsign{
        border-radius: 10px;
        font-size: 40px;
        height: 400px;
        background: #81c1eb;
        margin-bottom: 20px;
    }
    .swiper-container {
      
      top: 20%;
      height: 320px;
      max-width: 1200px;
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
    .step2-select1{
      width: 65%;
    }
    .step2-select2{
      width: 65%;
    }
    .swiper-button-prev{
      background-color: #658aac;
      width:30px;
      margin-top: 50px;
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
      position: absolute;
    }
    .swiper-button-next{
      background-color: #658aac;
      width:30px;
      margin-top: 50px;
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
      position: absolute;
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
      top: 45%;
      margin-top:-30px;
      width: 100%;
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
    .gap_date{
      top: 120px;
      width: 300px;
      height: 60px;
      left: 50%;
      margin-left: -150px;
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
</style>
