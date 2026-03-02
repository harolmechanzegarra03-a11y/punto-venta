function registrarCompra(){

    let nombre = document.getElementById("nombre").value.trim();
    let costo = parseFloat(document.getElementById("costo").value);
    let precio = parseFloat(document.getElementById("precio").value);
    let cantidad = parseInt(document.getElementById("cantidad").value);
    let inputImagen = document.getElementById("imagen");

    // VALIDACIONES
    if(!nombre || isNaN(costo) || isNaN(precio) || isNaN(cantidad) || cantidad <= 0){
        alert("Complete correctamente todos los campos");
        return;
    }

    // ASEGURAR ESTRUCTURAS
    if(!db.productos) db.productos = [];
    if(!db.compras) db.compras = [];

    // FUNCIÓN INTERNA PARA GUARDAR
    function guardar(imagenBase64){

        let producto = db.productos.find(p => p.nombre === nombre);

        if(producto){
            producto.stock += cantidad;
            producto.costo = costo;
            producto.precio = precio;
            if(imagenBase64) producto.imagen = imagenBase64;
        } else {
            db.productos.push({
                nombre,
                costo,
                precio,
                stock: cantidad,
                imagen: imagenBase64 || null
            });
        }

        db.compras.push({
            nombre,
            costo,
            precio,
            cantidad,
            imagen: imagenBase64 || null,
            fecha: new Date().toISOString()
        });

        guardarDB();
        alert("✅ Compra registrada correctamente");

        // LIMPIAR FORMULARIO
        document.getElementById("nombre").value = "";
        document.getElementById("costo").value = "";
        document.getElementById("precio").value = "";
        document.getElementById("cantidad").value = "";
        if(inputImagen) inputImagen.value = "";
    }

    // SI HAY IMAGEN → CONVERTIR A BASE64
    if(inputImagen && inputImagen.files && inputImagen.files[0]){
        let reader = new FileReader();
        reader.onload = function(e){
            guardar(e.target.result);
        };
        reader.readAsDataURL(inputImagen.files[0]);
    } 
    // SIN IMAGEN
    else {
        guardar(null);
    }
}