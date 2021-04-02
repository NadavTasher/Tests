# Tests

Tests is an automatic testing platform.

## Usage

Modify the configuration to add your tests:
```js
// Interval testing
registerInternal("test-name", (pass, fail) => {
    // Handler
}, 30 * Minutes);

// External testing
registerExternal("test-name", "token");
```

### Web-App integration

Add this to your web-apps:
```js
fetch("http://example.com/api/internal/status/?name=NAME"); // Fetch status of internal test
fetch("http://example.com/api/external/status/?name=NAME"); // Fetch status of external test
```

## External testing

You can update the state of an external test using these endpoints:
```
http://example.com/api/update/passed/?name=NAME&token=TOKEN
http://example.com/api/update/failed/?name=NAME&token=TOKEN
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)