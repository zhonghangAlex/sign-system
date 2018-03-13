<template>
	<section class="container">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="margin-bottom: 0px;">
			<el-form :inline="true" :model="filters" style="width:100%;" >
				<el-form-item>
					<el-input v-model="filters.search" placeholder="输入关键字查询"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getplaces(1)">查询</el-button>
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
			
				<el-upload  class="upload-demo" :limit=1  ref="upload" method="post" action="http://120.79.12.163/placefile"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" :on-preview="handlePreview"  :on-remove="handleRemove" :on-success="handleSuccess" :on-error="handleError" :on-progress="handlePro"  :file-list="fileList" :data="uploadform"  :auto-upload="false">
					<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
					<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
					<form method="get" action="http://120.79.12.163/placemodel" style="position:absolute; margin-top:-32px;right:20px;" >
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
		<el-table :data="place" fit  highlight-current-row :border="border" v-loading="listLoading" @selection-change="selsChange" style="width: 100%;margin-bottom:15px;" class="tablelist">
			<el-table-column fixed="left" type="selection" width="55" align="center" >
			</el-table-column>
			<el-table-column  fixed="left" type="index" :index="tableindex" label="ID" width="60" align="center">
			</el-table-column>
			<el-table-column prop="id" label="唯一IP标识" v-if="showIPsig" max-width="0" align="center"  sortable>
			</el-table-column>
			<el-table-column prop="place" label="地点" min-width="120" align="center" sortable>
			</el-table-column>
			<!--
			<el-table-column prop="sex" label="性别" width="100" align="center" :formatter="formatSex" sortable>
			</el-table-column>
			-->
			<el-table-column prop="room" label="编号" min-width="140" align="center" sortable>
			</el-table-column>
			<el-table-column prop="ip" label="IP地址" min-width="100" align="center" sortable>
			</el-table-column>
			<el-table-column prop="x" label="经度" min-width="120" align="center" sortable>
			</el-table-column>
			<el-table-column prop="y" label="纬度" min-width="120" align="center" sortable>
			</el-table-column>
			<el-table-column prop="dis" label="有效半径" min-width="120" align="center" sortable>
			</el-table-column>
			<el-table-column prop="kind" label="地点种类" min-width="120" align="center" sortable>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="150" align="center">
				<template slot-scope="scope"><!--<template scope="scope">-->
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
			<!--<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">-->
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false" >
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="地点" >
					<el-input v-model="editForm.place"  style="width:400px;"></el-input>
				</el-form-item>
				<el-form-item label="编号">
					<el-input v-model="editForm.room" :disabled='true' style="width:400px;"></el-input>
				</el-form-item>
				<el-form-item label="IP地址">
					<el-input v-model="editForm.ip" style="width:400px;"></el-input>
				</el-form-item>
				<el-form-item label="经度">
					<el-input v-model="editForm.x" style="width:400px;"></el-input>
				</el-form-item>
				<el-form-item label="纬度">
					<el-input v-model="editForm.y" style="width:400px;"></el-input>
				</el-form-item>
				<el-form-item label="有效半径">
					<el-input v-model="editForm.dis" style="width:400px;"></el-input>
				</el-form-item>
				<el-form-item label="地点种类">
					<el-input v-model="editForm.kind" style="width:400px;"></el-input>
				</el-form-item>
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="地点"  style="width:400px;">
					<el-input v-model="addForm.place" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="编号" prop="name" style="width:400px;">
					<el-input  v-model="addForm.room"></el-input>
				</el-form-item>
				<el-form-item label="IP地址" style="width:400px;">
					<el-input  v-model="addForm.ip"></el-input>
				</el-form-item>
				<el-form-item label="经度" style="width:400px;">
					<el-input  v-model="addForm.x"></el-input>
				</el-form-item>
				<el-form-item label="纬度" style="width:400px;">
					<el-input  v-model="addForm.y"></el-input>
				</el-form-item>
				<el-form-item label="有效半径" style="width:400px;">
					<el-input  v-model="addForm.dis"></el-input>
				</el-form-item>
				<el-form-item label="地点种类" style="width:400px;">
					<el-input  v-model="addForm.kind"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import axios from 'axios'
	import util from '../../common/util'
	//import NProgress from 'nprogress'
	export default {
		data() {
			return {
				//文件上传
				//fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
				fileList: [],
				limit:1,
				uploadform:{

				},
				fileimportVisible:false,
				//密码重置
				//getplaces相关
				filters: {
					search: ''
				},
				place: [],
				total: 0,
				page: 1,
				pagesize:10,
				border:false,
				listLoading: false,
				sels: [],//列表选中列
				showIPsig:false,
				//编辑页面相关
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					room: [
						{ required: true, message: '请输入编号', trigger: 'blur' }
					],
					place: [
						{ required: true, message: '请输入地点', trigger: 'blur' }
					],
					ip: [
						{ required: true, message: '请输入IP地址', trigger: 'blur' }
					],
					x: [
						{ required: true, message: '请输入经度', trigger: 'blur' }
					],
					y: [
						{ required: true, message: '请输入纬度', trigger: 'blur' }
					],
					dis: [
						{ required: true, message: '请输入有效半径', trigger: 'blur' }
					],
					kind: [
						{ required: true, message: '请输入地点类别', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id:'',
					ip: '',
					room:'',
					x:'',
					y:'',
					dis:'',
					place:'',
					kind:''
				},
				//编辑页面tag
				inputVisible: false,
				inputValue: '',

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					room: [
						{ required: true, message: '请输入编号', trigger: 'blur' }
					],
					place: [
						{ required: true, message: '请输入地点', trigger: 'blur' }
					],
					ip: [
						{ required: true, message: '请输入IP地址', trigger: 'blur' }
					],
					x: [
						{ required: true, message: '请输入经度', trigger: 'blur' }
					],
					y: [
						{ required: true, message: '请输入纬度', trigger: 'blur' }
					],
					dis: [
						{ required: true, message: '请输入有效半径', trigger: 'blur' }
					],
					kind: [
						{ required: true, message: '请输入地点类别', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					id:'',
					ip: '',
					room:'',
					x:'',
					y:'',
					dis:'',
					place:'',
					kind:''
				},
				//新增页面tag
				inputVisible2: false,
				inputValue2: '',

			}
		},
		methods: {
			//批量导入操作
			//显示批量导入页面
			handleimport(){
				this.fileimportVisible = true;
			},
			//excel下载
			exceldownload(){
				var _this = this;
				window.open("http://120.79.12.163/placemodel");
			},
			submitUpload() {
				this.$refs.upload.submit();
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handlePreview(file) {
				console.log(file);
			},
			handleSuccess(res, file, fileList){
				console.log(res);
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
				this.getplaces(0);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.page = val;
				this.getplaces(0);
				return 
			},

			//得到正确的index索引
			tableindex(index){
				index = (this.page-1)*this.pagesize+index+1;
				return index;
			},
			//获取用户列表
			getplaces(x) {
				var _this = this;
				this.listLoading = true;
				if(x==1){
					this.page = 1;
				}
				axios.get('http://120.79.12.163/getplace',{//http://120.79.12.163/getplace
					params: {
						page: _this.page,//查询参数
						pagesize:_this.pagesize,
						search: _this.filters.search//查询参数
					}
				})
				.then(function (response) {
					console.log(response);
					_this.total = response.data.count;
					_this.place = response.data.place;
					_this.listLoading = false;
				})
				.catch(function (error) {
					console.log(error);
				});
			},
			/*
			//密码重置
			handleresetpsd: function(index, row){
				var _this = this;
				//和删除一样的ID 接口位置sturesetpsd
				this.$confirm('确认要重置密码吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					axios.get('http://120.79.12.163/ordresetpsd',{
						params: {
							workid: '['+'\"'+row.workid+'\"'+']',
						}
					})
					.then(function (response) {
						console.log(response);
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
						_this.getplaces(0);
						_this.listLoading = false;
					})
					.catch(function (error) {
						console.log(error);
						_this.listLoading = false;
					});
				}).catch(() => {

				});

			},
			*/
			//删除
			handleDel: function (index, row) {
				var _this = this;
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					//this.listLoading = true;
					axios.get('http://120.79.12.163/placedelete',{
						params: {
							id: '['+'\"'+row.id+'\"'+']',
						}
					})
					.then(function (response) {
						console.log(response);
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
						_this.getplaces(0);
						_this.listLoading = false;
					})
					.catch(function (error) {
						console.log(error);
						_this.listLoading = false;
					});
				}).catch(() => {

				});
			},

			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
				console.log(this.editForm);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					id:'',
					ip: '',
					room:'',
					x:'',
					y:'',
					dis:'',
					place:'',
					kind:''
				};
			},
			/*
			//密码重置
			resetpsdSubmit: function (){
				var _this = this;
			},
			*/
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
							//for(var i=0; i<para.signno.length; i++){
							//	para.signno[i] ='\"'+para.signno[i]+'\"';
							//}
							//para.signno = '['+para.signno.toString()+']';
							para.way = 2;
							//para.signno 
							axios.get('http://120.79.12.163/placemodify',{params:para})
							.then(function (response) {
								console.log(response);
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
								_this.getplaces(0);
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

			//新增
			addSubmit: function () {
				var _this = this;
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							//para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							//for(var i=0; i<para.signno.length; i++){
							//	para.signno[i] ='\"'+para.signno[i]+'\"';
							//}
							//para.signno = '['+para.signno.toString()+']';
							para.way = 1;
							axios.get('http://120.79.12.163/placemodify',{params:para})
							.then(function (response) {
								console.log(response);
								var d = response.data;
								_this.addLoading = false;
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
								_this.$refs['addForm'].resetFields();
								_this.addFormVisible = false;
								_this.getplaces(0);
							})
							.catch(function (error) {
								console.log(error);
							});
						});
					}
				});
			},

			//新增页面的tag操作
			handleClose2(tag2) {
				this.addForm.signno.splice(this.addForm.signno.indexOf(tag2), 1);
			},
			showInput2() {
				this.inputVisible2 = true;
				this.$nextTick(_ => {
				this.$refs.saveTagInput.$refs.input.focus();
				});
			},
			handleInputConfirm2() {
				let inputValue2 = this.inputValue2;
				if (inputValue2) {
				this.addForm.signno.push(inputValue2);
				}
				this.inputVisible2 = false;
				this.inputValue2 = '';
			},

			selsChange: function (sels) {
				this.sels = sels;
			},
			
			
			
			//批量删除
			batchRemove: function () {
				var _this = this;
				var ids = this.sels.map(item => '\"'+item.id+'\"').toString();
				ids = '['+ids+']';
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					//this.listLoading = true;
					//NProgress.start();
					let para = { id: ids };
					console.log(para);
					axios.get('http://120.79.12.163/placedelete',{params:para})
					.then(function (response) {
						console.log(response);
						var d = response.data;
						_this.listLoading = false;
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
						_this.getplaces(0);
					})
					.catch(function (error) {
						console.log(error);
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getplaces(0);
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

