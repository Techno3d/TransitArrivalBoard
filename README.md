# Transit Board

A hobby project that retrives and displays realtime MTA subway and bus arrival information for any stop. It also tracks service alerts for subway.

Please follow this guide on how to setup and deploy this project on your device.

## Tools

### Required

- [Rust](https://rust-lang.org/tools/install)
- [Node.js](https://nodejs.org/en/download)
- [Protobuf Compiler](https://protobuf.dev/installation)

### Optional

We have provided a `Makefile` that helps automate development and deployment. To use it, please install Make and Git using the command that corresponds to your OS.

#### Windows

```powershell
winget install Git.Git GnuWin32.Make
```

#### macOS

```bash
xcode-select --install
```

## Environment Variables

Create a `.env` file in the `backend` directory and add the following variables.

| Key         | Value                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------- |
| `MTABUSKEY` | An API key for the MTA BusTime API. [Request one here](https://bustime.mta.info/wiki/Developers/Index). |

## Configuration

Modify `config.json` in the root directory to customize your board to your liking. By default, it tracks stops near [The Bronx High School of Science](https://bxscience.edu).

### Root

| Key           | Type                | Description                                                    |
| ------------- | ------------------- | -------------------------------------------------------------- |
| `subway`      | `Array<Stop>`       | The list of subway stops you want to track.                    |
| `bus`         | `Array<Stop>`       | The list of bus stops you want to track.                       |
| `theme`       | `Theme`             | The color theme for the components. Provide the colors in hex. |
| `maintainers` | `Array<Maintainer>` | The list of developers that should be credited.                |

### Object: `Stop`

| Key         | Type            | Description                                                                                                                                                                                                                                                                                                                             |
| ----------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`      | `string`        | This allows you to set a nickname for the stop being tracked. If left blank, the `stop_name` of the first element in `stop_ids` will be used.                                                                                                                                                                                           |
| `stop_ids`  | `Array<string>` | You can group all of the various stations you wish to track together by inserting its corresponding `stop_id` in the array. If you need help finding a station's `stop_id`, you can download the [GTFS feeds](https://mta.info/developers) provided by the MTA.                                                                     |
| `walk_time` | `number`        | It may be unhelpful to include vehicles that will depart faster than it would take someone to walk to the station. `walk_time` should be the average time it takes for someone to comfortably walk from the location of the board to the station. All vehicles that will arrive in less than half the `walk_time` will not be included. |

### Object: `Theme`

| Key                | Type     | Description                                                         |
| ------------------ | -------- | ------------------------------------------------------------------- |
| `primary_color`    | `string` | This color will be used for the stop name title bar.                |
| `text_color`       | `string` | This color will be used on the text inside the stop name title bar. |
| `background_color` | `string` | This color will be used on the background of the page.              |

### Object: `Maintainer`

| Key         | Type     | Description                                                       |
| ----------- | -------- | ----------------------------------------------------------------- |
| `name`      | `string` | The name (full name, username, nickname, etc.) of the maintainer. |
| `github_id` | `number` | The GitHub account ID of the maintainer.                          |

## Deployment

> [!WARNING]
> Please install the optional tools to run `make`. Otherwise, you are able to manually run these commands by inspecting the `Makefile`.

Before you begin, run the following command to install the project dependencies.

```bash
make install
```

### Development

To build amd run the project for development, run each command in seperate terminals.

```bash
cd backend && cargo run
```

```bash
cd frontend && npm run dev
```

You can view the webpage at <http://localhost:5173>.

### Production

To build the project for production, run the following command.

```bash
make build
```

To run the project, run each command in seperate terminals.

```bash
cd backend && ./target/release/transit-board
```

```bash
cd frontend && npm run preview
```

You can view the webpage at <http://localhost:4173>.
