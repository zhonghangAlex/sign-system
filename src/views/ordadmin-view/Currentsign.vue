<template>
    <section class="datastatistics">
        <el-form :model="signcurrent" label-width="220px" style="padding-top:30px;padding-left:30px;position:relative;" ref="editForm">
            <el-form-item label="签到域编号" >
                <el-input v-model="signcurrent.groupname" :disabled='true'  style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="开始时间" >
                <el-input v-model="signcurrent.starttime" :disabled='true'  style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="截止时间" >
                <el-input v-model="signcurrent.endtime" :disabled='true'  style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="学生查询">
                <el-input v-model="signcurrentfilters.search"  placeholder="输入关键字查询" style="width:250px;"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handlesearch()" style="position:absolute;margin-top:-62px;margin-left:260px;">查询</el-button>
            </el-form-item>
            <el-form-item label="统计图">
                <div id="chartPie" style="width:60%; height:350px;"></div>
            </el-form-item>
            <el-form-item :label="labelsuccess">
                <el-tag  type="success" :key="tag.stuid" v-for="tag in signcurrent.signsuccess"  :disable-transitions="false" >
                    学号:&nbsp;{{tag.stuid}}&nbsp;&nbsp;姓名:&nbsp;{{tag.name}}</el-tag>
            </el-form-item>
            <el-form-item :label="labelfail">
                <el-tag type="danger" :key="tag.stuid" v-for="tag in signcurrent.signfail"  :disable-transitions="false"  >
                    学号:&nbsp;{{tag.stuid}}&nbsp;&nbsp;姓名:&nbsp;{{tag.name}}</el-tag>
            </el-form-item>
            <el-form-item label="详情导出">
                <el-button class="importexcel"  size="small" type="success" @click.native="importexcel">导出本次签到的Excel表</el-button>
            </el-form-item>
        </el-form>
        <!-- <el-row>
            <el-col :span="24">
            </el-col>
            <el-col :span="12">
            </el-col>
            <el-col :span="12">
            </el-col>
        </el-row> -->
    </section>
</template>
<script>
    import echarts from 'echarts'
	import axios from 'axios'
	import util from '../../common/util'
    export default {
        data() {
            return {
                signcurrentfilters:{
                    search:''
                },
                //存储发送过来的detail信息
                signcurrent:{},
                //存储个数
                signsuccesscount:'',
                signfailcount:'',
                //动态加载标签
                labelsuccess:'',
                labelfail:'',
                //存储点开详情时当行的id唯一标识
                detailsaveid:'',
                //饼状图
                chartPie: null,
            }
        },
        methods:{
            //导出excel表
			importexcel(){
				window.open("http://120.79.12.163/signrecordexport?signid="+this.detailsaveid);
			},
			//详情的统计图
			drawPieChart() {
				var _this = this;
                this.chartPie = echarts.init(document.getElementById('chartPie'));
                this.chartPie.setOption({
					color:['#67c23a','#f56c6c'],
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data:['实到人数','缺勤人数'],

                    },
                    series: [
                        {
                            name:'人数统计',
                            type:'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:[
                                {value:_this.signsuccesscount, name:'实到人数'},
                                {value:_this.signfailcount, name:'缺勤人数'}
                            ]
                        }
                    ]
                });
            },
            drawCharts() {
                this.drawPieChart()
            },
            handlesearch(){
                if(this.signcurrentfilters.search==''){
                    this.handlegetinfo('mgetcurrentsign');
                }else{
                    this.handlegetinfo('msigndetail');
                }
            },
            handlegetinfo(getinfo){
                var _this = this;
                axios.get('http://120.79.12.163/'+getinfo+'?signid='+_this.detailsaveid+'&search='+_this.signcurrentfilters.search)
                .then(function (response) {
                    _this.detailsaveid = response.data.signid;
                    _this.signcurrent = response.data;
                    _this.signsuccesscount = response.data.successcount;
                    _this.signfailcount = parseInt(response.data.totalcount)-parseInt(response.data.successcount);
                    if(response.data.totalcount&&response.data.successcount){
                        _this.labelsuccess = '签到成功的学生（'+_this.signsuccesscount+'人 )';
                        _this.labelfail = '未签到的学生（'+_this.signfailcount+'人 )';
                    }else{
                        if(response.data.signsuccess!=''&&response.data.signfali!='')
                        {
                            _this.labelsuccess = '查询结果：已签到学生';
                            _this.labelfail = '查询结果：未签到的学生';
                        }
                        if(response.data.signsuccess!=''&&response.data.signfail=='')
                        {
                            _this.labelsuccess = '查询结果：已签到学生';
                            _this.labelfail = '无对应未签到学生';
                        }
                        if(response.data.signsuccess==''&&response.data.signfail!='')
                        {
                            _this.labelsuccess = '无对应已签到学生';
                            _this.labelfail = '查询结果：未签到的学生';
                        }
                        if(response.data.signsuccess==''&&response.data.signfail=='')
                        {
                            _this.labelsuccess = '无对应学生';
                        }
                        
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            },
        },
        mounted(){
            this.handlegetinfo('mgetcurrentsign');
            this.drawCharts();
        },
        updated(){
			this.drawCharts();
		}
    }
</script>
<style>
    .datastatistics{
        width: 100%;
        float: left;
        background: white;
        border-radius: 20px;
    }
</style>

