<template>
  <div class="notfound">
      <div class="container" id="container">
        <span class="en">404 NOTFOUND</span>
        <span class="cn">您所请求的页面无法找到，请<a class="back" @click="hisback()">点击此处</a>返回上一层</span>
      </div>
  </div>
</template>

<script>
export default {
  name: 'Notfound',
    data () {
            return {
        }
    },
  methods:{
        hisback(){
            let oCon = document.getElementById('container');
            oCon.style.transform = 'rotate(-30deg) translateY( -450px )';
            function late(){
                window.history.back();
            }
            setTimeout(late,500);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .container{
        width: 500px;
        height: 150px;
        position: absolute;
        left: 50%;
        top: 40%;
        margin-top: -75px;
        margin-left: -250px;
        transition: 0.4s;
    }
    .notfound{
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        position: absolute;
        background-color: #81c1eb;
    }
    .en{
        font-size: 40px;
        width: 500px;
        text-align: center;
        left: 50%;
        margin-left: -250px;
        top: 0;
        position: absolute;
        color: white;
    }
    .cn{
        width: 400px;
        top: 50px;
        font-size: 18px;
        color: #81c1eb;
        font-weight: 1000;
        position: absolute;
        left: 50%;
        margin-left: -200px;
        background: white;
        border-radius: 5px;
        padding:5px 7px 5px 7px;
    }
    .back{
        cursor: pointer;
        color: #239cec;
    }
</style>
