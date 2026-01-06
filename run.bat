START "TServer" ./transit-board.exe
START "TWebUI" python -m http.server 3000
powershell -nop -c "& {sleep 4}"
"C:\Program Files\Mozilla Firefox\firefox.exe" -kiosk localhost:3000