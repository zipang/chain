# chain
A middleware chain for plugins based only on async/await and dependency injections


## **Table of Contents**

- [Features](#features)
- [Motivations](#motivations)
- [Examples](#examples)
- [Installation](#installation)
- [How does it work?](#how-does-it-work)
- [API Documentation](#api-documentation)
- [License](#license)

## Features

- __extremely simple__: the API exposes only _two function_ : `.use()` and `.run()` !
- __chainability__: isn't that obvious, it's a chain, so all calls can be chained onto the previous one !
- __simple semantic__: to succeed, all links of the chain must give back a result, a single exception and the chain is broken !
- __dependency injection__: give all of your plugins all the goodies they want (free logger, free context, free tools...) so that they will require less dependencies !
- __recursivity__: a chain can be given to another chain and become a single link in a new process
- __tracability__: the api enforces giving chains and plugins a name so that every single step of execution can be very traceable !
- __no dependency__: yep

## Motivations

### adios callback hell and outdated libraries

There is a great deal of chain middlewares around there.
So why a new one ?
The answer to this question is quite simple : _to go forward !_, and to get rid of all the outdated libraries that were based on the `callback(err, ..)` paradigm (otherwise known as _callback-hell_)
We think that this programmatic paradigm has served node.JS well (pretty well in fact as it radically redefined the asynchronous way of thinking for programmers), but now that a powerful replacement is available _natively_ in the form of the `async/await` statements, it's time to leave that past in the dust...

So, simply told : the _chain_ middleware does not support the `callback(err, what)` paradigm.

### dependency injections

That's the other _strongest motivation_ for this library : a lot of these other libraries totally forgot another key point of interest of using a middleware framework : the freebies !

I mean, 


## Installation

You'll need Node.js __8__ or higher then, type in the console and in your project's directory :

```sh
npm install --save chain
```
or 
```sh
yarn add chain
```

## Example

Now, let's write a simple program that (...)

```js
const chain = require('chain')

// let's write the most simple chain
chain('hello', {ensurePluginName: false}).use(str => str + ' World').use(console.log).run('Hello')

```

