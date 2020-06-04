<template>
    <el-col :span="18" id="sideBar">
        <el-menu router>
            <el-menu-item index="/">
                <i class="el-icon-menu"></i>主页
            </el-menu-item>
            <el-menu-item index="/cut">
                <i class="el-icon-menu"></i>掐头去尾
            </el-menu-item>
            <el-menu-item index="/merge">
                <i class="el-icon-menu"></i>合并
            </el-menu-item>
            <el-menu-item index="/ptgen">
                <i class="el-icon-edit"></i>PTGen
            </el-menu-item>
            <el-menu-item index="/m3u8">
                <i class="el-icon-download"></i>M3U8 下载器
            </el-menu-item>
            <el-menu-item index="/setting">
                <i class="el-icon-setting"></i>设置
            </el-menu-item>
            <el-menu-item index="/about">
                <i class="el-icon-question"></i>关于
            </el-menu-item>
        </el-menu>
    </el-col>
</template>

<style>
    #sideBar {
        height: 100%;
        text-align: left;
    }
</style>
