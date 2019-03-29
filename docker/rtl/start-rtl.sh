#!/usr/bin/env sh

echo "RTL sleeping 6 minutes, to let BTCD generate certificates"
sleep 360 &
pid=$!
wait $pid
echo "RTL sleeping 6 minutes.. Done."

node rtl
