module.exports = function(grunt) {
  grunt.initConfig({
    uglify: {
      my_target : {
        options : {
          sourceMap : true,
          sourceMapName : 'sourceMap.map',
        },
        files : {
          'tm.min.js' : [
            'main.js', 
            'behaviors.js', 
            'util.js', 
            'queue.js', 
            'psets.js', 

            'brush/brush.js', 

            'graph/graph.js', 
            'graph/delete.js', 
            'cookie.js', 

            'edges/edges.js', 
            'edges/initial.js', 
            'edges/selection.js', 
            'edges/dragging.js', 
            'edges/edit.js', 

            'nodes/nodes.js', 
            'nodes/edit.js', 
            'nodes/movement.js', 
            'nodes/selection.js', 
            'nodes/doubleclicking.js', 
            'nodes/snaptogrid.js', 
            'nodes/forcedirected.js', 

            'menu/top.js', 
            'menu/modal/tapeSet.js',
            'menu/modal/modal.js', 
            'menu/modal/saveas.js', 
            'menu/modal/submit.js', 
            'menu/modal/load.js', 
            'menu/modal/confirm.js', 
            'menu/modal/edge.js', 
            'menu/modal/testing.js', 
            'menu/modal/node.js', 
            'menu/modal/tmedge.js', 
            'menu/table.js', 
            'menu/tabletop.js', 
            'menu/test.js', 
            'menu/error.js', 

            'simulation/dfa.js', 
            'simulation/nfa.js', 
            'simulation/tm.js', 
            'simulation/sim.js', 
            'simulation/bulk.js', 
            'simulation/tape.js', 

            'server/server.js', 
            'server/mock.js', 
          ],
          'select.min.js' : [
            'psets.js',
            'util.js',
            'server/server.js',
            'server/mock.js',
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);
};


