// CONFIGURACIÓN DEL NEGOCIO
const TELEFONO_BARBERIA = "595983114266"; 

// FUNCIÓN: Confirmar Reserva (SOLO WHATSAPP)
function confirmarReserva() {
    const servicio = document.getElementById('servicioSelect').value;
    const nombre = document.getElementById('nombreInput').value;
    const telefono = document.getElementById('telefonoInput').value;
    const mensajeEstado = document.getElementById('mensajeEstado');

    // Validar que se hayan completado los campos
    if (!nombre || !telefono) {
        mensajeEstado.innerText = "⚠ Faltan datos. Por favor completa nombre y teléfono.";
        mensajeEstado.className = "text-center mt-4 text-sm font-bold text-red-500 h-6";
        return;
    }

    mensajeEstado.innerText = "✅ Abriendo WhatsApp...";
    mensajeEstado.className = "text-center mt-4 text-sm font-bold text-neon h-6";

    // Armamos el mensaje simple con los datos
    const mensajeWhatsApp = `Hola MB STUDIO, quiero agendar un turno.\n\n👤 *Soy:* ${nombre}\n✂ *Servicio:* ${servicio}\n📞 *Tel:* ${telefono}`;

    const urlWhatsApp = `https://wa.me/${TELEFONO_BARBERIA}?text=${encodeURIComponent(mensajeWhatsApp)}`;

    // Abrir WhatsApp y recargar la página
    setTimeout(() => {
        window.open(urlWhatsApp, '_blank');
        location.reload();
    }, 1000);
}
