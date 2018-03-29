<template>
    <section class="chart-container datastatistics">
        <center>
            <el-select v-model="value" placeholder="请选择您要查看的签到域" @change="getLinedata()" style="margin-top:30px;width:400px;">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </center>
        <el-button  type="primary" style="right:30px;position:absolute;margin-top:-40px;" >数据导出</el-button>
        <el-row>
            <el-col :span="24">
                <div id="chartTable" style="width:100%;height:550px;border-radius:20px;overflow-y:yes;overflow-y:auto;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chartLine" style="width:100%; height:400px;"></div>
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
                value:'',

                //折线图数据存储
                linetime:[],
                linedata:[]
            }
        },

        methods: {
            getsignareapick(){
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
            getLinedata(){
                var _this = this;
                axios.get('http://120.79.12.163/msignareacount?signarea='+_this.value)
                .then(function (response) {
                    for(var i=0; i<response.data.records.length; i++){
                        _this.linetime[i] = response.data.records[i].endtime;
                        _this.linedata[i] = response.data.records[i].number;
                    }
                    console.log(_this.linetime);
                })
                .catch(function (error) {
                    console.log(error);
                });
            },
            drawTableChart(){
                var _this = this;
                function getVirtulData(year) {
                    year = year || '2018';
                    var date = +echarts.number.parseDate(year + '-01-01');
                    var end = +echarts.number.parseDate((+year + 1) + '-01-01');
                    var dayTime = 3600 * 24 * 1000;
                    var data = [];
                    for (var time = date; time < end; time += dayTime) {
                        data.push([
                            echarts.format.formatTime('yyyy-MM-dd', time),
                            Math.floor(6000)
                        ]);
                    }
                    return data;
                }
                var data = getVirtulData(2018);
                this.chartTable = echarts.init(document.getElementById('chartTable'));
                this.chartTable.setOption({
                    backgroundColor: '#658aac',//#404a59
                    title: {
                        top: 30,
                        text: _this.value+'签到域的签到情况',
                        subtext: '数据为实时收集',
                        left: 'center',
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    tooltip : {
                        trigger: 'item'
                    },
                    legend: {
                        top: '30',
                        left: '100',
                        data:['签到成功', '未成功签到'],
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    calendar: [{
                        top: 100,
                        left: 'center',
                        range: ['2018-03-01', '2018-07-15'],
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#fff',
                                width: 2,
                                type: 'solid'
                            }
                        },
                        yearLabel: {
                            formatter: '{start}  1st',
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#323c48',
                                borderWidth: 1,
                                borderColor: '#111'
                            }
                        }
                    }, {
                        top: 340,
                        left: 'center',
                        range: ['2018-03-01', '2018-07-15'],
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#fff',
                                width: 2,
                                type: 'solid'
                            }
                        },
                        yearLabel: {
                            formatter: '{start}  2nd',
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#323c48',
                                borderWidth: 1,
                                borderColor: '#111'
                            }
                        }
                    }],
                    series : [
                        {
                            name: '签到成功',
                            type: 'scatter',
                            coordinateSystem: 'calendar',
                            data: data,
                            symbolSize: function (val) {
                                return val[1] / 500;
                            },
                            itemStyle: {
                                normal: {
                                    color: '#70e933'
                                }
                            }
                        },
                        {
                            name: '签到成功',
                            type: 'scatter',
                            coordinateSystem: 'calendar',
                            calendarIndex: 1,
                            data: data,
                            symbolSize: function (val) {
                                return val[1] / 500;
                            },
                            itemStyle: {
                                normal: {
                                    color: '#70e933'
                                }
                            }
                        },
                        {
                            name: '未成功签到',
                            type: 'effectScatter',
                            coordinateSystem: 'calendar',
                            calendarIndex: 1,
                            data: data.sort(function (a, b) {
                                return b[1] - a[1];
                            }).slice(0, 12),
                            symbolSize: function (val) {
                                return val[1] / 500;
                            },
                            showEffectOn: 'render',
                            rippleEffect: {
                                brushType: 'stroke'
                            },
                            hoverAnimation: true,
                            itemStyle: {
                                normal: {
                                    color: '#f56c6c',
                                    shadowBlur: 10,
                                    shadowColor: '#333'
                                }
                            },
                            zlevel: 1
                        },
                        {
                            name: '未成功签到',
                            type: 'effectScatter',
                            coordinateSystem: 'calendar',
                            data: data.sort(function (a, b) {
                                return b[1] - a[1];
                            }).slice(0, 12),
                            symbolSize: function (val) {
                                return val[1] / 500;
                            },
                            showEffectOn: 'render',
                            rippleEffect: {
                                brushType: 'stroke'
                            },
                            hoverAnimation: true,
                            itemStyle: {
                                normal: {
                                    color: '#f56c6c',
                                    shadowBlur: 10,
                                    shadowColor: '#333'
                                }
                            },
                            zlevel: 1
                        }
                    ]
                });
            },
            
            drawLineChart() {
                this.chartLine = echarts.init(document.getElementById('chartLine'));
                this.chartLine.setOption({
                    title: {
                        text: '历次签到人数统计'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: [ '历次实到人数']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: [ '2018-02-11', '2018-02-15', '2018-02-25', '2018-03-15', '2018-03-27']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '实到人数',
                            type: 'line',
                            stack: '总量',
                            data: [102, 99, 108, 101, 94]
                        }
                    ]
                });
            },
            drawPieChart() {
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
                                {value:79, name:'实到人数'},
                                {value:12, name:'缺勤人数'}
                            ]
                        }
                    ]
                });
            },
            drawCharts() {
                this.drawLineChart()
                this.drawPieChart()
                this.drawTableChart()
            },
        },

        mounted: function () {
            this.getsignareapick()
            this.drawCharts()
            this.getLinedata()
        },
        updated: function () {
            this.drawCharts()
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
