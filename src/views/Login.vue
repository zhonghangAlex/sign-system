<template>
  <div class="login">
    <div class="container" id="container">
      <img class="logo-login"   src="../../static/img/logo-login.png" />
      <el-form  :model="ruleForm" :rules="ruleslogin" ref="ruleForm" label-position="left" label-width="0px" class="login-container">
        <h3 class="title">系统登录</h3>
        <el-form-item prop="account">
          <i class="account-logo"></i>
          <el-input type="text" class="account-input"  clearable  auto-complete="off" placeholder="账号" v-model="ruleForm.account"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <i class="checkpass-logo"></i>
          <el-input type="password" class="checkpass-input" clearable  auto-complete="off" placeholder="密码" v-model="ruleForm.checkPass"></el-input>
        </el-form-item>
        <el-switch v-model="value3" active-text="记住密码" class="remember"></el-switch>
        <el-form-item style="width:100%;">
          <el-button native-type="submit" type="primary" class="submit" style="width:100%;"   @click.native.prevent="handleSubmit" :loading="logining">登&nbsp;&nbsp;&nbsp;录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <canvas></canvas>
    
  </div>
</template>

<script>
import axios from 'axios'
import logincanvas from '../../static/js/logincanvas'
export default {
  name: 'Login',
  data () {
    return {
      logining:false,
      value3:false,
      input10: '',
      ruleForm: {
      },
      ruleslogin: {
        account: [
          { required: true, message: '账号为空，请输入账号', trigger: 'blur' },
        ],
        checkPass: [
          { required: true, message: '密码为空，请输入密码', trigger: 'blur' },
        ]
      },
      checked: true
    };
  },
  methods: {
    rememberUser(){
      if(this.value3==true){
        alert('1');
      }
    },
    handleSubmit(ev) {
      let _this=this;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          function move(topath){
            let oCon = document.getElementById('container');
            oCon.style.transform = 'translateY(-600px) ';
            function late(){
                _this.$router.push({ path: topath });
            }
            setTimeout(late,300);
          }
          //post 方法请求数据
          let loginParams = { id: this.ruleForm.account, password: this.ruleForm.checkPass };//对象格式
          let params = new URLSearchParams()
          let para = {
            id: this.ruleForm.account,
            password: this.ruleForm.checkPass
          }
          params.append('id',this.ruleForm.account)
          params.append('password',this.ruleForm.checkPass)
          axios.post('http://120.79.12.163/login',params)
          .then(function (response) {
            let d=response.data;
            if(d.status==1&&d.power==1){
              _this.$message({
                message: d.message,
                type: 'success',
                duration:2000,
                showClose:true
              });
              move('/super');
            }
            else if(d.status==1&&d.power==2){
              _this.$message({
                message: d.message,
                type: 'success',
                duration:2000,
                showClose:true
              });
              move('/ord');
            }
            else if(d.status==1&&d.power==3){
              _this.$message({
                message: d.message,
                type: 'success',
                duration:2000,
                showClose:true
              });
              move('/ord');
            }
            else{
              _this.$message({
                message: d.message,
                type: 'error',
                duration:1200,
                showClose:true
              });
            }
          })
          .catch(function (error) {
            console.log(error);
            _this.$message({
              message: '数据请求错误,请稍后重试',
              type: 'error'
            });
          });

        } else {
          return false;
        }
      });
    }
  },
  mounted(){
    let FastRandom = function()
    {
        this.getNextFloat = function()
        {
            return Math.random();
        };
    };

    let ParticleWave = function()
    {
        let me = this;

        let config = {
            colors : {
                background : 0x81c1eb,
                particle   : 0xbcbfc2
            },
            alpha : {
                particle : 1
            },
            particleCount : 3000
        };

        let TAU = Math.PI * 2;

        let random = new FastRandom();

        let particle;
        let particleFillStyle;
        let particleColorRGB = new Float32Array(3);

        let smoothGradient;
        let waterGradient;

        let canvas;
        let engine;

        let width;
        let height;

        let particleWaveWalker = 0;
        let randomWalker = 0;

        let requestTick = function()
        {
            window.requestAnimationFrame(tick);
        };

        let initParticle = function()
        {
            particle = new Float32Array(config.particleCount * 2);

            eachParticle(function(x, z) {
                particle[x] = random.getNextFloat();
                particle[z] = random.getNextFloat();
            });
        };

        let initCanvas = function()
        {
            let cs = document.getElementsByTagName('canvas');

            canvas = cs[0];
            engine = canvas.getContext('2d');

            width  = window.innerWidth;
            height = window.innerHeight;

            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
        };

        let initParticleColor = function()
        {
            particleColorRGB[0] = config.colors.particle >> 16 & 0xff;
            particleColorRGB[1] = config.colors.particle >>  8 & 0xff;
            particleColorRGB[2] = config.colors.particle       & 0xff;

            particleFillStyle = 'rgb(' + particleColorRGB[0] + ',' + particleColorRGB[1] + ',' + particleColorRGB[2] + ')';
        };

        let initSmoothGradient = function()
        {
            smoothGradient = engine.createLinearGradient(
                width / 2,
                0,
                width / 2,
                height
            );

          
        };

        let initWaterGradient = function()
        {
            waterGradient = engine.createLinearGradient(
                width / 2,
                height / 2,
                width / 2,
                height
            );

            waterGradient.addColorStop(0, 'rgba(0, 0, 30, 0)');
            waterGradient.addColorStop(1, 'rgba(30, 0, 60, 0.5)');
        };

        let init = function()
        {
            initCanvas();
            initParticle();
            initParticleColor();
            initSmoothGradient();
            initWaterGradient();
        };

        let eachParticle = function(cb)
        {
            for (let i = 0; i < particle.length; i += 2) {
                cb(i, i + 1);
            }
        };

        let renderParticle = function()
        {
            randomWalker += (Math.random() - 0.5) * 0.1;

            particleWaveWalker += 0.03;

            let radius = {
                min    : 1,
                add    : 5
            };

            let midY = height / 2;
            let midX = width / 2;

            let spreadX = 5;
            let spreadZ = 0.0;

            let modZ = 0.0;

            let addX = 0;
            let addY = 0;

            let p = {
                x : 0.0,
                y : 0.0,
                r : 0.0
            };

            engine.fillStyle = particleFillStyle;
            // engine.beginPath();

            let waveControl = 10;

            for (let i = 0, xIndex, zIndex; i < particle.length; i += 2) {

                xIndex = i;
                zIndex = i + 1;

                particle[zIndex] += 0.003;

                if (particle[zIndex] > 1) {
                    particle[zIndex] = 0;
                    particle[xIndex] = random.getNextFloat();
                }

                if (particle[zIndex] < 0.3) {
                    continue;
                }

                modZ    = Math.pow(particle[zIndex], 2);
                spreadZ = 1 + (spreadX - 1) * modZ;

                //bottom

                addX = (0.5 - particle[xIndex]) * width * spreadZ;
                addY = midY * modZ * (1 + 3 / waveControl);

                p.x = midX + addX;
                p.y = midY + addY;
                p.r = radius.min + modZ * radius.add;

                p.y += Math.sin(particle[xIndex] * 50 + particleWaveWalker) * addY / waveControl;
                p.y += Math.cos(particle[zIndex] * 10 + particleWaveWalker) * addY / waveControl;

                p.y -= Math.cos(particle[zIndex] + particle[xIndex] * 10 + particleWaveWalker) * addY / waveControl;

                p.y -= Math.cos(particle[xIndex] * 50 + particleWaveWalker) * addY / waveControl;
                p.y -= Math.sin(particle[zIndex] * 10 + particleWaveWalker) * addY / waveControl;

                if (p.x < 0 || p.x > width) {
                    continue;
                }

                engine.fillRect(p.x, p.y, p.r, p.r);

                // engine.moveTo(p.x, p.y);
                // engine.arc(p.x, p.y, p.r, 0, TAU);

                //top
                // p.y = height - p.y;
                //
                // engine.moveTo(p.x, p.y);
                // engine.arc(p.x, p.y, p.r, 0, TAU);
            }

            engine.fillStyle = particleFillStyle;

            // engine.closePath();
            // engine.fill();
        };

        let colorIntToHexString = function(color)
        {
            let s = color.toString(16);

            return '0'.repeat(6 - s.length) + s;
        };

        let clear = function()
        {
            engine.fillStyle = '#' + colorIntToHexString(config.colors.background);
            engine.fillRect(0, 0, width, height);
        };

        let drawSmooth = function()
        {
            engine.fillStyle = smoothGradient;
            engine.fillRect(0, 0, width, height);
        };

        let drawWater = function()
        {
            engine.fillStyle = waterGradient;
            engine.fillRect(0, height / 2, width, height / 2);
        };

        let tick = function()
        {
            clear();

            drawWater();
            renderParticle();
            drawSmooth();

            requestTick();
        };

        this.run = function()
        {
            init();
            tick();
        };
    };

    let pw = new ParticleWave();
    pw.run();
  }
}
</script>

