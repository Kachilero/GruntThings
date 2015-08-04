/**
Walking through grunts basic file from website
http://gruntjs.com/sample-gruntfile
*/

// Wrapper that encapsulates the grunt configuration
module.exports = function(grunt) {
  // Initialize configuration object
  grunt.initConfig({
    // grunt seems to have a logging function
    log: {
      foo: [1,2,3],
      bar: 'hello world',
      baz: false
    },

    // read project settings from package.json, so we can refer to it later
    pkg: grunt.file.readJSON('package.json')

    // Now we define configurations for each task which corresponds
    // to items in the package.json
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: ';'
      },
      dist: {
        // the files to concatenate
        src: ['src/**/*.js'], // path to files
        // the location of the resulting JS file
        dest: 'dist/<%= pkg.name %>.js'
        /**
        Note that this refers to the same property in the package.json file.
        It accesses this using pkg.name as earlier we defined the pkg property
        to be the result of loading the package.json file, which is then
        parsed to a JavaScript object. Grunt has simple template engine to
        output the values of properties in the configuration object.
        Here I tell the concat task to concatenate
        all files that exist within src/ and end in .js.
        */
      }
    }, // end concat

    uglify: {
      options: {
        // the banner is inserted at the top of the output
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        // this tells uglify to create a minified file within /dist
        // it uses <%= concat.dist.dest %> so uglify will minify the file
        // that concat produces
        'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
      }
    }, // end uglify

    qunit: {
      // QUnit just needs the location of the test runner files
      files: ['test/**/*.html']
    } // end qunit

    jshint: {
      // define the files to lint
      files: ['gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      // configure JSHint (documented at http://www.jshint.com/docs/)
      options: {
        // more options here if you want to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    }, // end jshint

    watch: {
      // this uses the same files that jshint is checking
      files: ['<%= jshint.files %>'],
      // it runs these tasks in the order that they are listed
      tasks: ['jshint', 'qunit']
    } // end watch
  }); // end config

  // We load the Grunt plugins we need. These should be install
  // through npm Note that this is outside config
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // sets up the tasks for the cli. The most important is the default
  // this would be run by typing "grunt test" on the command line
  grunt.registerTask('test', ['jshint', 'qunit']);
  // the default task can be run just by typing "grunt" on the command line
  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
  // this runs the tasks with "dist" as an argument
  grunt.registerTask('dist', ['concat:dist', 'uglify:dist']);
  /**
  Multi tasks can be run with grunt.registerMultiTask(taskName, [description, ] taskFunction)
  Most "grunt-contrib" modules are multi-task
  */
  grunt.registerMultiTask('log', 'Log Stuff', function() {
    grunt.log.writeln(this.target + ': ' + this.data);
  });
} // end module.exports
