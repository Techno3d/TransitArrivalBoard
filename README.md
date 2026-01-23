# Transit Board

A hobby project that retrives and displays realtime MTA subway and bus info. It can be configured to track the departures of any subway or bus stop.

Please follow this guide on how to setup and deploy this project on your device.

## Tools

### Required

- [Rust](https://www.rust-lang.org/tools/install)
- [Node.js](https://nodejs.org/en/download)
- [Protobuf Compiler](https://github.com/protocolbuffers/protobuf?tab=readme-ov-file#protobuf-compiler-installation)

### Optional

We have provided a `Makefile` that helps automate development and deployment. To use the `Makefile`, please run the following command, depending on your OS.

Additionally, please install [Firefox](https://www.firefox.com/en-US/download/all/) to be able to automate deployment to production via the Makefile.

#### Windows

```powershell
winget install Git.Git GnuWin32.Make
```

#### macOS

Run the following command to install Make and Git.

```bash
xcode-select --install
```

## Environment Variables

Create a `.env` file in the `backend` directory and add the following variables.

### `MTABUSKEY`

[Request an API key](https://bustime.mta.info/wiki/Developers/Index) for the MTA BusTime API.

## Configuration File

Modify `config.json` to customize the stops displayed on your board. By default, it tracks stops near **The Bronx High School of Science**.

### `name`

This allows you to set a nickname for the stop being tracked. If left blank, the `stop_name` of the first element in `stop_ids` will be used.

### `stop_ids`

You can group all of the various stations you wish to track together by inserting corresponding `stop_id` in the array. If you need help finding a station's `stop_id`, you can download the [GTFS feeds](https://www.mta.info/developers) provided by the MTA.

### `walk_time`

It may be unhelpful to include vehicles that will depart faster than it would take someone to walk to the station. `walk_time` should be the average time it takes for someone to comfortably walk from the location of the board to the station. All vehicles that will arrive in less than half the `walk_time` will not be included.

## Deployment

> [!WARNING]
> Please install the optional tools to run `make`. Otherwise, you are able to manually run these commands by inspecting the `Makefile`.

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

You can view the webpage at <http://localhost:5173>.

### Production

To build and run the project for production, run the following commands.

```bash
make build
make run
```
