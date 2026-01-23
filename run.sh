#!/bin/sh
./backend/target/release/transit-board &
npm run start &
sleep 5s
firefox --new-tab "localhost:5173"
