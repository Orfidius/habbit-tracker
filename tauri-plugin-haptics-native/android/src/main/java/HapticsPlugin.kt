package com.plugin.haptics-native

import android.app.Activity
import app.tauri.annotation.Command
import app.tauri.annotation.InvokeArg
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin
import app.tauri.plugin.Invoke

@InvokeArg
class PingArgs {
  var value: String? = null
}

@TauriPlugin
class Haptics(private val activity: Activity): Plugin(activity) {
    // private val implementation = Example()
    @Command
    fun vibrate(invoke: Invoke) {
        val vibrationManager = getSystemService(Context.VIBRATION_MANAGER_SERVICE) as VibrationManager
        val effect = VibrationEffect.createOneShot(500, VibrationEffect.DEFAULT_AMPLITUDE)
        // val timings = longArrayOf(0, 100, 200, 300, 400, 500) // In milliseconds
        // val amplitudes = intArrayOf(0, 255, 128, 255, 128, 255)
        // val effect = VibrationEffect.createWaveform(timings, amplitudes, -1) // Repeat indefinitely
        this.vibrationManager.vibrate(effect)
        val ret = JSObject({message: "vibrating"});
        // ret.put("value", implementation.pong(args.value ?: "default value :("))
        invoke.resolve(ret)
    }
}
