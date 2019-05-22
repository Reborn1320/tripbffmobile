# 3rd-party service

`RN` support `blob` natively, no need for any extra `rn-fetch-blob` lib, and btw this lib is not compatible with current `RN` setup, link then compile error
https://github.com/joltup/rn-fetch-blob/releases
https://blog.expo.io/expo-sdk-v26-0-0-is-now-available-2be6d9805b31

explanation on how to use `blob`
https://github.com/expo/expo/issues/2402#issuecomment-443726662

upload `uri` using `FormData` & `fetch`
https://github.com/expo/image-upload-example/blob/master/frontend/App.js#L180

upload `FormData` using `axios`
https://medium.com/@fakiolinho/handle-blobs-requests-with-axios-the-right-way-bb905bdb1c04

upload `blob` to `firebase`
https://github.com/expo/firebase-storage-upload-example/blob/master/App.js

how to upload using xmlHttpRequest, the rest is bullshit
https://github.com/facebook/react-native/blob/fe42a28de12926c7b3254420ccb85bef5f46327f/Examples/UIExplorer/XHRExample.ios.js#L215-L230

notes:
* RN can get photos
* RN can't find any lib support read file with format "content://media/external/images/media/2312", do the search again
* RN can use XMLHttpRequest to read 
* expo can get file info from uri of RN
* expo can't get file from uri of RN
* expo can get photos
* expo can't get file from uri of expo itself!!