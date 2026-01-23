START "TServer" backend/target/release/transit-board.exe
START "TWebUI" npm run start
powershell -nop -c "& {sleep 4}"
@REM "C:\Program Files\Mozilla Firefox\firefox.exe" -kiosk localhost:3000
"C:\Program Files\Mozilla Firefox\firefox.exe" localhost:3000
