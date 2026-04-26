package com.peregrin.app;

import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.Collections;
import java.util.List;

@CapacitorPlugin(name = "PeregrinBilling")
public class PeregrinBillingPlugin extends Plugin implements PurchasesUpdatedListener {
  private static final String DEFAULT_PRODUCT_ID = "peregrin_premium_all";

  private BillingClient billingClient;
  private PluginCall pendingPurchaseCall;

  @Override
  public void load() {
    billingClient = BillingClient.newBuilder(getContext())
      .setListener(this)
      .enablePendingPurchases(
        PendingPurchasesParams.newBuilder()
          .enableOneTimeProducts()
          .build()
      )
      .enableAutoServiceReconnection()
      .build();
    connect(null);
  }

  @Override
  protected void handleOnDestroy() {
    if (billingClient != null && billingClient.isReady()) {
      billingClient.endConnection();
    }
    super.handleOnDestroy();
  }

  @PluginMethod
  public void isAvailable(PluginCall call) {
    connect(new ReadyCallback() {
      @Override
      public void onReady() {
        JSObject result = new JSObject();
        result.put("available", true);
        call.resolve(result);
      }

      @Override
      public void onError(BillingResult billingResult) {
        call.reject(billingResult.getDebugMessage(), String.valueOf(billingResult.getResponseCode()));
      }
    });
  }

  @PluginMethod
  public void purchasePremium(PluginCall call) {
    if (pendingPurchaseCall != null) {
      call.reject("A purchase is already in progress.", "PURCHASE_IN_PROGRESS");
      return;
    }

    String productId = call.getString("productId", DEFAULT_PRODUCT_ID);
    connect(new ReadyCallback() {
      @Override
      public void onReady() {
        launchPremiumPurchase(call, productId);
      }

      @Override
      public void onError(BillingResult billingResult) {
        call.reject(billingResult.getDebugMessage(), String.valueOf(billingResult.getResponseCode()));
      }
    });
  }

  @PluginMethod
  public void restorePurchases(PluginCall call) {
    String productId = call.getString("productId", DEFAULT_PRODUCT_ID);
    connect(new ReadyCallback() {
      @Override
      public void onReady() {
        queryOwnedPremium(call, productId);
      }

      @Override
      public void onError(BillingResult billingResult) {
        call.reject(billingResult.getDebugMessage(), String.valueOf(billingResult.getResponseCode()));
      }
    });
  }

