function mostrarInventario(){

    let contenedor = document.getElementById("inventarioLista");
    contenedor.innerHTML = "";

    if(!db.productos || db.productos.length === 0){
        contenedor.innerHTML = "<p>No hay productos en inventario</p>";
        return;
    }

    /* 🔴 ELIMINAR AUTOMÁTICAMENTE SI STOCK = 0 */
    db.productos = db.productos.filter(p => p.stock > 0);

    db.productos.forEach((p, index)=>{

        let claseStock = "";

        /* 🔔 ALERTA + COLOR SUAVE CUANDO STOCK ES 3 O 2 */
        if(p.stock <= 3){
            claseStock = "stock-bajo";

            // Evitar que la alerta se repita
            if(!p.alertado){
                alert(`⚠️ Stock bajo: "${p.nombre}" tiene solo ${p.stock} unidades`);
                p.alertado = true;
            }
        }

        contenedor.innerHTML += `
        <div class="card ${claseStock}">
            <h3>${p.nombre}</h3>
            <p>💰 Precio: S/ ${p.precio}</p>
            <p>📦 Stock: <strong>${p.stock}</strong></p>
            <p>🧾 Costo: S/ ${p.costo}</p>

            <!-- BOTÓN ELIMINAR MANUAL -->
            <button onclick="eliminarProducto(${index})"
                    style="background:#dc3545;">
                🗑 Eliminar Producto
            </button>
        </div>
        `;
    });

    guardarDB();
}

function eliminarProducto(index){

    let producto = db.productos[index];
    if(!producto) return;

    let confirmar = confirm(
        `¿Seguro que deseas eliminar el producto "${producto.nombre}"?`
    );

    if(confirmar){
        db.productos.splice(index, 1);
        guardarDB();
        mostrarInventario();
    }
}