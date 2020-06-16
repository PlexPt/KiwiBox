<template>
    <div style="text-align: left">
        <h2>PTgen
            <el-popover
                    placement="top-start"
                    title="这是什么"
                    width="200"
                    trigger="hover"
                    content="PT-Gen 可根据豆瓣、IMDb、Bangumi、Steam 链接自动生成简介。">
                <el-button slot="reference" icon="el-icon-warning"
                           size="small"
                           circle></el-button>
            </el-popover>
        </h2>
        <el-card shadow="hover">
            <div>
                <span>选择API   </span>
                <el-select v-model="apiValue"
                           style="width: 400px;margin-left: 20px"
                           placeholder="请选择API">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>

        </el-card>


        <el-card shadow="hover">
            <div>
                <span>搜索 </span>
                <el-select v-model="searchText"
                           filterable
                           clearable
                           remote
                           :remote-method="onSearch"
                           :loading="loading"
                           style="width: 400px;margin-left: 20px"
                           placeholder="名称或豆瓣、IMDb、Bangumi、Steam、indienova、Epic等资源链接">
                    <el-option
                            v-for="item in searchResults"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" @click="doGEN">生成</el-button>
            </div>

        </el-card>
        <el-card shadow="hover">
            <div>
                <p style="margin-top: 0px">自动获取Media Info
                    <el-checkbox v-model="isAutoShot"
                                 label="自动截图传图床"
                                 style="margin-left: 20px;margin-right: 5px"

                                 border
                                 size="small"></el-checkbox>
                    <el-popover
                            placement="top-start"
                            title="这是什么"
                            width="200"
                            trigger="hover"
                            content="自动截取视频截图并传到图床， 然后将链接全自动插入文末。">
                        <el-button slot="reference" icon="el-icon-warning"
                                   size="small"
                                   circle></el-button>
                    </el-popover>

                    <!--                    <el-checkbox v-model="isAutoNfo"-->
                    <!--                                 label="自动生成NFO"-->
                    <!--                                 style="margin-left: 20px;margin-right: 5px"-->

                    <!--                                 border-->
                    <!--                                 size="small"></el-checkbox>-->
                    <!--                    <el-popover-->
                    <!--                            placement="top-start"-->
                    <!--                            title="这是什么"-->
                    <!--                            width="200"-->
                    <!--                            trigger="hover"-->
                    <!--                            content="自动生成NFO文件到视频同级目录。">-->
                    <!--                        <el-button slot="reference" icon="el-icon-warning"-->
                    <!--                                   size="small"-->
                    <!--                                   circle></el-button>-->
                    <!--                    </el-popover>-->
                    <el-checkbox v-model="isShortMediaInfo"
                                 label="简短的MediaInfo"
                                 style="margin-left: 20px;margin-right: 5px"
                                 border
                                 size="small"></el-checkbox>
                    <el-popover
                            placement="top-start"
                            title="这是什么"
                            width="200"
                            trigger="hover"
                            content="使用更简短的MediaInfo模板">
                        <el-button slot="reference" icon="el-icon-warning"
                                   size="small"
                                   circle></el-button>
                    </el-popover>

                </p>

                <el-upload
                        class="upload-demo"
                        drag
                        action=""
                        :on-change="handleChange"
                        :file-list="fileList"
                        :auto-upload="false"
                >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击选择</em></div>
                    <div class="el-upload__tip" slot="tip">只能选择视频文件
                        <el-button v-if="false" size="mini" type="danger" plain @click="cleanFiles">
                            清空
                        </el-button>
                    </div>
                </el-upload>
            </div>
        </el-card>

        <el-card shadow="hover">
            <div>
                <p style="margin-top: 0px">结果
                    <el-button plain style="margin-left: 10px" size="mini" @click="doCopy">复制
                    </el-button>
                </p>

                <el-input
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 12}"
                        placeholder="这里查看结果"
                        v-model="resultText">
                </el-input>
            </div>
        </el-card>
        <!--        <el-progress :text-inside="true" :stroke-width="26" :percentage="70"></el-progress>-->
        <!--        <el-button plain @click="execExample">运行</el-button>-->
        <p v-if="cmdResult">{{ cmdResult }}</p>
    </div>
</template>
<style>
    .el-card {
        margin-bottom: 10px;
        padding-top: 0px;
    }
