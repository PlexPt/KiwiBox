<template>
    <div>
        <div id="descDiv">
            <h2>KiwiBoxKiwi Box 猕猴桃工具箱</h2>
            <p>如有问题请随时反馈到github，传送门在下面。欢迎star/fork。</p>
            <el-button type="primary" @click="goGithub" plain>View On Github
            </el-button>
            <el-button type="primary" @click="goGithub" plain>检查更新
            </el-button>
        </div>
    </div>
</template>

<style>
    #descDiv {
        text-align: left;
    }
</style>

<script>
  const shell = require("electron").shell
  export default {
    data() {
      return {
        githubUrl: "https://github.com/plexpt/KiwiBox"
      }
    },
    methods: {
      goGithub: function() {
        shell.openExternal(this.githubUrl)
      }
    }
  }
</script>
