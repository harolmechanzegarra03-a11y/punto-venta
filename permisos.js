function verificarRol(){
    let rol = localStorage.getItem("rolActivo");

    if(!rol){
        window.location.href = "../login.html";
    
    }

    if(rol === "trabajador"){
        document.querySelectorAll(".solo-admin")
        .forEach(e => e.style.display = "none");
    }
}

function volver(){
    window.history.back();
}