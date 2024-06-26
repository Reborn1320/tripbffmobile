package host.exp.exponent;


import com.facebook.react.ReactPackage;

import java.util.Arrays;
import java.util.List;

import expolib_v1.okhttp3.OkHttpClient;
import com.facebook.CallbackManager; 
import com.facebook.react.ReactNativeHost;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.FacebookSdk;

// Needed for `react-native link`
import com.facebook.react.ReactApplication;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.rnfs.RNFSPackage;
import com.mapbox.rctmgl.RCTMGLPackage;

public class MainApplication extends ExpoApplication implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              // Add your own packages here!
              // TODO: add native modules!

              // Needed for `react-native link`
              new MainReactPackage(),
              new AsyncStoragePackage(),
              new RNDeviceInfo(),
              new RNGestureHandlerPackage(),
              new ReanimatedPackage(),
              new VectorIconsPackage(),
              new RNFSPackage(),
              new RCTMGLPackage(),
              //**  ADD THE FOLLOWING LINE **//
              new FBSDKPackage(mCallbackManager)
      );
    }
  };

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  @Override
  public boolean isDebug() {
    return BuildConfig.DEBUG;
  }

  // Needed for `react-native link`
  public List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        // Add your own packages here!
        // TODO: add native modules!

        // Needed for `react-native link`
        //new MainReactPackage(),
        //**  ADD THE FOLLOWING LINE **//
        //new RNGestureHandlerPackage(),
        //new ReanimatedPackage(),
        new AsyncStoragePackage(),
        new RNDeviceInfo(),
        new VectorIconsPackage(),
        new RNFSPackage(),
        new RCTMGLPackage(),
        new FBSDKPackage(mCallbackManager)
    );
  }

  @Override
  public String gcmSenderId() {
    return getString(R.string.gcm_defaultSenderId);
  }

  @Override
  public boolean shouldUseInternetKernel() {
    return BuildVariantConstants.USE_INTERNET_KERNEL;
  }

  public static OkHttpClient.Builder okHttpClientBuilder(OkHttpClient.Builder builder) {
    // Customize/override OkHttp client here
    return builder;
  }

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
  }

}
