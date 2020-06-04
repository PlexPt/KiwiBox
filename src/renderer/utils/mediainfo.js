import { isWin, isMac, isLinux, isOldMacVersion, isPythonInstalled, isDev } from "../../shared/env"
import path from "path"
import { remote } from "electron"

export function getMediainfoExe(isShort) {

  let bin
  if (isWin) {

    if (isDev) {
      bin = path.resolve(__dirname,
        "../../../lib/win/mediainfo/MediaInfo.exe")
    } else {
      const exePath = remote.app.getPath("exe")
      bin = path.join(exePath, "../resources/lib/win/mediainfo/MediaInfo.exe")
    }

    // bin = ".\\resources\\lib\\win\\mediainfo\\MediaInfo.exe"

  } else if (isMac) {
    bin = "./resources/lib/mac/mediainfo/MediaInfo.exe"

  } else if (isLinux) {
    bin = "./resources/lib/linux/mediainfo/MediaInfo.exe"

  } else {

  }
  let output = path.join(bin, "../Plugin/Custom/zh.csv")

  let outputCmd = "--Output=\"file://" + output + "\" "
  if (!isShort) {
    outputCmd = ""
  }


  return "\"" + bin + "\" " + outputCmd
}
