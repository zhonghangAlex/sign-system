<template>
    <section class="chart-container datastatistics">
        <center>
            <el-select v-model="value" placeholder="请选择您要查看的签到域" @change="pickchange()" style="margin-top:30px;width:400px;">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </center>
        <el-button  type="primary" style="right:30px;position:absolute;margin-top:-40px;" >数据导出</el-button>
        <el-row>
            <el-col :span="24">
                <center><div id="chartTable" style="width:100%;height:400px;border-radius:20px;overflow-y:yes;overflow-y:auto;"></div></center>
            </el-col>
            <el-col :span="12">
                <div id="chartLine" style="width:100%;height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chartPie" style="width:100%; height:400px;"></div>
            </el-col>
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
                value:'信管16级',
                //状态点阵图
                student:[],
                status_position:[],
                //折线图数据存储
                total:'',
                linetime:[],
                linedata:[],

            }
        },

        methods: {
            pickchange(){
                this.getLinedata()
                this.getTabledata()
            },
            getLinedata(){
                var _this = this;
                axios.get('http://120.79.12.163/msignareacount?signarea='+_this.value)
                .then(function (response) {
                    
                    for(var i=0; i<response.data.record.length; i++){
                        _this.linetime[i] = response.data.record[i].endtime;
                        _this.linedata[i] = response.data.record[i].number;
                    }
                    
                    if(response.data.record.length==0){
                        _this.linedata = [];
                        _this.linetime = [];
                    }
                    _this.drawLineChart();
                })
                .catch(function (error) {
                    console.log(error);
                });
            },
            getTabledata(){
                var _this = this;
                axios.get('http://120.79.12.163/mgrouprecord?signarea='+_this.value)
                .then(function (response) {
                    _this.student = [];
                    for(var i=0; i<response.data.student.length; i++){
                        _this.student[i] = response.data.student[i].name;
                    }
                    
                    if(response.data.student.length==0){
                        _this.student = ["暂无学生数据"];
                    }
                    _this.drawTableChart();
                    
                    
                })
                .catch(function (error) {
                    console.log(error);
                });
            },
            drawTableChart(){
                var _this = this;
                var times = [];
                var data = [[0,0,0],[0,1,0],[0,2,0],[0,3,0],[0,4,0],[0,5,0],[0,6,0],[0,7,0],[0,8,0],[0,9,0],[0,10,0],[0,11,2],[0,12,4],[0,13,1],[0,14,1],[0,15,3],[0,16,4],[0,17,6],[0,18,4],[0,19,4],[0,20,3],[0,21,3],[0,22,2],[0,23,5],[1,0,7],[1,1,0],[1,2,0],[1,3,0],[1,4,0],[1,5,0],[1,6,0],[1,7,0],[1,8,0],[1,9,0],[1,10,5],[1,11,2],[1,12,2],[1,13,6],[1,14,9],[1,15,11],[1,16,6],[1,17,7],[1,18,8],[1,19,12],[1,20,5],[1,21,5],[1,22,7],[1,23,2],[2,0,1],[2,1,1],[2,2,0],[2,3,0],[2,4,0],[2,5,0],[2,6,0],[2,7,0],[2,8,0],[2,9,0],[2,10,3],[2,11,2],[2,12,1],[2,13,9],[2,14,8],[2,15,10],[2,16,6],[2,17,5],[2,18,5],[2,19,5],[2,20,7],[2,21,4],[2,22,2],[2,23,4],[3,0,7],[3,1,3],[3,2,0],[3,3,0],[3,4,0],[3,5,0],[3,6,0],[3,7,0],[3,8,1],[3,9,0],[3,10,5],[3,11,4],[3,12,7],[3,13,14],[3,14,13],[3,15,12],[3,16,9],[3,17,5],[3,18,5],[3,19,10],[3,20,6],[3,21,4],[3,22,4],[3,23,1],[4,0,1],[4,1,3],[4,2,0],[4,3,0],[4,4,0],[4,5,1],[4,6,0],[4,7,0],[4,8,0],[4,9,2],[4,10,4],[4,11,4],[4,12,2],[4,13,4],[4,14,4],[4,15,14],[4,16,12],[4,17,1],[4,18,8],[4,19,5],[4,20,3],[4,21,7],[4,22,3],[4,23,0],[5,0,2],[5,1,1],[5,2,0],[5,3,3],[5,4,0],[5,5,0],[5,6,0],[5,7,0],[5,8,2],[5,9,0],[5,10,4],[5,11,1],[5,12,5],[5,13,10],[5,14,5],[5,15,7],[5,16,11],[5,17,6],[5,18,0],[5,19,5],[5,20,3],[5,21,4],[5,22,2],[5,23,0],[6,0,1],[6,1,0],[6,2,0],[6,3,0],[6,4,0],[6,5,0],[6,6,0],[6,7,0],[6,8,0],[6,9,0],[6,10,1],[6,11,0],[6,12,2],[6,13,1],[6,14,3],[6,15,4],[6,16,0],[6,17,0],[6,18,0],[6,19,0],[6,20,1],[6,21,2],[6,22,2],[6,23,6]];
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
                        height: '90%',
                        y: '10%'
                    },
                    xAxis: {
                        type: 'category',
                        data: times,
                        splitArea: {
                            show: true
                        }
                    },
                    yAxis: {
                        type: 'category',
                        data: _this.student,
                        splitArea: {
                            show: true
                        }
                    },
                    visualMap: {
                        type:'piecewise',
                        min: 1,
                        max: 2,
                        splitNumber: 2,
                        color: ['#f56c6c','#67c23a'],
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
            drawLineChart() {
                var _this = this;
                
                this.chartLine = echarts.init(document.getElementById('chartLine'));
                this.chartLine.setOption({
                    title: {
                        text: _this.value+'历次签到人数统计'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: [ '历次实到人数']
                    },
                    grid: {
                        left: '2%',
                        right:'31',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none'
                            },
                            dataView: {readOnly: false},
                            magicType: {type: ['line', 'bar']},
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: _this.linetime,
                        /*
                        axisLabel:{  
                            interval:0,//横轴信息全部显示  
                            rotate:-20,//-30度角倾斜显示  
                        } */
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
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '实到人数',
                            type: 'line',
                            stack: '总量',
                            data: _this.linedata
                        }
                    ]
                });
            },
            drawPieChart() {
                var _this = this;
                this.chartPie = echarts.init(document.getElementById('chartPie'));
                this.chartPie.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data:['实到人数','缺勤人数']
                    },
                    series: [
                        {
                            name:'详情信息',
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
                                {value:25, name:'实到人数'},
                                {value:36, name:'缺勤人数'}
                            ]
                        }
                    ]
                });
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
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        mounted: function () {
            //this.getsignareapick();
            this.getLinedata();
            this.getTabledata();
            //this.drawCharts();
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
