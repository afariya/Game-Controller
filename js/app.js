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



// LOADER
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

                    let material = new THREE.MeshStandardMaterial({

                        color:0x444444,

                        metalness:0.5,

                        roughness:0.4

                    });



                    // BUTTON COLORS
                    const name = child.name.toLowerCase();



                    if(name.includes("button")){

                        material.color.set(0x0066ff);

                    }



                    if(name.includes("stick")){

                        material.color.set(0xcfcfcf);

                    }



                    if(name.includes("trigger")){

                        material.color.set(0x222222);

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
loadModel('models/controller.glb');



// MODEL BUTTONS
document.getElementById("controller1Btn").addEventListener("click", ()=>{

    loadModel('models/controller.glb');

});


document.getElementById("controller2Btn").addEventListener("click", ()=>{

    loadModel('models/controller1.glb');

});


document.getElementById("controller3Btn").addEventListener("click", ()=>{

    loadModel('models/controller2.glb');

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

    if(controllerModel && rotateModel){

        controllerModel.rotation.y += 0.01;

    }

    renderer.render(scene,camera);

}

animate();



// RESPONSIVE
window.addEventListener('resize', ()=>{

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

});S