<template>
    <div>
        <h1>快速剪切工具</h1>

        <el-dialog
                title="提示"
                :visible.sync="cleanDialogVisible"
                width="30%"
                center>
            <span>确认清空？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cleanDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="cleanFilesConfirm">确 定</el-button>
            </span>
        </el-dialog>

        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="文件">
                <el-card shadow="hover">
                    <el-upload
                            class="upload-demo"
                            drag
                            action=""
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-change="handleChange"
                            :file-list="fileList"
                            :auto-upload="false"
                            multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击添加</em></div>
                        <div class="el-upload__tip" slot="tip">只能添加视频文件
                            <el-button size="mini" type="danger" plain @click="cleanFiles">清空
                            </el-button>
                        </div>
                    </el-upload>
                </el-card>
            </el-form-item>

            <el-form-item v-if="false" label="配置文件名称">
                <el-input v-model="form.name"
                          style="width: 400px"
                ></el-input>
            </el-form-item>

            <el-form-item label="输出格式">
                <el-radio-group v-model="radio">
                    <el-radio :label="0">源格式</el-radio>
                    <el-radio :label="1">MP4</el-radio>
                    <el-radio :label="2">MKV</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="去片头">
                <el-switch
                        v-model="isCutHead">
                </el-switch>
                <el-input
                        oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                        style="width: 200px"
                        maxlength="6"
                        minlength="1"
                        :disabled="!isCutHead"
                        v-model="form.start">
                    <template slot="append">秒</template>
                </el-input>
                <el-popover
                        placement="top-start"
                        title="填写格式"
                        width="200"
                        trigger="hover"
                        content="片头时间，格式可以是 精确到小数点后三位的秒，如 8.102。也可以是时间格式，HH:mm:ss。如24:30，代表去掉片头的24分钟30秒">
                    <el-button slot="reference" icon="el-icon-warning"
                               size="small"
                               circle></el-button>
                </el-popover>
            </el-form-item>

            <el-form-item label="去片尾">
                <el-switch
                        v-model="isCutTail">
                </el-switch>
                <el-input
                        oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                        style="width: 200px"
                        maxlength="6"
                        minlength="1"
                        :disabled="!isCutTail"
                        v-model="form.end">
                    <template slot="append">秒</template>
                </el-input>
                <el-popover
                        placement="top-start"
                        title="填写格式"
                        width="200"
                        trigger="hover"
                        content="片尾时间，格式可以是 精确到小数点后三位的秒，如 8.102。也可以是时间格式，HH:mm:ss。如24:30，代表去掉片头的24分钟30秒">
                    <el-button slot="reference" icon="el-icon-warning"
                               size="small"
                               circle></el-button>
                </el-popover>

            </el-form-item>
            <el-form-item label="自定义输出目录">
                <el-switch
                        v-model="isCustomDir"
                >
                </el-switch>
                <el-input
                        style="width: 400px"
                        :disabled="!isCustomDir"
                        v-model="form.dir">
                    <template slot="append">
                        <el-button @click="selectPath">选择</el-button>
                    </template>
                </el-input>

            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSubmit">开始处理</el-button>
                <el-button>保存参数</el-button>
            </el-form-item>
        </el-form>
        <el-progress :text-inside="true"
                     v-if="progressVisible"
                     :stroke-width="26"
                     :status="progressStatus"
                     :percentage="percentage"></el-progress>

        <p v-if="errText">{{errText}}</p>

    </div>


</template>

<style>
    body {
        margin: 0;
        /*text-align: left;*/
    }

    .el-form {
        text-align: left;

    }

    .swithinline {
        /*display: inline-block;*/
    }
</style>

