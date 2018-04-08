<template>
	<section class="container">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="margin-bottom: 0px;">
			<el-form :inline="true" :model="filters" style="width:100%;" >
				<el-form-item>
					<el-input v-model="filters.search" placeholder="输入关键字查询"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getsignareas(1)">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
				<el-form-item style="float:right; margin-right:0px;">
					<el-button  type="primary" @click="handleimport" >Excel批量导入</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--批量导入界面-->	
		<el-dialog title="Excel批量导入" :visible.sync ="fileimportVisible" :close-on-click-modal="false" >
			
				<el-upload  class="upload-demo" :limit=1  ref="upload" method="post" action="http://120.79.12.163/signareafile"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" :on-preview="handlePreview"  :on-remove="handleRemove" :on-success="handleSuccess" :on-error="handleError" :on-progress="handlePro"  :file-list="fileList" :data="uploadform"  :auto-upload="false">
					<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
					<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
					<form method="get" action="http://120.79.12.163/signareamodel" style="position:absolute; margin-top:-32px;right:20px;" >
						<el-button style="float:right" size="small"  type="success" native-type="submit" target="_blank">Excel模板下载</el-button>
					</form>
					<div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
				</el-upload>
			
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="fileimportVisible = false">取消</el-button>
				<el-button type="primary" @click.native="fileimportVisible = false">完成</el-button>
			</div>
		</el-dialog>

		<!--列表-->
		<el-table :data="signarea" fit  highlight-current-row :border="border" v-loading="listLoading" @selection-change="selsChange" style="width: 100%;margin-bottom:15px;" class="tablelist">
			<el-table-column fixed="left" type="selection" width="55" align="center" >
			</el-table-column>
			<el-table-column  fixed="left" type="index" :index="tableindex" label="ID" width="60" align="center">
			</el-table-column>
			<el-table-column prop="signno" label="签到域编号" min-width="120" align="center" sortable>
			</el-table-column>
			<el-table-column prop="stucount" label="学生数" min-width="120" align="center" sortable>
			</el-table-column>
			<el-table-column prop="workid" label="管理员工号" min-width="120" align="center" sortable>
			</el-table-column>
			<el-table-column prop="estabtime" label="签到域创建时间" min-width="200" align="center" sortable>
			</el-table-column>
			<el-table-column prop="signcount" label="已发布的次数" min-width="150" align="center" sortable>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="180" align="center">
				<template slot-scope="scope"><!--<template scope="scope">-->
					<el-button type="danger" size="small" @click="handledetail(scope.$index, scope.row,1)">详情</el-button>
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

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="签到域编号"  style="width:400px;">
					<el-input v-model="addForm.signno" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="管理员工号" style="width:400px;">
					<el-input  v-model="addForm.workid" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--详情界面-->
		<el-dialog title="详情界面" width="80%" :visible.sync ="detailFormVisible" :close-on-click-modal="false" >
			<el-form :model="detailsignarea" label-width="120px" :rules="detailFormRules" ref="editForm">
				<el-form-item label="签到域编号" >
					<el-input v-model="detailsignarea.signno" :disabled='true'  style="width:400px;"></el-input>
				</el-form-item>
				<el-form-item label="管理教师" >
					<el-input v-model="detailsignarea.name" :disabled='true'  style="width:400px;"></el-input>
				</el-form-item>
				<el-form-item label="学生查询">
					<el-input v-model="detailfilters.search"  placeholder="输入关键字查询" style="width:250px;"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handledetail(0)" style="position:absolute;margin-top:-62px;margin-left:260px;">查询</el-button>
				</el-form-item>
				<el-form-item label="签到域内学生">
					<el-tag  :key="tag.stuid" v-for="tag in detailsignarea.studentsname" closable :disable-transitions="false"  @close="handleClose(tag)">
						学号:&nbsp;{{tag.stuid}}&nbsp;&nbsp;姓名:&nbsp;{{tag.name}}					</el-tag>
					<el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"  @blur="handleInputConfirm"> <!--@keyup.enter.native="handleInputConfirm"-->
					</el-input>
					<el-button v-else class="button-new-tag" size="small" @click="showInput">点击添加新的学生</el-button>
				</el-form-item>
				<div style="margin-left:120px;color:red" class="el-upload__tip">新增学生时请按照“学号+空格+姓名”的格式输入</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary"  v-on:click="handledetailimport" style="position:absolute;left:50px;" >Excel批量导入</el-button>
				<el-button type="primary"  v-on:click="detailbatchRemove" >清空该签到域学生</el-button>
				<el-button type="primary"  v-on:click="detailSubmit" >提交学生修改</el-button>
				<el-button @click.native="detailFormVisible = false">关闭界面</el-button>
			</div>
		</el-dialog>
		<!--详情页导入界面-->	
		<el-dialog title="Excel批量导入" :visible.sync ="detailfileimportVisible" :close-on-click-modal="false" >
			
				<el-upload  class="upload-demo" :limit=1  ref="upload" method="post" action="http://120.79.12.163/detailareafile"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" :on-preview="handledetailPreview"  :on-remove="handledetailRemove" :on-success="handledetailSuccess" :on-error="handledetailError" :on-progress="handledetailPro"  :file-list="detailfileList" :data="detailuploadform"  :auto-upload="false">
					<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
					<el-button style="margin-left: 10px;" size="small" type="success" @click="detailsubmitUpload">上传到服务器</el-button>
					<form method="get" action="http://120.79.12.163/detailareamodel" style="position:absolute; margin-top:-32px;right:20px;" >
						<el-button style="float:right" size="small"  type="success" native-type="submit" target="_blank">Excel模板下载</el-button>
					</form>
					<div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
				</el-upload>
			
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="detailfileimportVisible = false">取消</el-button>
				<el-button type="primary" @click.native="detailfileimportVisible = false">完成</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import axios from 'axios'
	import util from '../../common/util'
	export default {
		data() {
			return {
				//文件上传
				fileList: [],
				limit:1,
				uploadform:{

				},
				fileimportVisible:false,
				//获取列表相关
				filters: {
					search: ''
				},
				signarea: [],
				total: 0,
				page: 1,
				pagesize:10,
				border:false,
				listLoading: false,
				sels: [],//列表选中列
				showIPsig:false,

				//新增页面相关
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					signno: [
						{ required: true, message: '请输入签到域编号', trigger: 'blur' }
					],
					workid: [
						{ required: true, message: '请输入签到域管理员工号', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					signno:'',
					name: '',
					workid:'',
					signcount:'0',
					studentsname:[]
				},
				//新增页面tag
				inputVisible2: false,
				inputValue2: '',

				//详情界面dialog相关数据//详情界面dialog相关数据//详情界面dialog相关数据
				//详情界面dialog相关数据//详情界面dialog相关数据//详情界面dialog相关数据
				//详情界面dialog相关数据//详情界面dialog相关数据//详情界面dialog相关数据
				detailtotal:0,
				detailpage:1,
				detailpagesize:10,

				detailFormVisible:false,
				detailFormRules: {//验证规则
				},
				//点击详情按钮时发送请求的数据空间
				//发送
				detailclicksend:{
					signno:'',
					workid:''
				},
				//接受及显示
				/*
				detailsignarea: {
					signno:'',
					name: '',
					studentsname:[]
				},
				*/
				detailsignarea:{
					signno:'',
					workid:'',
					studentsname:[]
				},
				//详情页tag
				inputVisible: false,
				inputValue: '',
				detailfilters: {
					search: ''
				},
				detailfileimportVisible:false,
				detailfileList: [],
				limit:1,
				detailuploadform:{

				},	
			}
		},
		methods: {
			//详情CRUD详情CRUD
			//详情CRUD详情CRUD
			//详情CRUD详情CRUD

			//详情页面excel下载
			handledetailimport(){
				this.detailfileimportVisible = true;
			},
			detailexceldownload(){
				var _this = this;
				window.open("http://120.79.12.163/detailareamodel");
			},
			detailsubmitUpload() {
				this.$refs.upload.submit();
			},
			handledetailRemove(file, fileList) {
			},
			handledetailPreview(file) {
			},
			handledetailSuccess(res, file, fileList){
				if(res.status==0){
					this.$message({
						message: res.message,
						type: 'error',
						duration:2000,
						showClose:true
					});
				}
				if(res.status==1){
					this.$message({
						message: res.message,
						type: 'success',
						duration:2000,
						showClose:true
					});
				}
			},
			handledetailError(err, file, fileList){
				
			},
			handledetailPro(event, file, fileList){
			},

			//显示详情页面  同时发送并获取数据
			handledetail: function(index, row, x){
				var _this = this;
				this.detailFormVisible = true;
				if(x==1){
					this.detailclicksend.signno = row.signno;
					this.detailclicksend.workid = row.workid;
				}
				var params = new URLSearchParams();
				params.append('page',_this.detailpage);
				params.append('pagesize',_this.detailpagesize);
				params.append('search',_this.detailfilters.search);
				params.append('signno',_this.detailclicksend.signno);
				params.append('workid',_this.detailclicksend.workid);

				axios.post('http://120.79.12.163/getareadetail',
					params
				)
				.then(function (response) {
					_this.detailtotal = response.data.detailsignarea.count;
					_this.detailsignarea = Object.assign({}, response.data.detailsignarea);
					_this.listLoading = false;
				})
				.catch(function (error) {
					console.log(error);
				});

			},
			//查询
			//详情页面的tag
			handleClose(tag) {
				this.detailsignarea.studentsname.splice(this.detailsignarea.studentsname.indexOf(tag), 1);
			},

			showInput() {
				this.inputVisible = true;
				this.$nextTick(_ => {
				this.$refs.saveTagInput.$refs.input.focus();
				});
			},

			handleInputConfirm() {
				var _this = this;
				let inputValue = this.inputValue;
				var arr = inputValue.split(" ");
				inputValue = {"stuid":arr[0],"name":arr[1]};
				if(arr.length!=2){
					_this.$message({
						message: "输入格式错误，请重新按照正确格式输入",
						type: 'error'
					});
				}
				else{
					if (inputValue) {
						this.detailsignarea.studentsname.push(inputValue);
					}
					this.inputVisible = false;
					this.inputValue = '';
				}
			},
			//清空学生
			detailbatchRemove(){
				this.$confirm('确认删除改签到域内所有学生吗?', '提示', {
					type: 'warning'
				}).then(() => {
				this.detailsignarea.studentsname = [];
				}).catch(() => {

				});
			},
			//提交学生详情的修改
			detailSubmit: function () {
				var _this = this;
				this.$confirm('确认提交修改后的学生信息吗？', '提示', {}).then(() => {
					let para = Object.assign({}, _this.detailsignarea);
					var tmp;
					var tmpareaname = '';
					for(let i=0; i<para.studentsname.length; i++){
						tmp = ','+'{'+'\"'+'stuid'+'\"'+':'+ '\"'+para.studentsname[i].stuid+'\"'+','+'\"'+'name'+'\"'+':'+ '\"'+para.studentsname[i].name+'\"'+'}';
						tmpareaname = tmpareaname + tmp;
					}
					tmpareaname = tmpareaname.slice(1); 
					para.studentsname = '['+tmpareaname+']';
					var params = new URLSearchParams()
					params.append('signno',para.signno)
					params.append('workid',para.workid)
					params.append('studentsname',para.studentsname)
					axios.post('http://120.79.12.163/detailareamodify',params)
					.then(function (response) {
						console.log(response);
						_this.editLoading = false;
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
						_this.handledetail(0);
					})
					.catch(function (error) {
						console.log(error);
					});
				});
					
			},

			//主界面CRUD//主界面CRUD//主界面CRUD
			//主界面CRUD//主界面CRUD//主界面CRUD
			//主界面CRUD//主界面CRUD//主界面CRUD
			//批量导入操作
			//显示批量导入页面
			handleimport(){
				this.fileimportVisible = true;
			},
			//excel下载
			exceldownload(){
				var _this = this;
				window.open("http://120.79.12.163/signareamodel");
			},
			submitUpload() {
				this.$refs.upload.submit();
			},
			handleRemove(file, fileList) {
			},
			handlePreview(file) {
			},
			handleSuccess(res, file, fileList){
				if(res.status==0){
					this.$message({
						message: res.message,
						type: 'error',
						duration:2000,
						showClose:true
					});
				}
				if(res.status==1){
					this.$message({
						message: res.message,
						type: 'success',
						duration:2000,
						showClose:true
					});
				}
			},
			handleError(err, file, fileList){
				
			},
			handlePro(event, file, fileList){
			},

			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			

			//分页器
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.pagesize = val;
				this.getsignareas(0);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.page = val;
				this.getsignareas(0);
				return 
			},

			//得到正确的index索引
			tableindex(index){
				index = (this.page-1)*this.pagesize+index+1;
				return index;
			},
			//获取用户列表
			getsignareas(x) {
				var _this = this;
				this.listLoading = true;
				if(x==1){
					this.page = 1;
				}
				axios.get('http://120.79.12.163/getsignarea',{//http://120.79.12.163/getsignarea
					params: {
						page: _this.page,//查询参数
						pagesize:_this.pagesize,
						search: _this.filters.search//查询参数
					}
				})
				.then(function (response) {
					_this.total = response.data.count;
					_this.signarea = response.data.signarea;
					_this.listLoading = false;
				})
				.catch(function (error) {
					console.log(error);
				});
			},

			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除
			handleDel: function (index, row) {
				var _this = this;
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					//this.listLoading = true;
					axios.get('http://120.79.12.163/signareadelete',{
						params: {
							signno: '['+'\"'+row.signno+'\"'+']',
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
						_this.getsignareas(0);
						_this.listLoading = false;
					})
					.catch(function (error) {
						console.log(error);
						_this.listLoading = false;
					});
				}).catch(() => {

				});
			},
			
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					signno:'',
					workid:'',
				};
			},

			//新增
			addSubmit: function () {
				var _this = this;
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
					
							axios.get('http://120.79.12.163/signareamodify',{params:para})
							.then(function (response) {
								var d = response.data;
								_this.addLoading = false;
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
								_this.$refs['addForm'].resetFields();
								_this.addFormVisible = false;
								_this.getsignareas(0);
							})
							.catch(function (error) {
								console.log(error);
							});
						});
					}
				});
			},
			
			
			//批量删除
			batchRemove: function () {
				var _this = this;
				var signnos = this.sels.map(item => '\"'+item.signno+'\"').toString();
				signnos = '['+signnos+']';
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					//this.listLoading = true;
					//NProgress.start();
					let para = { signno: signnos };
					axios.get('http://120.79.12.163/signareadelete',{params:para})
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
						_this.getsignareas(0);
					})
					.catch(function (error) {
						console.log(error);
					});
				}).catch(() => {

				});
			},
		},
		mounted() {
			this.getsignareas(0);
		}
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
	/*导入部分*/
	.el-upload__tip{
	}
	
	
</style>

