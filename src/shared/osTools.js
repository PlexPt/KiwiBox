
import { isWin, isMac, isLinux, isOldMacVersion, isPythonInstalled } from "./env"


export function openDir(file) {
  if (isWin) {
    var exec = require("child_process").exec
    exec("explorer.exe /select, " + file)
  }

}
