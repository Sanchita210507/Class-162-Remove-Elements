AFRAME.registerComponent("bullets",{

init:function(){
     this.showBullet()
},

showBullet:function(){
    window.addEventListener("keydown", (e)=>{
        if(e.key === "z"){
            var bullet = document.createElement("a-entity")
            bullet.setAttribute("geometry", {primitive : "sphere", radius : 0.1})
            bullet.setAttribute("material", {color : "black"})
            var cam = document.querySelector("#camera")
               pos = cam.getAttribute("position")
            bullet.setAttribute("position", {x : pos.x, y : pos.y, z : pos.z})
            // to access the camera entity as three.js object we use .object3D
            var camera = document.querySelector("#camera").object3D
            //get the camera direction as Three.js Vector
            var direction = new THREE.Vector3()
             //get the direction of camera element we use .getWorldDirection
            camera.getWorldDirection(direction)
            // multiplyScalar is used to increase the speed of bullet
            bullet.setAttribute("velocity", direction.multiplyScalar(-10))
            bullet.setAttribute("dynamic-body", {shape:"sphere", mass : 0})
            bullet.addEventListener("collide", this.removeBullet)
            var scene = document.querySelector("#scene")
            scene.appendChild(bullet)
        }
    })
},

removeBullet:function( e){
    //Original entity (bullet)
    //gives the details about the original entity on which the event has been triggered
    console.log(e.detail.target.el);

    //Other entity, which bullet touched.
    console.log(e.detail.body.el);

    var element = e.detail.target.el
    var elementHit = e.detail.body.el

    if(elementHit.id.includes("box")){
        elementHit.setAttribute("material", {opacity : 1, transparent : true})
        // Impulse and Point Vector

        //A-Frame 3D physics system is built on a JavaScript physics engine library called Cannon.js
        var impulse = new CANNON.Vec3(-2, 2, 1)
        // Copying something, in this case copying the position
        var worldPoint = new CANNON.Vec3().copy(elementHit.getAttribute("position"))
        // having two values, impulse - amount of impulse added to the body, worldPoint - Point at which force is applied
        elementHit.body.applyImpulse(impulse, worldPoint)
        
        element.removeEventListener("collide", this.shoot)
        var scene = document.querySelector("#scene")
        scene.removeChild(element)
    }

}
})