</style>
<script>
  import { getMediainfoExe } from "../../utils/mediainfo"

  // const MediaInfo = require("mediainfo.js")
  //
  // let mediainfo
  // MediaInfo({ format: "text" }, (media) => {
  //   mediainfo = media
  //
  // })
  const { clipboard } = require("electron")
  export default {

    data() {
      return {
        resultText: "",
        mediaInfoText: "",
        genText: "",
        filePath: "",
        fileList: [],
        isAutoShot: true,
        isAutoNfo: false,
        isShortMediaInfo: false,
        loading: false,
        cmdResult: "",
        cmdInput: "",
        searchText: "",
        searchResults: [],
        options: [{
          value: "https://api.rhilip.info/tool/movieinfo/gen",
          label: "[默认]https://api.rhilip.info/tool/movieinfo/gen"
        }, {
          value: "https://ptgen.rhilip.workers.dev/",
          label: "https://ptgen.rhilip.workers.dev/"
        }, {
          value: "https://api.nas.ink/infogen",
          label: "https://api.nas.ink/infogen"
        }],
        apiValue: "https://api.rhilip.info/tool/movieinfo/gen"

      }
    },
    methods: {
      doCopy: function() {
        clipboard.writeText(this.resultText)
        this.$notify({
          title: "提示",
          message: "复制成功",
          type: "success"
        })
      },
      handleChange(efile, fileList) {
        let filepath = efile.raw.path

        this.filePath = filepath

        let file = efile.raw

        let that = this

        let cmd = getMediainfoExe(this.isShortMediaInfo) + " \"" + filepath + "\""

        console.log(cmd)
        this.$execCmd(
          // 命令行怎么运行它就怎么写
          cmd,
          // 加载动效的文字
          "获取media info 中...",
          // 结果存放，如果按默认设定，在执行完成后：
          // `this['cmdResult'] = result`
          "mediaInfoText",
          result => {
            that.concat()
          },
          err => {
            that.$notify.error({
              title: "err",
              message: "出错了\n" + err,
              type: "success"
            })
          }
        )


        // if (file) {
        //   // let loading = that.$startLoading("获取media info 中...")
        //   const getSize = () => file.size
        //   const readChunk = (chunkSize, offset) =>
        //     new Promise((resolve, reject) => {
        //       const reader = new FileReader()
        //       reader.onload = (event) => {
        //         if (event.target.error) {
        //           reject(event.target.error)
        //         }
        //         resolve(new Uint8Array(event.target.result))
        //       }
        //       reader.readAsArrayBuffer(file.slice(offset, offset + chunkSize))
        //     })
        //
        //   // debugger
        //   mediainfo
        //     .analyzeData(getSize, readChunk)
        //     .then((result) => {
        //       that.mediaInfoText = result
        //
        //       // loading.close()
        //       console.log("解析完成。。。")
        //       that.concat()
        //     })
        //     .catch((error) => {
        //       that.mediaInfoText = `发生错误:\n${error.stack}`
        //
        //       // loading.close()
        //       console.log("发生错误:\n" + error.stack)
        //
        //       that.$notify.error({
        //         title: "err",
        //         message: "出错了\n" + error,
        //         type: "success"
        //       })
        //     })
        // }

        console.log("解析完成。。。")
        that.concat()

      },
      concat() {

        console.log("concat 开始拼接")

        this.resultText = this.genText +
          "\n\n mediaInfo:\n[quote]\n \n" + this.mediaInfoText + "[/quote]\n\n"
          + "截图 待开发 请先手动插入"

        this.$notify({
          title: "成功",
          message: "这是生成成功的提示消息",
          type: "success"
        })
      },
      doGEN() {
        if (/^http/.test(this.searchText)) {

          this.$notify.info({
            title: "提示",
            message: "正在生成"
          })
          let that = this

          //生成
          this.$http({
            url: this.apiValue + "?url=" + this.searchText,
            method: "get"

          }).then(({ data }) => {
            this.genText = data["success"] === false ? data["error"] : data["format"]

            this.concat()


          }).catch(function(error) {
            console.log(error)

            that.$notify.error({
              title: "API 接口错误",
              message: "可能是一天50次的机会用完了，换个API试试"
            })

          })
        } else {
          this.$notify({
            title: "提示",
            message: "请搜索或输入链接",
            type: "warning"
          })

          return
        }


      },

      getDoubanEntApiKey() {  // 随机获取一个key

        const doubanEntApiKeys = [
          "0dad551ec0f84ed02907ff5c42e8ec70",
          "02646d3fb69a52ff072d47bf23cef8fd"
        ]
        return doubanEntApiKeys[Math.floor(Math.random() * doubanEntApiKeys.length)]
      },

      onSearch(query) {

        if (/^http/.test(query)) {
          return
        }

        if (query !== "") {
          this.loading = true

          //豆瓣搜索
          //https://api.douban.com/v2/movie/search?apikey=02646d3fb69a52ff072d47bf23cef8fd&q=
          // %E7%88%86%E4%B8%B8&callback=fun_701106774409104
          var url = "https://api.douban.com/v2/movie/search"

          this.$http({
            url: url,
            method: "get",
            params: {
              "apikey": "02646d3fb69a52ff072d47bf23cef8fd",
              "q": query
            }
          }).then(({ data }) => {
            this.loading = false
            if (data && data.total > 0) {
              this.searchResults = []

              data.subjects.slice(-10).forEach(item => {
                let str = item.title + " | " + item.year + " | " + item.subtype + " | " + item.genres.toString()
                let r = {
                  value: item.alt,
                  label: str
                }

                this.searchResults.push(r)
              })

            } else {
              this.$message.error("无结果")
            }
          })


        } else {
          this.searchResults = []
        }


      }
    }
  }
</script>
