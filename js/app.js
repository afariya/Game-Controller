const scene = new THREE.Scene();

scene.background = new THREE.Color(0xf5f5f5);



// CAMERA
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 2, 18);



// RENDERER
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.shadowMap.enabled = true;

document.getElementById("container").appendChild(renderer.domElement);



// LIGHTS
const ambientLight = new THREE.AmbientLight(
    0xffffff,
    3
);

scene.add(ambientLight);


const directionalLight = new THREE.DirectionalLight(
    0xffffff,
    3
);

directionalLight.position.set(10,10,10);

scene.add(directionalLight);



// CONTROLS
const controls = new THREE.OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;



// VARIABLES
let controllerModel;

let rotateModel = false;

let wireframeEnabled = false;



// GLTF LOADER
const loader = new THREE.GLTFLoader();



// LOAD MODEL FUNCTION
function loadModel(modelPath){

    // REMOVE OLD MODEL
    if(controllerModel){

        scene.remove(controllerModel);

    }

    loader.load(

        modelPath,

        function(gltf){

            controllerModel = gltf.scene;

            scene.add(controllerModel);



            // SCALE
            controllerModel.scale.set(8,8,8);



            // CENTER MODEL
            const box = new THREE.Box3().setFromObject(controllerModel);

            const center = box.getCenter(new THREE.Vector3());

            controllerModel.position.sub(center);

            controllerModel.position.y = 1;



            // MATERIALS
            controllerModel.traverse((child)=>{

                if(child.isMesh){

                    let material;



                    // PLAYSTATION CONTROLLER
                    if(modelPath.includes("controller1")){

                        material = new THREE.MeshStandardMaterial({

                            color:0x2f2f2f,

                            metalness:0.5,

                            roughness:0.4

                        });

                    }



                    // XBOX CONTROLLER
                    else if(modelPath.includes("controller2")){

                        material = new THREE.MeshStandardMaterial({

                            color:0x107c10,

                            metalness:0.6,

                            roughness:0.3

                        });

                    }



                    // WII CONTROLLER
                    else if(modelPath.includes("controller3")){

                        material = new THREE.MeshStandardMaterial({

                            color:0xf5f5f5,

                            metalness:0.2,

                            roughness:0.6

                        });

                    }



                    // CLASSIC CONTROLLER
                    else{

                        material = new THREE.MeshStandardMaterial({

                            color:0x444444,

                            metalness:0.5,

                            roughness:0.4

                        });

                    }



                    child.material = material;

                    child.castShadow = true;

                    child.receiveShadow = true;

                    child.material.wireframe = wireframeEnabled;

                }

            });

        },

        undefined,

        function(error){

            console.error(error);

        }

    );

}



// LOAD DEFAULT MODEL
loadModel('models/controller1.glb');



// PLAYSTATION CONTROLLER
document.getElementById("controller1Btn").addEventListener("click", ()=>{

    loadModel('models/controller1.glb');

    document.getElementById("model-title").innerText =
    "PlayStation Controller";

    document.getElementById("model-description").innerText =
    "A modern PlayStation-inspired controller featuring symmetrical analog sticks and ergonomic gaming controls.";

});



// WII CONTROLLER
document.getElementById("controller2Btn").addEventListener("click", ()=>{

    loadModel('models/controller2.glb');

    document.getElementById("model-title").innerText =
    "Xbox Controller";

    document.getElementById("model-description").innerText =
    "An Xbox-inspired controller with asymmetrical thumbsticks and a competitive gaming design.";

});




// // XBOX CONTROLLER
document.getElementById("controller3Btn").addEventListener("click", ()=>{

    loadModel('models/controller3.glb');

    document.getElementById("model-title").innerText =
    "Classic Controller";

    document.getElementById("model-description").innerText =
    "The original custom-designed controller concept developed for the 3D application.";

});



// ROTATE BUTTON
document.getElementById("rotateBtn").addEventListener("click", ()=>{

    rotateModel = !rotateModel;

});



// WIREFRAME BUTTON
document.getElementById("wireframeBtn").addEventListener("click", ()=>{

    wireframeEnabled = !wireframeEnabled;

    if(controllerModel){

        controllerModel.traverse((child)=>{

            if(child.isMesh){

                child.material.wireframe = wireframeEnabled;

            }

        });

    }

});



// LIGHT BUTTON
document.getElementById("lightBtn").addEventListener("click", ()=>{

    directionalLight.visible = !directionalLight.visible;

});




// ANIMATION LOOP
function animate(){

    requestAnimationFrame(animate);

    controls.update();



    // ROTATION
    if(controllerModel && rotateModel){

        controllerModel.rotation.y += 0.01;

    }



    // FLOATING ANIMATION
    if(controllerModel){

        controllerModel.position.y =
        1 + Math.sin(Date.now() * 0.0015) * 0.2;

    }



    renderer.render(scene,camera);

}

animate();



// RESPONSIVE
window.addEventListener('resize', ()=>{

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

});
$("button").click(function(){

    $(this).fadeOut(100).fadeIn(100);

});