#!/bin/zsh
# adapted from https://stackoverflow.com/a/70389795
declare -a ios_simulators=("88FDFF20-D687-4F74-8443-33BC369A8EE4" "6067C5A9-2A8F-47B8-AE80-F9CB36CF8AFF" "1373248D-0B03-4D95-B948-23994AC33156")
declare -a android_simulators=("Pixel_3a_API_33_arm64-v8a")

wait_time=1
install=false
local_ip=$(ipconfig getifaddr en0)

while getopts "i" opt; do
  case $opt in
    i) install=true;;
  esac
done

open -a Simulator
for i in "${ios_simulators[@]}"
do
    echo "Booting $i"
    xcrun simctl boot $i
    sleep $wait_time
    if [ "$install" = true ] ; then
        echo "Installing Expo on $i"
        xcrun simctl install $i ~/.expo/ios-simulator-app-cache/Exponent-2.26.4.tar.app
        sleep $wait_time
    fi
    echo "Launching Expo on $i"
    xcrun simctl openurl $i exp://127.0.0.1:19000
    sleep $wait_time
done

for i in "${android_simulators[@]}"
do
    echo "Booting $i"
    ~/Library/Android/sdk/emulator/emulator -avd $i -no-boot-anim > /dev/null 2>&1 &
    sleep $wait_time
    if [ "$install" = true ] ; then
        echo "Installing Expo on $i"
        adb install ~/.expo/android-apk-cache/Exponent-2.26.4.apk
        sleep $wait_time
    fi
    adb wait-for-device shell 'while [[ -z $(getprop sys.boot_completed) ]]; do sleep 1; done; input keyevent 82'
    echo "Launching Expo on $i"
    adb shell "am start -W -a android.intent.action.VIEW -d \"exp://$local_ip:19000\"" > /dev/null 2>&1 &
done
echo "Launched Expo on all simulators"