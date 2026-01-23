# Transit Board

A hobby project that retrives and displays realtime MTA subway and bus info. It can be configured to track the departures of any subway or bus stop.

Please follow this guide on how to setup and deploy this project on your device.

## Tools

Install the following tools.

- [Rust](https://www.rust-lang.org/tools/install)
- [Node.js](https://nodejs.org/en/download)
- [Protobuf Compiler](https://github.com/protocolbuffers/protobuf?tab=readme-ov-file#protobuf-compiler-installation)

[Firefox](https://www.firefox.com/en-US/download/all/) is optional, but we have provided scripts that will automate deployment if it is installed.

## Environment Variables

Create a `.env` file in the `/backend` directory and add the following variables.

### `MTABUSKEY`

[Request an API key](https://bustime.mta.info/wiki/Developers/Index) for the MTA BusTime API.

## Configuration File

Modify `/frontend/src/config.ts` to customize the stops displayed on your board. By default, it tracks stops near **The Bronx High School of Science**.

### `stop_ids`

You can group all of the various stations you wish to track together by inserting corresponding `stop_id` in the array. If you need help finding a station's `stop_id`, you can download the [GTFS feeds](https://www.mta.info/developers) provided by the MTA.

### `walk_time`

It may be unhelpful to include vehicles that will depart faster than it would take someone to walk to the station. `walk_time` should be the average time it takes for someone to comfortably walk from the location of the board to the station. All vehicles that will arrive in less than half the `walk_time` will not be included.

### `name`

This allows you to set a nickname for the stop being tracked. If left blank, the `stop_name` of the first element in `stop_ids` will be used.

## Deployment

Before you begin, run the following command to install the project dependencies.

```bash
make install
```

### Development

To run the project while in development, run each command in seperate terminals.

```bash
cd backend && cargo run
```

```bash
cd frontend && npm run dev
```

You can view the webpage at <http://localhost:3000>.

### Production

To build and run the project for production, run the following command.

```bash
make build
```

If you have Firefox, you can run the following command depending on your OS.

#### Windows

```cmd
run.bat
```

#### macOS/Linux

```bash
run.sh
```
