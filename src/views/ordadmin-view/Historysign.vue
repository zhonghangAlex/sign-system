<template>
	<section class="container">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="margin-bottom: 0px;">
			<el-form :inline="true" :model="filters" style="width:100%;" >
				<el-form-item>
					<el-input @change="searchchange" v-model="filters.search"  placeholder="输入关键字查询"></el-input>
					
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getsign(1)">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="sign" fit  highlight-current-row :border="border" v-loading="listLoading" @selection-change="selsChange" style="width: 100%;margin-bottom:15px;" class="tablelist">
			<el-table-column fixed="left" type="selection" width="55" align="center" >
			</el-table-column>
			<el-table-column prop="id" label="唯一标识" v-if="showid" min-width="120" align="center" sortable>
			</el-table-column>
			<el-table-column prop="groupname" label="签到域名" min-width="120" align="center" sortable>
			</el-table-column>
			<el-table-column prop="place" label="签到地点" min-width="100" align="center" sortable>
			</el-table-column>
			<el-table-column prop="room" label="地点编号" min-width="120" align="center" sortable>
			</el-table-column>
			<el-table-column prop="kind" label="地点类别" min-width="120" align="center" sortable>
			</el-table-column>
			<el-table-column prop="sendtime" label="发布时间" width="200" align="center"  sortable>
			</el-table-column>
			<el-table-column prop="starttime" label="签到开始时间" min-width="200" align="center" sortable>
			</el-table-column>
			<el-table-column prop="endtime" label="签到结束时间" min-width="200" align="center" sortable>
			</el-table-column>
			<el-table-column prop="gap" label="循环周期" min-width="100" align="center" sortable>
			</el-table-column>
			<el-table-column prop="isip_bssid" label="是否开启BSSID验证" min-width="200" align="center" sortable>
			</el-table-column>
			<el-table-column prop="isqrcode" label="是否开启二维码验证" min-width="200" align="center" sortable>
			</el-table-column>
			<el-table-column prop="iscode" label="是否开启密令验证" min-width="170" align="center" sortable>
			</el-table-column>
			<el-table-column prop="x" label="经度" min-width="150" align="center" sortable>
			</el-table-column>
			<el-table-column prop="y" label="纬度" min-width="150" align="center" sortable>
			</el-table-column>
			<el-table-column prop="dis" label="签到半径" min-width="100" align="center" sortable>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="250" align="center">
				<template slot-scope="scope">
					<el-button type="danger" size="small"  @click="handledetailopen(scope.$index, scope.row,1)">详情</el-button>
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination class="pagebtn" :current-page="page" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" 
      :page-sizes="[5, 10, 15, 20]" :page-size="10" :total="parseInt(total)"  style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false" >
			<el-form :model="editForm" label-width="150px" :rules="editFormRules" ref="editForm">
				<el-form-item label="签到域名" >
					<el-input v-model="editForm.groupname"  style="width:400px;"></el-input>
				</el-form-item>
				<el-form-item label="发布时间" >
					<el-input v-model="editForm.sendtime" :disabled='true' style="width:400px;"></el-input>
				</el-form-item>
				<el-form-item label="开始时间">
					<el-input v-model="editForm.starttime"  style="width:400px;"></el-input>
				</el-form-item>
				<el-form-item label="结束时间">
					<el-input v-model="editForm.endtime" style="width:400px;"></el-input>
				</el-form-item>
				<el-form-item label="循环周期">
					<el-input v-model="editForm.gap" style="width:400px;"></el-input>
				</el-form-item>
				<el-form-item label="是否开启BSSID验证">
					<el-input v-model="editForm.isip_bssid" style="width:400px;"></el-input>
				</el-form-item>
				<el-form-item label="是否开启二维码验证">
					<el-input v-model="editForm.isqrcode" style="width:400px;"></el-input>
				</el-form-item>
				<el-form-item label="是否开启密令验证">
					<el-input v-model="editForm.iscode" style="width:400px;"></el-input>
				</el-form-item>
				<el-form-item label="签到地点">
					<el-input v-model="editForm.place" style="width:400px;"></el-input>
				</el-form-item>
				<el-form-item label="地点编号">
					<el-input v-model="editForm.room" style="width:400px;"></el-input>
				</el-form-item>
				<el-form-item label="地点类别">
					<el-input v-model="editForm.kind" style="width:400px;"></el-input>
				</el-form-item>
				<el-form-item label="经度">
					<el-input v-model="editForm.x" style="width:400px;"></el-input>
				</el-form-item>
				<el-form-item label="纬度">
					<el-input v-model="editForm.y" style="width:400px;"></el-input>
				</el-form-item>
				<el-form-item label="签到半径">
					<el-input v-model="editForm.dis" style="width:400px;"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--详情界面-->
		<el-dialog title="签到详情" width="80%" :visible.sync ="signdetailFormVisible" :close-on-click-modal="false" >
			<el-form :model="signdetail" label-width="220px" :rules="signdetailFormRules" ref="editForm">
				<el-form-item label="签到域编号" >
					<el-input v-model="signdetail.groupname" :disabled='true'  style="width:400px;"></el-input>
				</el-form-item>
				<el-form-item label="学生查询">
					<el-input v-model="signdetailfilters.search"  placeholder="输入关键字查询" style="width:250px;"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handledetailopen(0)" style="position:absolute;margin-top:-62px;margin-left:260px;">查询</el-button>
				</el-form-item>
				<el-form-item label="统计图">
					<div id="chartPie" style="width:60%; height:350px;"></div>
				</el-form-item>
				<el-form-item :label="labelsuccess">
					<el-tag  type="success" @close="handlesuccessClose(index)" :key="tag.stuid" v-for="(tag,index) in signdetail.signsuccess" closable :disable-transitions="false" >
						学号:&nbsp;{{tag.stuid}}&nbsp;&nbsp;姓名:&nbsp;{{tag.name}}</el-tag>
				</el-form-item>
				<el-form-item :label="labelfail">
					<el-tag type="danger" @close="handlefailClose(index)" :key="tag.stuid" v-for="(tag,index) in signdetail.signfail" closable :disable-transitions="false"  >
						学号:&nbsp;{{tag.stuid}}&nbsp;&nbsp;姓名:&nbsp;{{tag.name}}</el-tag>
				</el-form-item>
				<el-form-item label="详情导出">
					<el-button class="importexcel"  size="small" type="success" @click.native="importexcel">导出本次签到的Excel表</el-button>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="signdetailFormVisible = false">关闭界面</el-button>
			</div>
		</el-dialog>

		
	</section>
