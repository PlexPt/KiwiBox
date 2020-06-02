import os from "os"
import { execSync } from "child_process"
import path from "path"
import { remote } from "electron"

export const platform = os.platform()

export const isWin = platform === "win32"
export const isMac = platform === "darwin"
export const isLinux = platform === "linux"

export const isDev = process.env.NODE_ENV == "development"

// python 是否已安装
export let isPythonInstalled
try {
  isPythonInstalled = /^hello$/.test(
    execSync(`python -c "print('hello')"`)
      .toString()
      .trim()
  )
} catch (e) {
  // do nothing
}

// mac版本号
export let macVersion
// mac版本是否低于10.11
export let isOldMacVersion = false
if (isMac) {
  try {
    const result = execSync("sw_vers").toString()
    macVersion = result.match(/ProductVersion:[ \t]*([\d.]*)/)[1]
    const matchedVersion = [10, 11, 0]
    const splited = macVersion.split(".")
    for (let i = 0; i < splited.length; i++) {
      if (splited[i] > matchedVersion[i]) {
        isOldMacVersion = false
        break
      } else if (splited[i] < matchedVersion[i]) {
        isOldMacVersion = true
        break
      } else if (i === 2 && splited[i] === matchedVersion[i]) {
        isOldMacVersion = true
      }
    }
  } catch (error) {
    // do nothing
  }
}

export let ffmpegPath
export let ffprodePath

if (isWin) {
  ffprodePath = path.join(getLibPath(), "ffprobe.exe")
} else {
  ffprodePath = path.join(getLibPath(), "ffprobe")
}

export function getLibPath() {

  let bin
  if (isWin) {

    if (isDev) {
      bin = path.resolve(__dirname,
        "../../../lib/win/")
    } else {
      const exePath = remote.app.getPath("exe")
      bin = path.join(exePath, "lib/win/")
    }

  } else if (isMac) {
    if (isDev) {
      bin = path.resolve(__dirname,
        "../../../lib/mac/")
    } else {
      const exePath = remote.app.getPath("exe")
      bin = path.join(exePath, "lib/mac/")
    }

  } else if (isLinux) {
    if (isDev) {
      bin = path.resolve(__dirname,
        "../../../lib/linux/")
    } else {
      const exePath = remote.app.getPath("exe")
      bin = path.join(exePath, "lib/linux/")
    }

  } else {
    bin = ""
  }


  return bin
}