<script>
  import { openDir } from "../../../shared/osTools"


  import {
    isWin,
    isMac,
    isLinux,
    isOldMacVersion,
    isPythonInstalled,
    ffprodePath
  } from "../../../shared/env"


  // var ffprobePath = require("ffprobe-static")
  var pathToFfmpeg = require("ffmpeg-static")
  console.log(pathToFfmpeg)

  var ffprobePath = ffprodePath
  console.log(ffprobePath);

  var fs = require("fs")
  import ffmpeg from "fluent-ffmpeg"

  export default {
    data() {
      return {
        errText: "",
        cleanDialogVisible: false,
        progressVisible: false,
        progressStatus: "success", //success warning exception
        percentage: 10.0,
        //片头
        isCutHead: false,
        isCutTail: false,
        isCustomDir: false,
        radio: 0,
        fileList: [],
        filePaths: new Set(), //文件路径
        form: {
          start: "0",
          end: "0",
          dir: ""
        }
      }
    },
    methods: {
      onSubmit() {
        console.log("submit!")
        this.errText = ""
        this.progressVisible = true
        var that = this
        let end = this.form.end

        ffmpeg.setFfmpegPath(pathToFfmpeg)
        ffmpeg.setFfprobePath(ffprobePath.path)
        if (this.filePaths.size == 0) {
          that.$notify.error({
            title: "处理出错",
            message: "请至少选择一个文件"
          })
          return
        }
        this.filePaths.forEach(fileName => {
          ffmpeg.ffprobe(fileName, function(err, meta) {
            console.log(meta)
            let duration = meta.format.duration
            let originName = fileName
            let outputName = fileName
            let outputNameOnly

            if (that.radio == 1) {
              var filePrefix = fileName.substring(0, fileName.lastIndexOf("."))//截取获得后缀名
              console.log("转为MP4")
              outputName = filePrefix + ".mp4"
            }
            if (that.radio == 2) {
              var filePrefix = fileName.substring(0, fileName.lastIndexOf("."))//截取获得后缀名
              console.log("转为mkv")
              outputName = filePrefix + ".mkv"
            }

            //处理目录

            if (!fs.existsSync(that.form.dir)) {
              fs.mkdirSync(that.form.dir)
            }
            if (isWin) {
              outputName = that.form.dir + outputName.substring(outputName.lastIndexOf("\\") + 1, outputName.length)//截取获得后缀名
              outputNameOnly = outputName.substring(outputName.lastIndexOf("\\") + 1, outputName.length)

            } else {
              outputName = that.form.dir + outputName.substring(outputName.lastIndexOf("/") + 1, outputName.length)//截取获得后缀名
              outputNameOnly = outputName.substring(outputName.lastIndexOf("/") + 1, outputName.length)
            }

            ffmpeg(originName)
              .inputOption("-ss " + that.form.start)
              .inputOption("-to " + (duration - parseFloat(end)))
              .inputOption("-accurate_seek")
              .on("start", function(commandLine) {
                console.log("[" + new Date() + "] Vedio 转码开始 !")
                console.log("commandLine: " + commandLine)
                that.percentage = 10.0
              })
              .on("error", function(err, stdout, stderr) {
                console.log("error: " + err.message)
                console.log("stdout: " + stdout)
                console.log("stderr: " + stderr)
                that.progressStatus = "exception"
                // that.$message.error(outputNameOnly + "处理出错了")
                that.errText = err.toString()
                that.$notify.error({
                  title: "处理出错",
                  message: outputNameOnly + "\n处理出错了:\n" + err
                })
              })
              .on("end", function() {
                that.percentage = 100.0
                that.progressStatus = "success"
                //that.$message.success(outputNameOnly + "处理完成")
                that.$notify({
                  title: "处理成功",
                  message: outputNameOnly + "处理完成",
                  type: "success"
                })

                openDir(outputName)
                console.log("[" + new Date() + "] Vedio Pushing is Finished !")
              })
              .on("progress", function(progress) {
                console.log("Processing: " + progress.percent.toFixed(2) + "% done")
                that.percentage = progress.percent.toFixed(2)
              })

              .outputOption("-c copy")
              .outputOption("-avoid_negative_ts 1")
              .outputOption("-strict experimental")
              .save(outputName)
          })
        })

      },
      handleRemove(file, fileList) {
        console.log("文件移除== ")
        console.log(file)
        console.log("文件列表移除== ")
        console.log(fileList)
        this.filePaths.delete(file.raw.path)
      },
      handlePreview(file) {
        let fileName = file.name
        let realPath = file.raw.path
        console.log(file)
        console.log(realPath)
      },
      handleChange(file, fileList) {

        console.log("文件列表 handleChange== ")
        console.log(fileList)
        if (this.filePaths.size == 0) {
          //处理目录
          let path = fileList[0].raw.path
          if (isWin) {
            path = path.substring(0, path.lastIndexOf("\\") + 1) + "cut\\"   //截取获得后缀名
          } else {
            path = path.substring(0, path.lastIndexOf("/") + 1) + "cut/"//截取获得后缀名

          }

          this.form.dir = path
        }

        let that = this
        fileList.forEach(f => {
          that.filePaths.add(f.raw.path)
        })
        console.log(this.filePaths)

      }, cleanFiles() {
        this.cleanDialogVisible = true
        // this.fileList = []
      }, cleanFilesConfirm() {
        console.log("文件清空== ")
        this.cleanDialogVisible = false
        this.fileList = []
        this.filePaths.clear()
      },
      selectPath() {

      }
    }

  }
</script>
