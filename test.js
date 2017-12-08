var test = require('tape')
var verboz = require('./index.js')

// returns [stub<Function>, result<Function>]
// result returns Array<Array> where each row represents one method call.
stub = () => {
  const argv=[]
  return [
    (...a) => {
      argv.push(a)
    },
    () => argv
  ]
}

test('stub', t => { t.plan(5)
  const [s,r] = stub()
  t.equal(r().length, 0)

  s("asdf")
  t.equal(r().length, 1)
  t.deepLooseEqual(r()[0], ["asdf"])

  s(null)
  s("qwerty", 3, "args")

  t.equal(r().length, 3)
  t.deepLooseEqual(r(), [["asdf"], [null], ["qwerty",3,"args"]])
})

test('verboz', t => { t.plan(2) 
  // is a fn
  t.equal(typeof verboz, 'function')

  // returns a fn
  t.equal(typeof verboz(), 'function')
})

test('verboz, no level', t => { t.plan(4)
  const [s1,r1] = stub()
  verboz(s1)("hey")
  t.equal(r1().length, 1)
  t.deepLooseEqual(r1()[0], ["hey"])

  const [s2,r2] = stub()
  verboz(s2, 0)("hey 0")
  t.equal(r2().length, 1)
  t.deepLooseEqual(r2()[0], ["hey 0"])
})

test('verboz, level', t => { t.plan(3)
  const [s,r] = stub()
  const v = verboz(s, 1)

  v(0, "hey 0")
  v(1, "hey 1")
  v(2, "hey 2")
  v(3, "hey 3")

  t.equal(r().length, 2)
  t.deepLooseEqual(r()[0], ["hey 0"])
  t.deepLooseEqual(r()[1], ["hey 1"])
})

test('verboz, no level or lvl', t => { t.plan(2)
  const [s,r] = stub()
  verboz(s)("hey")
  t.equal(r().length, 1)
  t.deepLooseEqual(r()[0], ["hey"])
})

test('#fromArgv, no level', t => { t.plan(1)
  const argv = require('minimist')(
    // faux process.argv.slice(2)
    [ '--', '-v', '-v', '--verbose', 'other', 'stuff' ]
    // necessary option to not parse -v and --verbose
    , {string: ['v','verbose']}
  )

  const [s,r] = stub()
  const v = verboz.fromArgv(s, argv._)
  v(3, "hey")
  v(4, "nope")
  v("yep") 
  t.deepLooseEqual(r(), [["hey"], ["yep"]])
})