  private void connect(ReadyCallback callback) {
    if (billingClient == null) {
      if (callback != null) callback.onError(errorResult("Billing client is not initialized."));
      return;
    }
    if (billingClient.isReady()) {
      if (callback != null) callback.onReady();
      return;
    }

    billingClient.startConnection(new BillingClientStateListener() {
      @Override
      public void onBillingSetupFinished(BillingResult billingResult) {
        if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
          if (callback != null) callback.onReady();
        } else if (callback != null) {
          callback.onError(billingResult);
        }
      }

      @Override
      public void onBillingServiceDisconnected() {
        // Billing 8 auto-reconnects on the next API call.
      }
    });
  }

  private void launchPremiumPurchase(PluginCall call, String productId) {
    QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
      .setProductList(Collections.singletonList(
        QueryProductDetailsParams.Product.newBuilder()
          .setProductId(productId)
          .setProductType(BillingClient.ProductType.INAPP)
          .build()
      ))
      .build();

    billingClient.queryProductDetailsAsync(params, (billingResult, productDetailsResult) -> {
      if (billingResult.getResponseCode() != BillingClient.BillingResponseCode.OK) {
        call.reject(billingResult.getDebugMessage(), String.valueOf(billingResult.getResponseCode()));
        return;
      }

      List<ProductDetails> productDetailsList = productDetailsResult.getProductDetailsList();
      if (productDetailsList == null || productDetailsList.isEmpty()) {
        call.reject("Premium product is not available in Google Play.", "PRODUCT_UNAVAILABLE");
        return;
      }

      ProductDetails productDetails = productDetailsList.get(0);
      BillingFlowParams.ProductDetailsParams productDetailsParams =
        BillingFlowParams.ProductDetailsParams.newBuilder()
          .setProductDetails(productDetails)
          .build();
      BillingFlowParams flowParams = BillingFlowParams.newBuilder()
        .setProductDetailsParamsList(Collections.singletonList(productDetailsParams))
        .build();

      pendingPurchaseCall = call;
      BillingResult launchResult = billingClient.launchBillingFlow(getActivity(), flowParams);
      if (launchResult.getResponseCode() != BillingClient.BillingResponseCode.OK) {
        pendingPurchaseCall = null;
        call.reject(launchResult.getDebugMessage(), String.valueOf(launchResult.getResponseCode()));
      }
    });
  }

  private void queryOwnedPremium(PluginCall call, String productId) {
    QueryPurchasesParams params = QueryPurchasesParams.newBuilder()
      .setProductType(BillingClient.ProductType.INAPP)
      .build();
    billingClient.queryPurchasesAsync(params, (billingResult, purchases) -> {
      if (billingResult.getResponseCode() != BillingClient.BillingResponseCode.OK) {
        call.reject(billingResult.getDebugMessage(), String.valueOf(billingResult.getResponseCode()));
        return;
      }

      Purchase premiumPurchase = findPurchasedPremium(purchases, productId);
      if (premiumPurchase == null) {
        JSObject result = new JSObject();
        result.put("success", false);
        result.put("notFound", true);
        call.resolve(result);
        return;
      }

      acknowledgeIfNeeded(premiumPurchase, new AckCallback() {
        @Override
        public void onComplete(boolean acknowledged) {
          call.resolve(purchaseResult(premiumPurchase, productId, acknowledged));
        }

        @Override
        public void onError(BillingResult ackResult) {
          call.reject(ackResult.getDebugMessage(), String.valueOf(ackResult.getResponseCode()));
        }
      });
    });
  }

  @Override
  public void onPurchasesUpdated(BillingResult billingResult, List<Purchase> purchases) {
    PluginCall call = pendingPurchaseCall;
    if (call == null) return;

    if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && purchases != null) {
      Purchase premiumPurchase = findPurchasedPremium(purchases, DEFAULT_PRODUCT_ID);
      if (premiumPurchase == null) {
        pendingPurchaseCall = null;
        call.reject("Premium purchase was not returned by Google Play.", "PURCHASE_NOT_FOUND");
        return;
      }

      acknowledgeIfNeeded(premiumPurchase, new AckCallback() {
        @Override
        public void onComplete(boolean acknowledged) {
          pendingPurchaseCall = null;
          call.resolve(purchaseResult(premiumPurchase, DEFAULT_PRODUCT_ID, acknowledged));
        }

        @Override
        public void onError(BillingResult ackResult) {
          pendingPurchaseCall = null;
          call.reject(ackResult.getDebugMessage(), String.valueOf(ackResult.getResponseCode()));
        }
      });
      return;
    }

    pendingPurchaseCall = null;
    if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.USER_CANCELED) {
      call.reject("Purchase cancelled.", "USER_CANCELED");
    } else {
      call.reject(billingResult.getDebugMessage(), String.valueOf(billingResult.getResponseCode()));
    }
  }

  private Purchase findPurchasedPremium(List<Purchase> purchases, String productId) {
    if (purchases == null) return null;
    for (Purchase purchase : purchases) {
      if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED
        && purchase.getProducts().contains(productId)) {
        return purchase;
      }
    }
    return null;
  }

  private void acknowledgeIfNeeded(Purchase purchase, AckCallback callback) {
    if (purchase.isAcknowledged()) {
      callback.onComplete(true);
      return;
    }

    AcknowledgePurchaseParams params = AcknowledgePurchaseParams.newBuilder()
      .setPurchaseToken(purchase.getPurchaseToken())
      .build();
    billingClient.acknowledgePurchase(params, billingResult -> {
      if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
        callback.onComplete(true);
      } else {
        callback.onError(billingResult);
      }
    });
  }

  private JSObject purchaseResult(Purchase purchase, String productId, boolean acknowledged) {
    JSObject result = new JSObject();
    result.put("success", true);
    result.put("productId", productId);
    result.put("purchaseToken", purchase.getPurchaseToken());
    result.put("orderId", purchase.getOrderId());
    result.put("purchaseTime", purchase.getPurchaseTime());
    result.put("acknowledged", acknowledged);
    return result;
  }

  private BillingResult errorResult(String message) {
    return BillingResult.newBuilder()
      .setResponseCode(BillingClient.BillingResponseCode.ERROR)
      .setDebugMessage(message)
      .build();
  }

  private interface ReadyCallback {
    void onReady();
    void onError(BillingResult billingResult);
  }

  private interface AckCallback {
    void onComplete(boolean acknowledged);
    void onError(BillingResult billingResult);
  }
}
