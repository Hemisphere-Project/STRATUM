CHASER_FPS = 50

// Load Hnode library
var hnode = require('./Hnode')({
  // This is the default options when calling require('./Hnode')()
  PORT_SERVER: 3737, // Working UDP port
  TIME_TICK: 100, // Watchdog timer ms
  TIME_OFFLINE: 1000, // Offline Time
  TIME_GONE: 3000, // Gone Time
  NLEDS_STRIPS: 178, // N leds per strips
  NSTRIPS_CLIENT: 4, // N strips per client
  CLIENT_FRAME_RATE: 60, // UDP FRAME / secondes
  log : msg => console.log(msg) // custom log function (to write in file, etc)
});


// Create new server
var server = new hnode.Server();

// Event: when a new node is detected
server.on('newnode', function(node) {

  // Event: when the node start
  node.on('start', function(node){
    console.log('start '+this.ip+' '+this.name+' (v'+this.version+')')
    console.log('TOTAL nodes: '+server.getAllNodes().length)

    var nList = []
    server.getAllNodes().forEach((node) => { nList.push(node.name.split('-')[1]) });

    console.log('ALL nodes: '+nList.sort())
  });

  // Event: when the node goes online
  //node.on('online', function(node){ console.log('online '+this.ip+' '+this.name) });

  // Event: when the node goes offline
  //node.on('offline', function(node){ console.log('offline '+this.ip+' '+this.name) });

  // Event: when the node stop
  node.on('stop', function(node){ console.log('stop '+this.ip+' '+this.name) });

  // Event: when the node stop
  node.on('fps', function(fps){ console.log('FPS '+this.name+' '+fps) });

  // node.on('sent', function(msg){ console.log('MSG '+this.name+' '+msg) });


  // Manual locked rate
  // node.lockRate(0.0001);

});

// Set up a custom animation
var count = 0;
function animate() {
  this.blackout();          // switch off every leds
  var CC = 0;
  this.getAllNodes().forEach(function(node) {
    max = 255
    color = [[0,0,max],[0,max,0],[max,0,0],[max,max,max]]
    color = [[max,max,max],[max,max,max],[max,max,max],[max,max,max]]
   // 	color = [255,255,255]
   	//if ((count % 90) == 10) color = [255,0,0]

    // if (count%100 > 10)
    // for (var k=0; k<90; k++) {
    // node.setLed(0, k, color);
    // node.setLed(1, k, color);
    // node.setLed(2, k, color);
    //   node.setLed(3, k, color);
    // }

    // CHASER
    if (false) {

      for (var i=0; i<4; i++) {
        //var led = (count+CC*10+i*8)%178
        var led = count%178;
        node.setLed(i, (177-led), color[i]);
        node.setLed(i, led, color[i]);
      }
    }

    // BLINK IN/OUT
    else if (false) {
      var p = 100
      for (var i=0; i<4; i++)
        if (count%p < p/2)
          for (var l=0; l<89; l++)
            node.setLed(i, l, color[i])
        else
          for (var l=89; l<178; l++)
            node.setLed(i, l, color[i])
    }

    // BREATH
    else if (false) {
      var amp = 150
      var c = count%(amp*2)
      if (c > amp) c = amp*2 - c
      //c = c*c/255
      // console.log(c)
      for (var i=0; i<4; i++)
        for (var l=0; l<178; l++)
          node.setLed(i, l, [c,c,c])
    }

    // STARSHOT
    else if (false) {
      var amp = 150
      var c = count%(amp*2)
      if (c > amp) c = amp*2 - c
      // console.log(c)
      for (var i=0; i<4; i++)
          if (Math.random() >= 0.0) for (var l=0; l<98; l++)
            if (Math.random() >= 0.95) {
              node.setLed(i, l, [255,255,255])
              node.setLed(i, l+87, [255,255,Math.random()*255])
            }
    }
    
    // ALL IN
    else if (true) {
      var amp = 200
      for (var i=0; i<4; i++)
        for (var l=0; l<178; l++)
          node.setLed(i, l, [amp,amp,amp])
    }

    CC += 1;

  });
  count += 1;

}

// Bind animation to Server sequencer
server.on('tick', animate);

// Set Server sequencer timing @ 50 FPS
server.setRate(1000/CHASER_FPS);

// Start server
server.start();
