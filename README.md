# Transit Arrival Board

A hobby project that uses the MTA's GTFS static and realtime feeds to get realtime transit info about public transit near our high school, The Bronx High School of Science.

## Build Instructions

### API Keys

Get a BusTime API key from the MTA [here](http://www.bustime.mta.info/wiki/Developers/Index) and add it to a `.env` file with the following key:
`MTABUSKEY=""`

### Dependencies

- [Rust](https://www.rust-lang.org/tools/install)
- [Node.js](https://nodejs.org/en/download)
- [Protobuf Compiler](https://github.com/protocolbuffers/protobuf?tab=readme-ov-file#protobuf-compiler-installation)
