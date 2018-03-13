<template>
	<section class="container">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="margin-bottom: 0px;">
			<el-form :inline="true" :model="filters" style="width:100%;" >
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
				<el-form-item style="float:right; margin-right:0px;">
					<el-button type="primary" @click="handleimport" >导入</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" fit  highlight-current-row :border="border" v-loading="listLoading" @selection-change="selsChange" style="width: 100%;margin-bottom:15px;" class="tablelist">
			<el-table-column fixed="left" type="selection" width="55" align="center" >
			</el-table-column>
			<el-table-column fixed="left" type="index" label="ID" width="60" align="center">
			</el-table-column>
			<el-table-column prop="name" label="姓名" min-width="120" align="center" sortable>
			</el-table-column>
			<el-table-column prop="classnum" label="班级" min-width="100" align="center" sortable>
			</el-table-column>
			<el-table-column prop="phone" label="电话" min-width="120" align="center" sortable>
			</el-table-column>
			<el-table-column prop="stuid" label="学号" min-width="140" align="center" sortable>
			</el-table-column>
			<!--<el-table-column prop="sex" label="性别" width="100" align="center" :formatter="formatSex" sortable>
			</el-table-column>-->
			<el-table-column prop="password"  label="登录密码" min-width="100" align="center" sortable>
			</el-table-column>
			<el-table-column label="签到域号" min-width="300" max-width="500" align="center" sortable>
				<template slot-scope="scope">
					<el-tag :key="taglist" v-for="taglist in users[scope.$index].signno" >
						{{taglist}}
					</el-tag>
				</template>
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
			<el-pagination class="pagebtn" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage1"
      :page-sizes="[5, 10, 15, 20]" :page-size="10" :total="parseInt(total)"  style="float:right;">
			<!--<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">-->
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false" >
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off" style="width:400px;"></el-input>
				</el-form-item>
				<!--
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				-->
				<el-form-item label="班级">
					<el-input v-model="editForm.classnum" style="width:400px;"></el-input>
				</el-form-item>
				<el-form-item label="电话">
					<el-input v-model="editForm.phone" style="width:400px;"></el-input>
				</el-form-item>
				<el-form-item label="学号">
					<el-input v-model="editForm.stuid" style="width:400px;"></el-input>
				</el-form-item>
				<el-form-item label="登录密码">
					<el-input v-model="editForm.password" style="width:400px;"></el-input>
				</el-form-item>
				<el-form-item label="签到域号">
					<el-tag :key="tag" v-for="tag in editForm.signno" closable :disable-transitions="false" @close="handleClose(tag)">
						{{tag}}
					</el-tag>
					<el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
					</el-input>
					<el-button v-else class="button-new-tag" size="small" @click="showInput">点击添加新的签到域</el-button>
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
				<el-form-item label="姓名" prop="name" style="width:400px;">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<!--
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				-->
				<el-form-item label="班级" style="width:400px;">
					<el-input  v-model="addForm.classnum" width="200"></el-input>
				</el-form-item>
				<el-form-item label="电话" style="width:400px;">
					<el-input  v-model="addForm.phone"></el-input>
				</el-form-item>
				<el-form-item label="学号" style="width:400px;">
					<el-input  v-model="addForm.stuid"></el-input>
				</el-form-item>
				<el-form-item label="登录账号" style="width:400px;">
					<el-input  v-model="addForm.password"></el-input>
				</el-form-item>
				<el-form-item label="签到域号" style="width:400px;">
					<el-tag :key="tag2" v-for="tag2 in addForm.signno" closable :disable-transitions="false" @close="handleClose2(tag2)">
						{{tag2}}
					</el-tag>
					<el-input class="input-new-tag" v-if="inputVisible2" v-model="inputValue2" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm2" @blur="handleInputConfirm2">
					</el-input>
					<el-button v-else class="button-new-tag" size="small" @click="showInput2">点击添加新的签到域</el-button>
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
				//getUsers相关
				filters: {
					name: ''
				},
				users: [],
				total: 0,
				page: 1,
				border:false,
				listLoading: false,
				sels: [],//列表选中列

				currentPage1:1,
				//编辑页面相关
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					sex: '',
					age: 0,
					birth: '',
					addr: '',
					signno:'',
					classnum:'',
					stuid:'',
					password:'',
					phone:''
				},
				//编辑页面tag
				inputVisible: false,
				inputValue: '',

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: '',
					signno:'',
					classnum:'',
					stuid:'',
					password:'',
					phone:''
				},
				//新增页面tag
				inputVisible2: false,
				inputValue2: '',

			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				var _this = this;
				this.listLoading = true;
				axios.get('/api/userform',{
					params: {
						page: _this.page,//查询参数
						name: _this.filters.name//查询参数
					}
				})
				.then(function (response) {
					console.log(response);
					_this.total = response.data.total;
					_this.users = response.data.users;
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
					this.listLoading = true;
					axios.get('/api/userform',{
						params: {
							id: row.id,//查询参数
						}
					})
					.then(function (response) {
						console.log(response);
						_this.listLoading = false;
						//NProgress.done();
						_this.$message({
							message: '删除成功',
							type: 'success'
						});
						_this.getUsers();
					})
					.catch(function (error) {
						console.log(error);
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
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: '',
					signno:[],
					classnum:'',
					stuid:'',
					password:'',
					phone:''
				};
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
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							
							axios.get('/api/userform',{params:para})
							.then(function (response) {
								console.log(response);
								_this.editLoading = false;
								//NProgress.done();
								_this.$message({
									message: '提交成功',
									type: 'success'
								});
								_this.$refs['editForm'].resetFields();
								_this.editFormVisible = false;
								_this.getUsers();
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
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							
							axios.get('/api/userform',{params:para})
							.then(function (response) {
								console.log(response);
								_this.addLoading = false;
								//NProgress.done();
								_this.$message({
									message: '提交成功',
									type: 'success'
								});
								_this.$refs['addForm'].resetFields();
								_this.addFormVisible = false;
								_this.getUsers();
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
			//批量导入操作
			handleimport(){

			},
			//批量删除
			batchRemove: function () {
				var _this = this;
				var stuids = this.sels.map(item => item.stuid).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { stuids: stuids };
					axios.get('/api/userform',{params:para})
					.then(function (response) {
						console.log(response);
						_this.listLoading = false;
						//NProgress.done();
						_this.$message({
							message: '删除成功',
							type: 'success'
						});
						_this.getUsers();
					})
					.catch(function (error) {
						console.log(error);
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getUsers();
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
	
	
</style>

