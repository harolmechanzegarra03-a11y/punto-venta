function login(){
    let user = document.getElementById("usuario").value;
    let pass = document.getElementById("password").value;

    let encontrado = db.usuarios.find(u => u.user === user && u.pass === pass);

    if(encontrado){
        localStorage.setItem("rolActivo", encontrado.rol);

        // 🔥 redirección inteligente
        if(encontrado.rol === "admin"){
            window.location.href = "pages/ventas.html";
        } else {
            window.location.href = "pages/ventas.html";
        }

    } else {
        alert("Usuario incorrecto");
    }
}
function cerrarSesion(){
    localStorage.removeItem("usuarioActivo");
    localStorage.removeItem("rolActivo");
    window.location.href = "login.html";
}