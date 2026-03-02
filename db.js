let db = {
    productos: JSON.parse(localStorage.getItem("productos")) || [],
    ventas: JSON.parse(localStorage.getItem("ventas")) || [],
    usuarios: JSON.parse(localStorage.getItem("usuarios")) || [
        { user: "admin", pass: "1234", rol: "admin" },
        { user: "vendedor", pass: "1234", rol: "vendedor" }
    ]
};

function guardarDB(){
    localStorage.setItem("productos", JSON.stringify(db.productos));
    localStorage.setItem("ventas", JSON.stringify(db.ventas));
    localStorage.setItem("usuarios", JSON.stringify(db.usuarios));
}