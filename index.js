const verboz = ((out, level=0) => {
  if (typeof level != "number")
    throw new Error("level must be int, got: " + level)

  return (lvl, msg) => {
    if (!msg) { msg = lvl; lvl=0 }
    if (lvl <= level) out(typeof msg == "function" ? msg() : msg)
  }
})

verboz.fromArgv = (out, argv) => verboz(out,
  (argv._ || argv).reduce((m,k) => (k == '-v' || k === '--verbose') ? m+1 : m, 0)
)

module.exports = verboz
