const url = 'http://localhost:3000/api';

async function testAPI() {
    console.log("🟡 Iniciando pruebas manuales a la API...");

    // 1. Crear un usuario random
    const randomEmail = `test${Date.now()}@api.com`;
    console.log(`\n➡️  Creando usuario: ${randomEmail}`);

    let res = await fetch(`${url}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nombre: "Usuario de Prueba",
            correo: randomEmail,
            password: "password123",
            edad: 25,
            rol: "cliente"
        })
    });

    let data = await res.json();
    if (!res.ok) {
        console.error("❌ Error creando usuario:", data);
        return;
    }
    console.log("✅ Usuario creado exitosamente!");

    // 2. Hacer Login para obtener el JWT
    console.log(`\n➡️  Haciendo Login con ${randomEmail}...`);
    res = await fetch(`${url}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            correo: randomEmail,
            password: "password123"
        })
    });

    data = await res.json();
    if (!res.ok) {
        console.error("❌ Error en Login:", data);
        return;
    }
    const token = data.token;
    console.log("✅ Login exitoso. JWT obtenido!");

    // 3. Probar la IA (Generar Descripción) usando el Token
    console.log(`\n➡️  Probando Gemini IA (Generar Descripción de Producto)...`);
    res = await fetch(`${url}/productos/ia/generar-descripcion`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            nombre: "Samsung Galaxy S24 Ultra",
            atributos_claves: "Cámara 200MP, Titanio, Inteligencia Artificial avanzada, pantalla de 6.8 pulgadas"
        })
    });

    data = await res.json();
    if (!res.ok) {
        console.error("❌ Error con la IA:", data);
        return;
    }

    console.log("\n✅ ¡Magia de la IA funcionando!");
    console.log("-------------------------------------------------");
    console.log("Descripción Generada:\n" + data.descripcion);
    console.log("-------------------------------------------------");

    console.log("\n🟢 ¡TODAS LAS PRUEBAS PASARON CORRECTAMENTE!");
}

testAPI();
