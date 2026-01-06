#!/bin/sh

./transit-board &
python -m http.server 3000
sleep 5s
firefox --new-tab "localhost:3000"