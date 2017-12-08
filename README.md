# verboz

CLI-type verbosity-level "logger". Probably works in the browser, but originally intended for CLI apps.

## Usage

    const argv = require('minimist')(process.argv.slice(2), {string: ['v','verbose']})
    const verboz = require('verboz').fromArgv(console.log, argv)

    // $> node -- -v
    verboz("asdf", "isn't", ['qwerty'])
    // => no output

    verboz(2, "asdf", "isn't", ['qwerty'])
    // => console.log("asdf", "isn't", ['qwerty'])

The more `--verbose` flags passed on the command-line, the higher the debugging level and [generally] more output.

## API
### verboz(out, count)
Set up logging to function `out`. Returns function with signature [level], Array<Any> msg). If `level` >= `count` call `out(msg)`.

### verboz#fromArgv(out, argv)
Parse `minimist` output counting up the --verbose and -v flags to arrive at a level. Call `verboz(out, <count>)`

