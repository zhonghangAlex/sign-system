<template>
    <section class="chart-container datastatistics">
        <center>
            <el-select v-model="value" placeholder="请选择您要查看的签到域" @change="pickchange()" style="margin-top:30px;width:200px;">
                <el-option v-for="item in options" id="click_op" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
             <el-date-picker @change="timechange()" value-format="yyyy-MM-dd HH:mm:ss" v-model="value_time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </center>
        <el-button  type="primary" @click.native="exceldownload()" style="right:30px;position:absolute;margin-top:-40px;" >数据导出</el-button>
        <el-row>
            <el-col :span="24">
                <div id="chartPie" style="width:100%; height:550px;"></div>
            </el-col>
            <el-col :span="24">
                <center><div id="chartTable" v-bind:style="{width:ewhith,height:etableheight}"></div></center>
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
                table_stuid:[],
                ewhith:'75%',
                etableheight:'',
                de_starttime:[],
                de_endtime:[],
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
                this.chartTable.resize();
            },
            exceldownload(){
                let _this = this;
                window.open('http://120.79.12.163/mallrecordexport?groupname='+_this.value+'&starttime='+_this.starttime+'&endtime='+_this.endtime)
            },
            pickchange(){
                let _this = this;
                _this.getLinedata();
                _this.getTabledata();
            },
            getLinedata(){
                let _this = this;
                axios.get('http://120.79.12.163/msignareacount?signarea='+_this.value+'&starttime='+_this.starttime+'&endtime='+_this.endtime)
                .then(function (response) {
                    _this.linedata = [];
                    _this.linetime = [];
                    _this.linedatafail = [];
                    for(let i=0; i<response.data.record.length; i++){
                        _this.linetime[0] = "签到情况";
                        _this.linedata[0] = "签到成功的人数";
                        _this.linedatafail[0] ="未签到人数";
                        _this.linetime[i+1] = response.data.record[i].endtime;
                        _this.linedata[i+1] = response.data.record[i].number;
                        _this.linedatafail[i+1] = response.data.total-response.data.record[i].number;
                    }
                    if(response.data.record.length==0){
                        _this.linedata = [];
                        _this.linetime = [];
                        _this.linedatafail = [];
                    }
                    _this.drawPieChart();
                    _this.chartTable.resize();
                })
                .catch(function (error) {
                    console.log(error);
                });
            },
            getTabledata(){
                let _this = this;
                axios.get('http://120.79.12.163/mgrouprecord?signarea='+_this.value+'&starttime='+_this.starttime+'&endtime='+_this.endtime)
                .then(function (response) {
                    _this.student = [];
                    _this.status_position = [];
                    _this.table_time = [];
                    if(response.data.student.length==0){
                        _this.student = ["暂无学生数据"];
                    }else{
                        let plength = response.data.student[0].time.length;
                        let stulength = response.data.student.length;
                        window.document.getElementById('chartTable').style.height = stulength*40+80+'px';

                        for(let i=0; i<response.data.student.length; i++){
                            _this.student[i] = response.data.student[i].name;
                            _this.table_stuid[i] = response.data.student[i].stuid;
                            for(let j=0; j<response.data.student[0].time.length; j++){
                                _this.status_position[i*plength+j] = response.data.student[i].time[j];
                                
                            }
                        }
                        for(let k=0; k<plength; k++){
                            _this.table_time[k] = '第'+(k+1)+'次';  
                            _this.de_starttime[k] = response.data.sign[k].starttime;  
                            _this.de_endtime[k] = response.data.sign[k].endtime;  
                        }
                            
                        
                    }
                    _this.drawTableChart();
                    _this.chartTable.resize();
                })
                .catch(function (error) {
                    console.log(error);
                });
            },
            changestatus(x){
                if(x==1){
                    return '未签到成功';
                }else{
                    return '签到成功';
                }
            },
            drawTableChart(){
                let _this = this;
                let hours = _this.table_time;
                let days = _this.student;
                let data = _this.status_position;
                data = data.map(function (item) {
                    return [item[1], item[0], item[2]];
                });
                this.chartTable = echarts.init(document.getElementById('chartTable'));
                this.chartTable.setOption({
                    title: {
                        text: '签到状况点阵图'
                    },
                    legend: {
                        data: ['Punch Card'],
                        left: 'right'
                    },
                    tooltip: {
                        position: 'top',
                        formatter: function (params) {
                            return  _this.table_time[params.value[0]]+_this.changestatus(params.value[2])+'<br>'+_this.table_stuid[params.value[1]]+'&nbsp;'+_this.student[params.value[1]]+'<br>'+'开始时间：'+_this.de_starttime[params.value[0]]+'<br>'+'截止时间：'+_this.de_endtime[params.value[0]] ;
                        }
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            show: true,
                            startValue: 0,
                            endValue: 14,
                            handleSize: 8,
                            minValueSpan:14,
                            maxValueSpan:14
                        },
                        {
                            type: 'inside',
                            endValue: 14,
                            handleSize: 8,
                            minValueSpan:14,
                            maxValueSpan:14
                        }
                    ],
                    grid: {
                        left: 2,
                        bottom: 40,
                        right: 20,
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: hours,
                        boundaryGap: false,
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#999',
                                type: 'dashed'
                            }
                        },
                        axisLine: {
                            show: false
                        },
                        position:'top'
                    },
                    yAxis: {
                        type: 'category',
                        data: days,
                        axisLine: {
                            show: false
                        },
                        axisLabel: {        
                            show: true,
                            margin:21
                            
                        },
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
                        name: '',
                        type: 'scatter',
                        symbolSize: function (val) {
                            return 30;
                        },
                        data: data,
                        animationDelay: function (idx) {
                            return idx * 5;
                        }
                    }]
                });
            },
            drawPieChart() {
                let _this = this;
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
                    dataZoom: [
                        {
                            type: 'slider',
                            show: true,
                            startValue: 0,
                            endValue: 8,
                            handleSize: 8,
                        },
                        {
                            type: 'inside',
                            startValue: 0,
                            endValue: 8,
                            handleSize: 8,
                        }
                    ],
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
                            let newParamsName = "";// 最终拼接成的字符串
                                let paramsNameNumber = params.length;// 实际标签的个数
                                let provideNumber = 10;// 每行能显示的字的个数
                                let rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
                                /**
                                 * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                                 */
                                // 条件等同于rowNumber>1
                                if (paramsNameNumber > provideNumber) {
                                    /** 循环每一行,p表示行 */
                                    for (let p = 0; p < rowNumber; p++) {
                                        let tempStr = "";// 表示每一次截取的字符串
                                        let start = p * provideNumber;// 开始截取的位置
                                        let end = start + provideNumber;// 结束截取的位置
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
                    yAxis: {gridIndex: 0,scale:true},
                    grid: {top: '55%',bottom:80},
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
                                formatter: '{b}: {@'+_this.linetime[1]+'} ({d}%)'
                            },
                            encode: {
                                itemName: _this.linetime[0],
                                value: _this.linetime[1],
                                tooltip: _this.linetime[1]
                            }
                        }
                    ]
                });
                this.chartPie.on('updateAxisPointer', function (event) {
                    let xAxisInfo = event.axesInfo[0];
                    if (xAxisInfo) {
                        let dimension = xAxisInfo.value + 1;
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
            },
        },
        created:function(){
            let _this = this;
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
            let _this = this;
            window.onresize = function(){
                _this.chartTable.resize();
                _this.chartPie.resize();
            };
            // window.onclick = function(){
            //    _this.chartTable.resize();
            // };
            // window.onmousemove = function(){
            //     _this.chartTable.resize();
            //  };
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
