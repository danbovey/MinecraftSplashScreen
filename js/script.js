function loadSplashes(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'splashes.json', true);
    xobj.onreadystatechange = function() {
        if(xobj.readyState == 4 && xobj.status == "200") {
            callback(JSON.parse(xobj.responseText));
        }
    };
    xobj.send(null);
}

loadSplashes(function(splashes) {
    var rand =  Math.floor(Math.random() * (splashes.length + 1));
    var splash = splashes[rand];

    document.querySelector('.splash').textContent = splash;
});

// Panoramic Background

var camera, scene, renderer, controls;
var lon = 0, lat = 0, phi = 0, theta = 0;

init();
animate();

function init() {

    var container = document.getElementById( 'container' );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 100 );
    camera.position.z = 0.01;

    var textures = getTexturesFromAtlasFile( "img/panorama.jpg", 6 );

    var materials = [];

    for ( var i = 0; i < 6; i ++ ) {

        materials.push( new THREE.MeshBasicMaterial( { map: textures[ i ] } ) );

    }

    var skyBox = new THREE.Mesh( new THREE.CubeGeometry( 1, 1, 1 ), new THREE.MeshFaceMaterial( materials ) );
    skyBox.applyMatrix( new THREE.Matrix4().makeScale( 1, 1, - 1 ) );
    scene.add( skyBox );

    window.addEventListener( 'resize', onWindowResize, false );

}

function getTexturesFromAtlasFile( atlasImgUrl, tilesNum ) {

    var textures = [];

    for ( var i = 0; i < tilesNum; i ++ ) {

        textures[ i ] = new THREE.Texture();

    }

    var imageObj = new Image();

    imageObj.onload = function() {

        var canvas, context;
        var tileWidth = imageObj.height;

        for ( var i = 0; i < textures.length; i ++ ) {

            canvas = document.createElement( 'canvas' );
            context = canvas.getContext( '2d' );
            canvas.height = tileWidth;
            canvas.width = tileWidth;
            context.drawImage( imageObj, tileWidth * i, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth );
            textures[ i ].image = canvas
            textures[ i ].needsUpdate = true;

        }

    };

    imageObj.src = atlasImgUrl;

    return textures;

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    update();

}

var radX = 0;
var radY = 0;

function update() {

    radX += 0.001;
    radY += 0.0001;
    
    var x = -1 * Math.sin(radX) * Math.cos(radY);
    var y = Math.sin(radX) * Math.sin(radY);
    var z = Math.cos(radX);

    camera.position.set(0, 0, 0);
    camera.lookAt(new THREE.Vector3(x, y, z));

    renderer.render( scene, camera );

}