</template>

<script>
	import echarts from 'echarts'
	import axios from 'axios'
	import util from '../../common/util'
	//import NProgress from 'nprogress'
	export default {
		data() {
			return {
				showid:false,
				
				//getsign相关
				filters: {
					search: ''
				},
				sign: [],
				total: 0,
				page: 1,
				pagesize:10,
				border:false,
				listLoading: false,
				sels: [],//列表选中列

				//编辑页面相关
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					groupname: '',
					sendtime: '',
					starttime:'',
					endtime:'',
					gap:'',
					isip_bssid:'',
					isqrcode:'',
					iscode:'',
					place:'',
					room:'',
					kind:'',
					x:'',
					y:'',
					dis:''
				},
				//编辑页面tag
				inputVisible: false,
				inputValue: '',

				//详情相关
				signdetailFormVisible:false,
				signdetailFormRules:{

				},
				signdetailfilters:{
					search:''
				},
				//存储发送过来的detail信息
				signdetail:{},
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
		methods: {
			//详情相关
			//显示页面并初始化数据
			handlesuccessClose(index){
				//mchangesignstatus
				var _this = this;
				axios.get('http://120.79.12.163/mchangesignstatus?signid='+_this.detailsaveid+'&stuid='+_this.signdetail.signsuccess[index].stuid)
				.then(function (response) {
				})
				.catch(function (error) {
					console.log(error);
				});
				this.handledetailopen();
			},
			handlefailClose(index){
				//mchangesignstatus
				var _this = this;
				axios.get('http://120.79.12.163/mchangesignstatus?signid='+_this.detailsaveid+'&stuid='+_this.signdetail.signfail[index].stuid)
				.then(function (response) {
				})
				.catch(function (error) {
					console.log(error);
				});
				this.handledetailopen();
			},
			handledetailopen: function(index, row,x){
				var _this = this;
				_this.signdetailFormVisible = true;
				if(x==1){
					_this.detailsaveid = row.id;
				}
				axios.get('http://120.79.12.163/msigndetail?signid='+_this.detailsaveid+'&search='+_this.signdetailfilters.search)
				.then(function (response) {
					_this.signdetail = response.data;
					_this.signsuccesscount = response.data.successcount;
					_this.signfailcount = parseInt(response.data.totalcount)-parseInt(response.data.successcount);
					_this.drawCharts();
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
			

			//分页器
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.pagesize = val;
				this.getsign(0);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.page = val;
				this.getsign(0);
				return 
			},
			selsChange: function (sels) {
				this.sels = sels;
			},

			//得到正确的index索引
			tableindex(index){
				index = (this.page-1)*this.pagesize+index+1;
				return index;
			},
			searchchange(){
				this.getsign(1);
			},
			//获取用户列表
			getsign(x) {
				var _this = this;
				this.listLoading = true;
				if(x==1){
					this.page = 1;
				}
				axios.get('http://120.79.12.163/getsign',{//http://120.79.12.163/getstu
					params: {
						page: _this.page,//查询参数
						pagesize:_this.pagesize,
						search: _this.filters.search//查询参数
					}
				})
				.then(function (response) {
					_this.total = response.data.count;
					_this.sign = response.data.sign;
					_this.listLoading = false;
				})
				.catch(function (error) {
					console.log(error);
				});
			},
			
			//删除
			handleDel: function (index, row) {
				var _this = this;
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					//this.listLoading = true;
					axios.get('http://120.79.12.163/signdelete',{
						params: {
							id: '['+'\"'+row.id+'\"'+']',   
						}
					})
					.then(function (response) {
						var d = response.data;
						
						//NProgress.done();
						if(d.status==1)
						_this.$message({
							message: d.message,
							type: 'success'
						});
						if(d.status==0)
						_this.$message({
							message: d.message,
							type: 'error'
						});
						_this.getsign(0);
						_this.listLoading = false;
					})
					.catch(function (error) {
						console.log(error);
						_this.$message({
							message: "数据请求失败",
							type: 'error'
						});
						_this.listLoading = false;
					});
				}).catch(() => {

				});
			},

			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			
			//编辑
			editSubmit: function () {
				var _this = this;
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							//para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							
							//para.signno 
							axios.get('http://120.79.12.163/signmodify',{params:para})
							.then(function (response) {
								_this.editLoading = false;
								//NProgress.done();
								var d=response.data
								if(d.status==1)
								_this.$message({
									message: d.message,
									type: 'success'
								});
								if(d.status==0)
								_this.$message({
									message: d.message,
									type: 'error'
								});
								_this.$refs['editForm'].resetFields();
								_this.editFormVisible = false;
								_this.getsign(0);
							})
							.catch(function (error) {
								console.log(error);
							});
						});
					}
				});
			},
			//编辑页面的tag操作
			handleClose(tag) {
				this.editForm.signno.splice(this.editForm.signno.indexOf(tag), 1);
			},

			showInput() {
				this.inputVisible = true;
				this.$nextTick(_ => {
				this.$refs.saveTagInput.$refs.input.focus();
				});
			},

			handleInputConfirm() {
				let inputValue = this.inputValue;
				if (inputValue) {
				this.editForm.signno.push(inputValue);
				}
				this.inputVisible = false;
				this.inputValue = '';
			},
			
			//批量删除
			batchRemove: function () {
				var _this = this;
				var ids = this.sels.map(item => '\"'+item.id+'\"').toString();
				ids = '['+ids+']';
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					let para = { id: ids };
					axios.get('http://120.79.12.163/signdelete',{params:para})
					.then(function (response) {
						var d = response.data;
						_this.listLoading = false;
						if(d.status==1)
						_this.$message({
							message: d.message,
							type: 'success'
						});
						if(d.status==0)
						_this.$message({
							message: d.message,
							type: 'error'
						});
						_this.getsign(0);
					})
					.catch(function (error) {
						console.log(error);
						_this.$message({
							message: "数据请求失败",
							type: 'error'
						});
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getsign(0);
		},
		
	}

</script>

<style scoped>
	.container{
		width: 100%;
		height: 100%;
		left: 0;
		position: relative;
		top: 0;
		background-color: #81c1eb;
	}
	.tablelist{
		border-radius: 8px;
	}
	.el-tag + .el-tag {
		margin-left: 10px;
	}
	.button-new-tag {
		margin-left: 10px;
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
	}
	.input-new-tag {
		width: 90px;
		margin-left: 10px;
		vertical-align: bottom;
	}
	.toolbar{
		margin-bottom: 15px;
	}
	.pagebtn{
		background: #658aac;
		color:white;
		border-radius: 5px;
		border:2px solid #658aac;
	}
	.el-button--danger {
		color: #fff;
		background-color: #658aac;
		border-color: #658aac;
	}
	.el-button--danger.is-disabled{
		color: #fff;
		background-color: #658aacab;
		border-color: #658aacab;
	}
	.importexcel{
		position: absolute;
	}
	
	
</style>

