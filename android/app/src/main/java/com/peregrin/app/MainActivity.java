package com.peregrin.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    registerPlugin(PeregrinBillingPlugin.class);
    registerPlugin(PeregrinReviewPlugin.class);
    super.onCreate(savedInstanceState);
  }
}
