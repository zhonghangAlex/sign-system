<template>
    <section class="chart-container datastatistics">
        <center>
            <el-select v-model="value" placeholder="请选择您要查看的签到域" @change="pickchange()" style="margin-top:30px;width:200px;">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
             <el-date-picker @change="timechange()" value-format="yyyy-MM-dd HH:mm:ss" v-model="value_time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </center>
        <el-button  type="primary" @click.native="exceldownload()" style="right:30px;position:absolute;margin-top:-40px;" >数据导出</el-button>
        <el-row>
            <el-col :span="24">
                <div id="chartPie" style="width:100%; height:500px;"></div>
            </el-col>
            <el-col :span="24">
                <!-- <div style="overflow-y:yes;overflow-y:auto;height:400px;"> -->
                <center><div id="chartTable" style="width:100%;height:1400px;"></div></center>
            </el-col><br>
        </el-row>
    </section>
</template>

<script>
    import echarts from 'echarts'
    import axios from 'axios'

    export default {
        data() {
            return {
                chartColumn: null,
                chartBar: null,
                chartLine: null,
                chartPie: null,
                
                //选择签到加载
                options: [],
                value:'',
                //选择加载时间段
                value_time:'',
                starttime:'',
                endtime:'',
                //状态点阵图
                student:[],
                table_time:[],
                status_position:[],
                //折线图数据存储
                total:'',
                linetime:["签到情况"],
                linedata:["签到成功的人数"],
                linedatafail:["未签到人数"]  


            }
        },

        methods: {
            timechange(){
                this.starttime = this.value_time[0];
                this.endtime = this.value_time[1];
                this.getLinedata()
                this.getTabledata()
            },
            exceldownload(){
                var _this = this;
                window.open('http://120.79.12.163/mallrecordexport?groupname='+_this.value+'&starttime='+_this.starttime+'&endtime='+_this.endtime)
            },
            pickchange(){
                this.getLinedata()
                this.getTabledata()
            },
            getLinedata(){
                var _this = this;
                axios.get('http://120.79.12.163/msignareacount?signarea='+_this.value+'&starttime='+_this.starttime+'&endtime='+_this.endtime)
                .then(function (response) {
                    _this.linedata = [];
                    _this.linetime = [];
                    for(var i=0; i<response.data.record.length; i++){
                        _this.linetime[i+1] = response.data.record[i].endtime;
                        _this.linedata[i+1] = response.data.record[i].number;
                        _this.linedatafail[i+1] = response.data.total-response.data.record[i].number;
                    }
                    if(response.data.record.length==0){
                        _this.linedata = [];
                        _this.linetime = [];
                    }
                    _this.drawPieChart();
                })
                .catch(function (error) {
                    console.log(error);
                });
            },
            getTabledata(){
                var _this = this;
                axios.get('http://120.79.12.163/mgrouprecord?signarea='+_this.value+'&starttime='+_this.starttime+'&endtime='+_this.endtime)
                .then(function (response) {
                    _this.student = [];
                    _this.status_position = [];
                    _this.table_time = [];
                    if(response.data.student.length==0){
                        _this.student = ["暂无学生数据"];
                    }else{
                        var plength = response.data.student[0].time.length;
                        for(var i=0; i<response.data.student.length; i++){
                            _this.student[i] = response.data.student[i].name;
                            for(var j=0; j<response.data.student[0].time.length; j++){
                                _this.status_position[i*plength+j] = response.data.student[i].time[j];
                            }
                        }
                        for(var k=0; k<plength; k++){
                            _this.table_time[k] = '第'+(k+1)+'次';  
                        }
                        
                    }
                    _this.drawTableChart();
                })
                .catch(function (error) {
                    console.log(error);
                });
            },
            
            drawTableChart(){
                var _this = this;
                var data = _this.status_position;
                data = data.map(function (item) {
                    return [item[1], item[0], item[2] || '-'];
                });
                this.chartTable = echarts.init(document.getElementById('chartTable'));
                this.chartTable.setOption({
                    tooltip: {
                        position: 'top'
                    },
                    animation: false,
                    grid: {
                        top:'2%',
                        height: '93%',
                        y: '10%'
                    },
                    xAxis: {
                        type: 'category',
                        data: _this.table_time,
                        position:'top',
                        splitArea: {
                            show: true
                        }
                    },
                    yAxis: {
                        type: 'category',
                        data: _this.student,
                        splitArea: {
                            show: true
                        },
                        axisLine:{
                            lineStyle:{
                                //width:5,
                                //color:'#2a578b'
                            }//坐标轴线的属性设置
                        }
                    },
                    visualMap: {
                        type:'piecewise',
                        min: 1,
                        max: 2,
                        splitNumber: 2,
                        color: ['#2ca778','#c23531'],
                        textStyle: {
                            color: '#444'
                        },
                        align:'left',
                        text:['未进行签到','签到成功'],
                        show:false
                    },
                    series: [{
                        name: '该学生签到详情',
                        type: 'heatmap',
                        data: data,
                        label: {
                            normal: {
                                show: true
                            }
                        },
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                });
            },
            drawPieChart() {
                var _this = this;
                this.chartPie = echarts.init(document.getElementById('chartPie'));
                this.chartPie.setOption({
                    legend: {},
                    tooltip: {
                        trigger: 'axis',
                        showContent: false
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none'
                            },
                            magicType: {type: ['line', 'bar']},
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    dataset: {
                        source: [
                            _this.linetime,
                            _this.linedata,
                            _this.linedatafail
                        ]
                    },
                    xAxis: {
                        type: 'category',
                        axisLabel : {//坐标轴刻度标签的相关设置。
                            formatter : function(params){
                            var newParamsName = "";// 最终拼接成的字符串
                                var paramsNameNumber = params.length;// 实际标签的个数
                                var provideNumber = 10;// 每行能显示的字的个数
                                var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
                                /**
                                 * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                                 */
                                // 条件等同于rowNumber>1
                                if (paramsNameNumber > provideNumber) {
                                    /** 循环每一行,p表示行 */
                                    for (var p = 0; p < rowNumber; p++) {
                                        var tempStr = "";// 表示每一次截取的字符串
                                        var start = p * provideNumber;// 开始截取的位置
                                        var end = start + provideNumber;// 结束截取的位置
                                        // 此处特殊处理最后一行的索引值
                                        if (p == rowNumber - 1) {
                                            // 最后一次不换行
                                            tempStr = params.substring(start, paramsNameNumber);
                                        } else {
                                            // 每一次拼接字符串并换行
                                            tempStr = params.substring(start, end) + "\n";
                                        }
                                        newParamsName += tempStr;// 最终拼成的字符串
                                    }

                                } else {
                                    // 将旧标签的值赋给新标签
                                    newParamsName = params;
                                }
                                //将最终的字符串返回
                                return newParamsName
                            }
                        },
                    },
                    yAxis: {gridIndex: 0},
                    grid: {top: '55%'},
                    series: [
                        {type: 'line',color:'#2ca778', smooth: true, seriesLayoutBy: 'row'},
                        {type: 'line',color:'#c23531', smooth: true, seriesLayoutBy: 'row'},
                        {
                            type: 'pie',
                            id: 'pie',
                            radius: ['20%', '30%'],
                            center: ['50%', '25%'],
                            color:['#2ca778','#c23531'],
                            label: {
                                formatter: '{b}: {@2012} ({d}%)'
                            },
                            encode: {
                                itemName: '签到情况',
                                value: '2012',
                                tooltip: '2012'
                            }
                        }
                    ]
                });
                this.chartPie.on('updateAxisPointer', function (event) {
                    var xAxisInfo = event.axesInfo[0];
                    if (xAxisInfo) {
                        var dimension = xAxisInfo.value + 1;
                        _this.chartPie.setOption({
                            series: {
                                id: 'pie',
                                label: {
                                    formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                                },
                                encode: {
                                    value: dimension,
                                    tooltip: dimension
                                }
                            }
                        });
                    }
                });
                //this.chartPie.setOption(option);

            
            },/*
            drawCharts() {
                this.drawLineChart();
                this.drawPieChart();
                this.drawTableChart();
            },*/
        },
        created:function(){
            var _this = this;
            axios.get('http://120.79.12.163/usesignarea')
            .then(function (response) {
                _this.options = response.data.signarea;
                _this.value = response.data.signarea[0].value;
                _this.getLinedata();
                _this.getTabledata();
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        mounted: function () {
        },
        updated: function () {
        }
    }
</script>

<style scoped>
    .chart-container {
        width: 100%;
        float: left;
        background: white;
        border-radius: 20px;
    }
    /*.chart div {
        height: 400px;
        float: left;
    }*/

    .el-col {
        padding: 30px 20px;
    }
</style>
