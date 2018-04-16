<template>
	<el-row class="container">
        <div class="header-back"></div>
		<el-col :span="24" class="header" >
			<el-col :span="14" class="logo" >
                <span class="sysname">{{sysName}}</span>
				<img src="../../static/img/logo-l.png" class="syslogo"/>
			</el-col>
			<el-col :span="10" class="userinfo" >
				<span class=" userinfo-inner"> {{sysUserName}}Welcome&nbsp;尊敬的{{ ordname }}老师</span>
				<el-dropdown trigger="hover" >
                    <div class=" el-dropdown-link userinfo-icon"></div>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>系统消息</el-dropdown-item>
                        <el-dropdown-item @click.native="handleinfo">我的信息</el-dropdown-item>
                        <!-- <el-dropdown-item @click.native="handlemodel">模板下载</el-dropdown-item> -->
						<el-dropdown-item @click.native="handlepsdchange">密码修改</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="out-main" >
			<aside >
				<!--导航菜单-->
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo"  unique-opened router  >
					<template>
							<el-menu-item v-for="item in $router.options.routes[2].children" :index="item.path" :key="item.path" ><i :class="item.iconCls"></i>{{item.name}}</el-menu-item>
                    </template>
				</el-menu>
			</aside>
			<section class="content-container" >
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title" >{{$route.name}}</strong>
						<el-breadcrumb separator=">" class="breadcrumb-inner" v-if="$route.name!='Super-admin'">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path" class="child-menu" >
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
                    <img src="../../static/img/logo-big.png" class="logo-big"/>
					<el-col :span="24" class="content-wrapper">
                        
						<transition name="fade"><!--切换视图区，过渡效果-->
							<router-view class="move-view"></router-view>
						</transition>
                        <!--导入模板集中下载-->
                        <el-dialog title="管理员导入下载模板" width="700px" :visible.sync ="modeldownloadVisible" :close-on-click-modal="false" >
                            <form method="get" action="http://120.79.12.163/placemodel"  >
                                <el-button style="float:left;margin-right:23px;" size="small"  type="success" native-type="submit" target="_blank">IP及GPS管理</el-button>
                            </form>
                            <form method="get" action="http://120.79.12.163/signareamodel"  >
                                <el-button style="float:left;margin-right:23px;" size="small"  type="success" native-type="submit" target="_blank">签到域管理主页</el-button>
                            </form>
                            <form method="get" action="http://120.79.12.163/detailareamodel" >
                                <el-button style="float:left;margin-right:23px;" size="small"  type="success" native-type="submit" target="_blank">签到域管理详情</el-button>
                            </form>
                            <form method="get" action="http://120.79.12.163/ordmodel"  >
                                <el-button style="float:left;margin-right:23px;" size="small"  type="success" native-type="submit" target="_blank">普通管理员</el-button>
                            </form>
                            <form method="get" action="http://120.79.12.163/stumodel">
                                <el-button style="float:left" size="small"  type="success" native-type="submit" target="_blank">学生管理员</el-button>
                            </form>
                            <div slot="footer" style="margin-top:20px;" class="dialog-footer">
                                <el-button type="primary" @click.native="modeldownloadVisible = false">关闭界面</el-button>
                            </div>
                        </el-dialog>
                        <!--密码修改界面-->
                        <el-dialog title="管理员密码修改" width="50%" :visible.sync ="psdchangeVisible" :close-on-click-modal="false" >
                            <el-form :model="psdFormRules" label-width="150px" :rules="psdRules" ref="psdFormRules"  class="demo-ruleForm" status-icon>
                                <el-form-item label="请输入原密码" prop="oldPass">
                                    <el-input type="password" v-model="psdFormRules.oldPass" auto-complete="off"  style="width:400px;"></el-input>
                                </el-form-item>
                                <el-form-item label="请输入新密码" prop="newPass">
                                    <el-input type="password" v-model="psdFormRules.newPass" auto-complete="off"  style="width:400px;"></el-input>
                                </el-form-item>
                                <el-form-item label="请再次输入新密码" prop="checkPass">
                                    <el-input type="password" v-model="psdFormRules.checkPass" auto-complete="off" style="width:400px;"></el-input>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" style="margin-top:20px;" class="dialog-footer">
                                <el-button type="primary" @click="psdchangeSubmit()">提交修改</el-button>
                                <el-button type="primary" @click="psdchangeReset('psdFormRules')">重置</el-button>
                            </div>
                        </el-dialog>
                        <!-- 我的信息 -->
                        <el-dialog title="我的信息" width="50%" :visible.sync ="myinfoVisible" :close-on-click-modal="false" >
                            <el-form v-model="ordmyinfo" label-width="150px"   class="demo-ruleForm" >
                                <el-form-item  >
                                    <center><div style="width:150px;height:150px;border-radius:50%;background:url(../../static/img/boy.png);background-size:cover;margin-left:-100px;"></div></center>
                                </el-form-item>
                                <el-form-item label="管路员工号" >
                                    <el-input  v-model="ordmyinfo.workid" auto-complete="off"  style="width:400px;"></el-input>
                                </el-form-item>
                                <el-form-item label="姓名" >
                                    <el-input  v-model="ordmyinfo.name" auto-complete="off"  style="width:400px;"></el-input>
                                </el-form-item>
                                <el-form-item label="单位">
                                    <el-input  v-model="ordmyinfo.workplace" auto-complete="off"  style="width:400px;"></el-input>
                                </el-form-item>
                                <el-form-item label="电话">
                                    <el-input v-model="ordmyinfo.phone" auto-complete="off" style="width:400px;"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-dialog>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        let validatePass0 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入旧密码'));
            }else{
                callback();
            }
        };
        let validatePass1 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入新密码'));
            } else {
                if (this.psdFormRules.checkPass !== '') {   
                    this.$refs.psdFormRules.validateField('checkPass');
                }
                callback();
            }
        };
        let validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入新密码'));
            } else if (value !== this.psdFormRules.newPass) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            
            sysName: "高校智能定位签到系统",
            sysUserName: "",
            sysUserAvatar: "",
            syslogo:"../../static/img/logo-l.png",
            form: {
                name: "",
                region: "",
                date1: "",
                date2: "",
                delivery: false,
                type: [],
                resource: "",
                desc: ""
            },

            //导入模板集中下载
            modeldownloadVisible:false,

            //密码修改界面相关
            psdchangeVisible:false,
            psdFormRules:{
                oldPass:'',
                newPass:'',
                checkPass:''
            },
            psdRules: {
                oldPass: [
                    { validator: validatePass0, trigger: 'blur' }
                ],
                newPass: [
                    { validator: validatePass1, trigger: 'blur' }
                ],
                checkPass: [
                    { validator: validatePass2, trigger: 'blur' }
                ]
            },
            //我的信息相关
            myinfoVisible:false,
            ordname:'',
            ordmyinfo:{

            }
        };
    },
    methods: {
        initinfo(){
            
        },
        onSubmit() {
            console.log('submit!');
        },
        //退出登录
        logout: function() {
            let _this = this;
            this.$confirm("确认退出吗?", "提示", {
            })
            .then(() => {
                axios.get('http://120.79.12.163/exitlogin',{
                    params: {
                    }
                })
                .then(() => {
                
                })
                .catch(() => {});
                _this.$router.push("/");
            })
        },
        //显示我的信息界面
        handleinfo(){
            this.myinfoVisible = true;
        },
        //显示批量导入界面
        handlemodel(){
            this.modeldownloadVisible = true;
        },
        //显示密码修改界面
        handlepsdchange(){
            this.psdchangeVisible = true;
        },
        psdchangeSubmit(){
            let _this = this;
            this.$refs.psdFormRules.validate((valid) => {
                if(valid){
                    this.$confirm('确认修改密码吗?', '提示', {
                        type: 'warning'
                    }).then(() => {
                        let params = new URLSearchParams()
                        params.append('oldpassword',_this.psdFormRules.oldPass)
                        params.append('newpassword',_this.psdFormRules.newPass)
                        axios.post('http://120.79.12.163/setpassword',params)
                        .then(function (response) {
                            let d = response.data;
                            if(d.status==1){
                                _this.$message({
                                    message: d.message,
                                    type: 'success'
                                });
                                _this.psdchangeVisible = false;
                                _this.$router.push("/");
                            }
                        
                            if(d.status==0)
                            _this.$message({
                                message: d.message,
                                type: 'error'
                            });
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
                
            });
        },
        psdchangeReset(){
            this.$refs.psdFormRules.resetFields();
            
        }
    },
    mounted(){
        let _this = this;
        axios.get('http://120.79.12.163/getcurrentinfo')
        .then(function (response) {
            _this.ordname = response.data.name;
            _this.ordmyinfo = response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
    }
};
</script>

<style scoped >
    .syslogo{
        top: 5px;
        left: 25px;
        height: 60px;
        position: absolute;
        z-index: 100;
    }
    .container {
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 100%;
        background: #81c1eb;
    }
    .header {
        height: 70px;
        line-height: 70px;
        background: #fff;
        color: #fff;
        box-shadow: 0 0 20px #444;
    }
    .userinfo {
        height: 70px;
        line-height: 70px;
        text-align: right;
        padding-right: 15px;
        float: right;
    }
    .userinfo-inner {
        right:20px ;
        position: relative;
        color: #658aac;
        font-weight: 1000;
    }
    .userinfo-icon{
        cursor: pointer;
        top:1px;
        right: 15px;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: #658aac;
        position: relative;
    }
    .logo {
        width: 230px;
        height: 60px;
        font-size: 18px;
        padding-left: 20px;
        padding-right: 20px;
        border-color: rgba(238, 241, 146, 0.3);
        border-right-width: 1px;
        border-right-style: solid;
    }
    .logo .txt {
        color: #fff;
    }
    .logo-width {
        width: 230px;
    }
    .out-main {
        background: #324057;
        position: absolute;
        top: 80px;
        bottom: 0px;
    }
    aside {
        width: 230px;
        position: absolute;
        top: -10px;
        bottom: 0px;
        left: 0px;
        background: #173173;
        z-index: 100;
    }
    .el-menu {
        height: 100%;
        background-color: #2a578b;
    }
    .el-menu-item{
        color: white;
        font-size: 18px;
        font-family: "微软雅黑";
        top: 10px;
        margin-bottom: 10px;
        border-radius: 5px;
        width: 235px;
        
    }
    .el-menu-item:focus, .el-menu-item:hover{
        background-color: #81c1eb;
        box-shadow: 0 0 10px #444;
    }
    .el-menu-item.is-active{
        background-color: #81c1eb;
        box-shadow: 0 0 10px #444;
    }
    .item {
        position: relative;
    }

    .content-container {
        background: #81c1eb;
        position: absolute;
        right: 0px;
        top: 0px;
        bottom: 0px;
        left: 230px;
        overflow-y:scroll;
        padding: 20px;
    }
    .breadcrumb-container {
        margin-bottom: 15px;
    }
    .title {
        top: 10px;
        position: absolute;
        padding: 7px 7px 7px 7px;
        float: left;
        font-weight: 600;
        color: #5d8bae;
        border-radius: 5px;
        background: #fff;
    }
    .breadcrumb-inner {
        top: 10px;
        position: absolute;
        right: 10px;
        float: right;
        font-family: "微软雅黑";
        background-color: white;
        padding: 7px 7px 7px 7px;
        border-radius: 5px;
    }
    
    /*视图切换区容器*/
    .content-wrapper {
        /*background-color: #fff;*/
        box-sizing: border-box;
        top: 20px;
        position: relative;
    }
    .logo-big{
        left: 57%;
        margin-left: -400px;
        top: 50%;
        margin-top: -150px;
        position: absolute;
        height: 300px;
        width: auto;
    }
    .fade-enter-active {
        transition: all .5s
    }
    .fade-enter, .fade-leave-active {
        opacity: 0;
        transform:  translateX( -200px );
    }
</style>