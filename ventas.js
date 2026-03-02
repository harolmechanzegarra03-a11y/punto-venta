let carrito = [];

function mostrarVentas(){
    let contenedor = document.getElementById("listaProductos");
    contenedor.innerHTML = "";

    db.productos.forEach((p,index)=>{
        contenedor.innerHTML += `
        <div class="card">

            ${p.imagen ? `
                <img src="${p.imagen}"
                     style="width:80px;height:80px;object-fit:cover;border-radius:8px;">
            ` : ""}

            <h3>${p.nombre}</h3>
            <p>Precio: S/ ${p.precio}</p>
            <p>Stock: ${p.stock}</p>

            <input type="number" min="1" value="1" id="cant${index}">
            <button onclick="agregarCarrito(${index})">Agregar</button>

        </div>`;
    });

    actualizarCarrito();
}

function agregarCarrito(index){
    let cantidad = parseInt(document.getElementById("cant"+index).value);
    let producto = db.productos[index];

    if(producto.stock >= cantidad){

        carrito.push({
            nombre: producto.nombre,
            precio: producto.precio,
            costo: producto.costo,
            cantidad: cantidad,
            descuento: 0,
            subtotal: producto.precio * cantidad,
            gananciaItem: (producto.precio - producto.costo) * cantidad,
            imagen: producto.imagen || null
        });

        actualizarCarrito();

    } else {
        alert("Stock insuficiente");
    }
}

function actualizarCarrito(){
    let div = document.getElementById("carrito");
    if(!div) return;

    let total = 0;
    div.innerHTML = "<h3>Carrito</h3>";

    carrito.forEach((item,i)=>{

        let subtotalItem = (item.precio * item.cantidad) - item.descuento;
        item.subtotal = subtotalItem;
        item.gananciaItem = (item.precio - item.costo) * item.cantidad - item.descuento;

        total += subtotalItem;

        div.innerHTML += `
        <div style="display:flex; gap:10px; align-items:center; margin-bottom:10px;">

            ${item.imagen ? `
                <img src="${item.imagen}"
                     style="width:40px;height:40px;object-fit:cover;border-radius:6px;">
            ` : ""}

            <div style="flex:1">
                <strong>${item.nombre}</strong> x${item.cantidad}
                <br>
                Subtotal: S/ ${subtotalItem.toFixed(2)}
                <br>
                Descuento: S/ ${item.descuento.toFixed(2)}
                <br>

                <input type="number"
                       min="0"
                       max="${item.precio * item.cantidad}"
                       value="${item.descuento}"
                       onchange="actualizarDescuento(${i}, this.value)">
            </div>

            <!-- 🗑️ NUEVO BOTÓN ELIMINAR -->
            <button onclick="eliminarDelCarrito(${i})"
                    style="background:#dc3545;color:white;border:none;
                           padding:6px 10px;border-radius:5px;cursor:pointer;">
                ❌
            </button>

        </div>
        <hr>
        `;
    });

    div.innerHTML += `<h2>Total Final: S/ ${total.toFixed(2)}</h2>`;
}

/* ✅ NUEVA FUNCIÓN ELIMINAR */
function eliminarDelCarrito(index){
    carrito.splice(index, 1);
    actualizarCarrito();
}

function actualizarDescuento(index, valor){
    let desc = Number(valor) || 0;
    if(desc < 0) desc = 0;

    let item = carrito[index];

    if(desc > item.precio * item.cantidad){
        desc = item.precio * item.cantidad;
    }

    item.descuento = desc;
    actualizarCarrito();
}

function finalizarVenta(){

    if(carrito.length === 0){
        alert("El carrito está vacío");
        return;
    }

    let rol = localStorage.getItem("rolActivo");
    let fechaActual = new Date();

    let detalle = [];
    let totalVenta = 0;
    let totalCosto = 0;

    carrito.forEach(item=>{

        let producto = db.productos.find(p=>p.nombre === item.nombre);
        producto.stock -= item.cantidad;

        totalVenta += item.subtotal;
        totalCosto += item.costo * item.cantidad;

        detalle.push({
            nombre: item.nombre,
            precio: item.precio,
            costo: item.costo,
            cantidad: item.cantidad,
            descuento: item.descuento,
            subtotal: item.subtotal,
            gananciaItem: item.gananciaItem,
            imagen: item.imagen || null
        });

    });

    db.ventas.push({
        id: Date.now(),
        trabajador: rol,
        fecha: fechaActual.toISOString(),
        detalle: detalle,
        total: totalVenta,
        ganancia: totalVenta - totalCosto
    });

    carrito = [];
    guardarDB();
    mostrarVentas();

    alert("Venta registrada correctamente");
}