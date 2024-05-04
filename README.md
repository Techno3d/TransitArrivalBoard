# Transit Arrival Board
A hobby project that uses the MTA's GTFS static and realtime feeds to get realtime transit info about public transit near our high school, The Bronx High School of Science.

## Build Instructions
### Environment Variables
Create a `.env` file and add the following variables.
#### `MTABUSKEY`
The MTA's BusTime feeds require an API key, which you can obtain [here](http://www.bustime.mta.info/wiki/Developers/Index).

### Dependencies
Install the following dependencies.
- [Rust](https://www.rust-lang.org/tools/install)
- [Node.js](https://nodejs.org/en/download)
- [Protobuf Compiler](https://github.com/protocolbuffers/protobuf?tab=readme-ov-file#protobuf-compiler-installation)

### Deploying
The webpage can be found at http://localhost:3000/ after deploying.
#### Development
Open 2 terminals and run the following commands.
```bash
cargo run
```
```bash
npm run install
npm run dev
```
#### Production
Open 2 terminals and run the following commands.
> Note: `start` is a command only found on Windows.
```bash
cargo build --release
start .\target\release\transit-board.exe
```
```bash
npm run install
npm run build
npm run start
```