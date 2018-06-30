# chain
A middleware chain for plugins based only on async/await and dependency injections


## **Table of Contents**

- [Features](#features)
- [Motivations](#motivations)
- [Examples](#examples)
- [Installation](#installation)
- [How does it work?](#how-does-it-work)
- [API Documentation](#api-documentation)
- [Plugins](#plugins)
- [License](#license)

## Features

- __extremely simple__: the API exposes only _two function_ : `.use()` and `.run()` !
- __calls chainability__: isn't that obvious, it's a chain, so all calls can be chained on the previous one !
- __simple semantic__: to succeed, all links of the chain must provide a result, or else, the chain is broken !
- __dependency injection__: give all of your plugins all the goodies they want (free logger, free context, free tools...) so that they will require less dependencies !
- __recursivity__: a chain can be given to another chain and become a single link in a new process
- __tracability__: the api enforces giving chains and links a name so that every single step of execution can be very traceable !
- __no dependency__: yep

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
let chain('add')

// building a chain of treatment is as simple as chaining some functions together!
// conveniently, plugins are just normal functions
const plugin = () => {
  // replace all file contents with the string
  return files => files.map(file => {
    file.contents = `hey, what's up`
    return file
  })
}


```

Let's save this as `example.js`. To run it, you need Node.js version 7.6 or
higher. The latest stable version will work.

```sh
node example.js
```
