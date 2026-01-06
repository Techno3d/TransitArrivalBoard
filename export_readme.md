# Config
Setup the subway lines and bus routes by editing the `config.ts` file. 
Edit the .env file to include the key, `MTABUSKEY`, with the value set to your bus key, which you can obtain [here](https://bustime.mta.info/wiki/Developers/Index).

# Running Transit board
Make sure you have python installed, which is used to start the front end.
Run the run.bat (Windows) or run.sh (Linux). The frontend can be accessed at http://localhost:3000

# Running manually
Run the `transit-board.exe` (Windows) or `transit-board` (Linux) file. In another terminal run the frontend using `python -m http.server 3000` or any similar http server.

# Issues/Errors
Most errors can be fixed by reloading the browser tab or by restarting everything. 
If Transit Board doesn't fit properly, you can use your browser's zoom feature (ctrl+ or ctrl-). 
Other issues can be submitted at our [Github](https://github.com/Techno3d/TransitArrivalBoard).