module.exports = function(grunt) {
  grunt.initConfig({
    uglify: {
      my_target : {
        options : {
          sourceMap : true,
          sourceMapName : 'sourceMap.map',
          mangle: false
        },
        files : {
          'tm.min.js' : [
            'main.js',
            'behaviors.js',
            'util.js',
            'queue.js',
            'psets.js',
            'cookies.js',
            'brush/*.js',
            'graph/*.js',
            'edges/*.js',
            'nodes/*.js',
            'menu/*.js',
            'menu/modal/*.js',
            'simulation/*.js',
            'server/*.js'
          ],
          'select.min.js' : [
            'psets.js', 
            'util.js', 
            'server/server.js', 
            'server/mock.js'
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);
};


