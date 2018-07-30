// These are the defaults options when you build a new chain
const _DEFAULTS = {
	ensureName: false, // Enforce every plugin function to have a name (for tracability)
	wrapper: basicWrapper, // See below : logging and timing of every plugin execution
	inject: [], // A list of dependency injections is given here
	debug: console.log // Can be replaced by any logger package and injected in the chain after
};

/**
 * Let chain = new Chain('do it')
 */
class Chain {
	constructor(name, opts = {}, plugins = []) {
		if (typeof name !== 'string') {
			Chain.exit('Every chain must be given a name');
		}
		if ('inject' in opts && !Array.isArray(opts.inject)) {
			Chain.exit(`Parameters to inject must be an array. ie: inject=[ctx, logger]`);
		}

		this.name = name;
		this.opts = Object.assign({}, _DEFAULTS, opts);
		this.steps = [];
		this.history = [];

		plugins.forEach(plugin => this.use(plugin));
	}

	/**
	 * Adds a new plugin to the list of steps in this chain
	 * @param {Function|Runnable} fn a new plugin
	 * @return {Chain}
	 */
	use(fn) {
		const chain = this;
		const {opts, steps} = chain;

		if (opts.ensureName && !fn.name) {
			Chain.exit(`Option ensureName tells us that any chain middleware must be given a name to ensure maximum tracability
      (anonymous function are not allowed).
      Reported plugin is ${fn}`);
		}

		if (typeof fn.run === 'function') {
			// That's great ! we now how to run this
			if (fn instanceof Chain) {
				fn.opts.inject = opts.inject.concat(fn.opts.inject); // Inject ourn own dependencies
			}
			steps.push(fn);
			return chain;
		}

		const wrapped = opts.wrapper(fn, opts);

		if (typeof wrapped !== 'function') {
			Chain.exit(`Plugin wrapper ${opts.wrapper.name} didn't return a function.`);
		}
		steps.push(wrapped);

		return chain;
	}

	/**
	 * Runs the chain after it has been defined
	 * If anything bad happens, it will just reports 
	 * and exit with an error code !
	 * (no UnhandledPromiseRejectionError)
	 */
	async run(/* any params here will be passed to the first plugin in the chain */) {
		const {name, opts, steps, history} = this;
		const debug = opts.debug || console.log;
		let args = ChainArguments.from(arguments);
		history.push({run: args});

		debug(`Chain ${name} has started`);

		let i = 0,
			plugin, stepResult, run;
		while (plugin = steps[i++]) {
			try {
				run = plugin.run || plugin;
				args = ChainArguments.inject(
					stepResult || args,
					plugin instanceof Chain ? [] : opts.inject // Because a sub-chain has allready all the dependencies to inject
				);
				stepResult = await run.apply(plugin, args);
				history.push({step: plugin.toString(), result: stepResult});
			} catch (err) {
				debug(`${name} has failed on step ${i} (${plugin})`);
				Chain.exit(err);
			}
		}

		debug(`Chain ${name} has succeeded`);
		return stepResult;
	}

	/**
	 * When something has gone wrong..
	 * @param {String|Error} err
	 */
	static exit(err) {
		if (typeof err === 'string') {
			err = new Error(err);
		}
		console.error(err);
		process.exit(1);
	}

	/**
	 * Helps plugins to return more than one arguments
	 * to be passed to their successors in the chain
	 * Usage: inside a plugin
	 * > return Chain.arguments(result1, result2, ..)
	 */
	static arguments() {
		return ChainArguments.constructor.apply(null, arguments);
	}

	toString() {
		return this.name;
	}
}

/**
 * A wrapper for several arguments to be passed to the next plugin
 */
class ChainArguments {
	constructor() {
		this.args = [...arguments];
	}

	inject(dependencies) {
		return this.args.concat(dependencies);
	}

	static from(arr) {
		if (!arr || !('length' in arr)) {
			throw new Error('ChainArguments.from() must receive an array');
		}
		return new ChainArguments(...arr);
	}

	static inject(result, dependencies = []) {
		if (result === undefined) {
			return dependencies;
		}
		if (result instanceof ChainArguments) {
			return result.inject(dependencies);
		}
		return [result].concat(dependencies);
	}
}

/**
 * This basic wrapper logs the start and end time of the plugin's execution
 * @param {Function} fn a plugin
 * @param {Object} opts Chain options
 */
function basicWrapper(fn, opts) {
	const wrapper = async function () {
		const args = [...arguments];
		const pluginName = fn.name || (fn.toString().substr(0, 40) + ' (...)');
		try {
			opts.debug(`Plugin ${pluginName} is starting`);
			const start   = Date.now();
			const result  = await fn.apply(fn, args);
			const elapsed = Date.now() - start;
			opts.debug(`Plugin ${pluginName} has returned after ${elapsed}ms`);
			return result;
		} catch (err) {
			Chain.exit(`Plugin ${pluginName} execution has failed`);
		}
	};
	return wrapper;
}

module.exports = (name, opts, plugins) => new Chain(name, opts, plugins);
module.exports.Chain = Chain;
