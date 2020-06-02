<template>
    <div>
        <h1>M3U8 下载器</h1>
        <P>m3u8地址
            <el-input style="width: 80%"></el-input>
        </P>
        <P>输出目录
            <el-input style="width: 80%"></el-input>
        </P>
        <P>自定义视频标题
            <el-input style="width: 80%"></el-input>
        </P>

        <p>
            线程数:
            <el-select v-model="thread" size="small" placeholder="线程数">
                <el-option
                        v-for="item in threads"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
        </p>
        <el-checkbox label="下载完成后合并" border
                     size="mini"
                     v-model="mergeCheck"
        ></el-checkbox>

        <el-checkbox label="合并后删除分片" border
                     size="mini"
                     :disabled="!mergeCheck"
                     v-model="deleteCheck"
        ></el-checkbox>


        <p/>
        <el-progress :text-inside="true" :stroke-width="26" :percentage="70"></el-progress>
        <p/>
        <el-button type="primary" @click="execExample">下载</el-button>
        <p v-if="cmdResult">{{ cmdResult }}</p>
    </div>
</template>
<style>

    * {
        text-align: left;

    }
</style>
<script>

  var pathToFfmpeg = require("ffmpeg-static")
  console.log(pathToFfmpeg)
  import ffmpeg from "fluent-ffmpeg"

  export default {

    data() {
      return {
        thread: 8,
        threads: [1, 2, 4, 8, 12, 16, 32, 64],
        cmdResult: "",
        mergeCheck: true,
        deleteCheck: true,
        cmdInput: ""
      }
    },
    methods: {
      execExample: function() {


        // this.$startLoading()

        ffmpeg.ffprobe()

        this.$execCmd(
          // 命令行怎么运行它就怎么写
          `python ./example/example.py`,
          // 加载动效的文字
          "运行python example :)",
          // 结果存放，如果按默认设定，在执行完成后：
          // `this['cmdResult'] = result`
          "cmdResult"
        )
      }
    }
  }
</script>
