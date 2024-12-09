// package com.habit_tracker.app

// class MainActivity : TauriActivity()
package com.habit_tracker.app

import android.os.Bundle
import androidx.core.view.WindowCompat

class MainActivity : TauriActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    WindowCompat.setDecorFitsSystemWindows(window, true)
  }
}