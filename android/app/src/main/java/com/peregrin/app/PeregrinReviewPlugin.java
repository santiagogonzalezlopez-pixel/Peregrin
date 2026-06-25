package com.peregrin.app;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.play.core.review.ReviewInfo;
import com.google.android.play.core.review.ReviewManager;
import com.google.android.play.core.review.ReviewManagerFactory;
import com.google.android.gms.tasks.Task;

@CapacitorPlugin(name = "PeregrinReview")
public class PeregrinReviewPlugin extends Plugin {
  @PluginMethod
  public void requestReview(PluginCall call) {
    if (getActivity() == null) {
      call.reject("Review flow is not available without an active activity.", "NO_ACTIVITY");
      return;
    }

    getActivity().runOnUiThread(() -> {
      ReviewManager manager = ReviewManagerFactory.create(getContext());
      Task<ReviewInfo> request = manager.requestReviewFlow();
      request.addOnCompleteListener(task -> {
        if (!task.isSuccessful()) {
          Exception exception = task.getException();
          call.reject(
            exception != null ? exception.getMessage() : "Review request failed.",
            "REVIEW_REQUEST_FAILED"
          );
          return;
        }

        Task<Void> flow = manager.launchReviewFlow(getActivity(), task.getResult());
        flow.addOnCompleteListener(flowTask -> {
          JSObject result = new JSObject();
          result.put("completed", true);
          call.resolve(result);
        });
      });
    });
  }
}
