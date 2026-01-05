#!/bin/sh

./transit-board &
python -m http.server
sleep 5s
firefox --new-tab "localhost:3000"