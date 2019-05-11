This page list out basic link necessary to develop with react-native
* setup Redux and navigation https://blog.cloudboost.io/getting-started-with-react-native-and-redux-6cd4addeb29
* Setup Typescript integration https://facebook.github.io/react-native/blog/2018/05/07/using-typescript-with-react-native
* Add jsx file extentions 

note on build android
https://github.com/facebook/react-native/issues/20433
go into gradle of handler to update to `compile 'com.facebook.infer.annotation:infer-annotation:+'`

use babel.config.js, add `babel runtime`
https://github.com/facebook/react-native/issues/21052

fix another issue
https://github.com/facebook/react-native/issues/20588

------------
if you see thisissue
java.lang.RuntimeException: Android dependency ‘com.google.android.gms:play-services-gcm’ has different version for the compile (15.0.1) and runtime (16.1.0) classpath. You should manually set the same version via DependencyResolution

then follow this instruction 
build.gradle cua react-native-device-info

implementation "com.google.android.gms:play-services-gcm:${safeExtGet('googlePlayServicesVersion', '11.2.0')}"
edit dau + thanh 11.2.0
rồi Make lại react-native-device-ìno


----
signing process
* copy debug.keystore into your ~/.android/
* run this cmd to generate keyhash `keytool -exportcert -alias MY_APP_DEBUG -storepass 123456 -keystore ~/.android/debug.keystore.jks | openssl sha1 -binary | openssl base64`
* Add that keyhash to fabook developer page

or following this instruction
https://stackoverflow.com/a/54513168/3161505

ref
https://coderwall.com/p/r09hoq/android-generate-release-debug-keystores
