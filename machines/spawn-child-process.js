module.exports = {


  friendlyName: 'Spawn child process',


  description: 'Spawn a child process and have it run a command.',


  extendedDescription:
  'This uses the `child_process.spawn()` method from Node.js core.'+
  'The success exit from this machine will be called BEFORE the command has finished running (i.e. before the resulting child process exits).',


  moreInfoUrl: 'https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options',


  inputs: {

    command: {
      friendlyName: 'Command',
      description: 'The command to run in the child process.',
      example: 'man ls -la --help --foo=\'bar\'',
      required: true
    },

    dir: {
      friendlyName: 'Run from...',
      description: 'The path to the directory where this command will be run.',
      extendedDescription: 'If not set, this defaults to the present working directory.  If a relative path is provided, it will be resolved relative to the present working directory.',
      example: '/Users/mikermcneil/foo'
    },

    environmentVars: {
      friendlyName: 'Environment variables',
      description: 'A dictionary of environment variables to provide to the child process.',
      extendedDescription: 'By default, the same environment variables as in the current process will be used.  If specified, the dictionary should consist of the name of each environment variable as a key, and the value of the variable on the right-hand side.  The value of any environment variable is always a string.',
      example: {}
    },

  },


  exits: {

    success: {
      outputVariableName: 'childProcess',
      outputDescription: 'A Node child process instance.',
      moreInfoUrl: 'https://nodejs.org/api/child_process.html#child_process_class_childprocess',
      extendedDescription: 'By the time it is returned, a no-op `error` listener has already been bound to prevent accidental crashing in the event of an unexpected error.',
      example: '===',
    },

  },


  fn: function (inputs,exits) {

    var path = require('path');
    var util = require('util');
    var spawn = require('child_process').spawn;

    // First, build up the options to pass in to `child_process.spawn()`.
    var childProcOpts = {};

    // Determine the appropriate `cwd` for `child_process.spawn()`.
    if (util.isUndefined(inputs.dir)) {
      // Default directory to current working directory
      childProcOpts.cwd = process.cwd();
    }
    else {
      // (or if a `dir` was specified, resolve it to make sure
      //  it's an absolute path.)
      childProcOpts.cwd = path.resolve(inputs.dir);
    }

    // If `environmentVars` were provided, pass them in to `child_process.exec()`.
    if (!util.isUndefined(inputs.environmentVars)) {
      childProcOpts.env = inputs.environmentVars;
    }

    // Now spawn the child process and set up a no-op error listener to prevent crashing.
    var liveChildProc = spawn(inputs.command, childProcOpts);
    liveChildProc.on('error', function wheneverAnErrorIsEmitted(err){ /* ... */ });

    // Return live child process.
    return exits.success(liveChildProc);
  },



};