<style  scoped>
  canvas {
    display:block;
    position: absolute;
    width:100%;
    height: 100%;
    top: 0;
    left:0;
    z-index: 100;
  }
  .login{
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: #81c1eb;
    z-index: 10000;
  }
  .container{
    height: 600px;
    width: 540px;
    top: 50%;
    margin-top: -300px;
    left: 50%;
    margin-left: -270px;
    position: relative;
    transition: 0.5s;
    z-index: 1000;
  }
  .login-container {
    -webkit-border-radius: 15px;
    border-radius: 15px;
    -moz-border-radius: 15px;
    background-clip: padding-box;
    width: 400px;
    height: 300px;
    margin-left: -235px;
    top: 30px;
    left: 50%;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid rgb(224, 219, 219);
    box-shadow: 0 10px 25px #5c5555;
    position: relative;
  }
  .account-logo{
    position: absolute;
    width: 25px;
    height: 25px;
    background:url(../../static/img/no-logo.png);
    z-index: 1000;
    top:8px;
    left: 8px;
  }
  .checkpass-logo{
    position: absolute;
    width: 25px;
    height: 25px;
    background:url(../../static/img/psw-logo.png);
    z-index: 1000;
    top:8px;
    left: 8px;
  }
  
  .title {
    margin: 0px auto 35px auto;
    width: 100px;
    padding-bottom:5px; 
    text-align: center;
    font-family: "微软雅黑";
    font-size: 25px;
    color: #658aac;
    border-bottom: 1px solid #658aac;
  }
  .remember {
    margin-bottom: 30px;
    left: 0;
    position: relative;
  }
  .logo-login{
    width: 460px;
    height: 204px;
    left: 50%;
    margin-left: -230px;
    top: 0;
    position: relative;
  }
  .submit{
    background: #658aac;
    border: 1px solid #658aac;
    box-shadow: 0 1px 5px #5c5555;
    font-size: 15px;
    font-family: "微软雅黑";
  }
  
</style>
