// --- CONFIGURACIÓN DEL NEGOCIO ---
const TELEFONO_BARBERIA = "595983114266"; // <--- ¡CAMBIA ESTO POR EL NÚMERO DEL DUEÑO!
const HORARIO_INICIO = 9; // 9:00 AM
const HORARIO_FIN = 20;   // 8:00 PM (20:00)

document.addEventListener('DOMContentLoaded', () => {
    const fechaInput = document.getElementById('fechaInput');
    
    // Configurar fecha mínima (hoy) para no reservar en el pasado
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.min = hoy;

    // Escuchar cambios en la fecha para cargar horarios
    fechaInput.addEventListener('change', (e) => {
        cargarHorarios(e.target.value);
    });
});

// FUNCIÓN 1: Cargar y Pintar Horarios
async function cargarHorarios(fechaSeleccionada) {
    const grid = document.getElementById('horariosGrid');
    const mensaje = document.getElementById('mensajeEstado');
    grid.innerHTML = '<p class="col-span-full text-neon animate-pulse">Verificando disponibilidad en base de datos...</p>';
    mensaje.innerText = "";

    // 1. Consultar a Supabase qué horas ya están ocupadas ese día
    const { data: reservasOcupadas, error } = await _supabase
        .from('reservas')
        .select('hora')
        .eq('fecha', fechaSeleccionada);

    if (error) {
        console.error("Error BD:", error);
        grid.innerHTML = '<p class="text-red-500">Error al conectar. Intenta recargar.</p>';
        return;
    }

    // Convertimos el array de objetos a un array simple de horas (ej: ["15:00", "16:00"])
    const horasOcupadas = reservasOcupadas.map(r => r.hora);

    // 2. Limpiar grid y generar botones
    grid.innerHTML = '';

    // Bucle para crear botones desde hora inicio hasta fin
    for (let i = HORARIO_INICIO; i <= HORARIO_FIN; i++) {
        const horaStr = `${i}:00`;
        const boton = document.createElement('button');
        
        boton.innerText = horaStr;
        boton.className = 'p-3 rounded border text-sm font-bold transition duration-300 interactable';

        // Lógica de Estado (Libre vs Ocupado)
        if (horasOcupadas.includes(horaStr)) {
            // OCUPADO
            boton.classList.add('bg-red-900/20', 'border-red-900', 'text-red-500', 'cursor-not-allowed', 'opacity-50');
            boton.disabled = true;
            boton.title = "Ya reservado";
        } else {
            // LIBRE
            boton.classList.add('bg-dark', 'border-gray-700', 'text-white', 'hover:border-neon', 'hover:text-neon', 'hover:shadow-[0_0_10px_#00ffcc]');
            boton.onclick = () => seleccionarHora(boton, horaStr);
        }

        grid.appendChild(boton);
    }
}

// FUNCIÓN 2: Seleccionar una hora visualmente
function seleccionarHora(boton, hora) {
    // Quitar clase 'seleccionado' a todos
    const botones = document.getElementById('horariosGrid').querySelectorAll('button');
    botones.forEach(b => {
        if (!b.disabled) {
            b.classList.remove('bg-neon', 'text-black', 'border-neon');
            b.classList.add('bg-dark', 'text-white');
        }
    });

    // Marcar el actual
    boton.classList.remove('bg-dark', 'text-white');
    boton.classList.add('bg-neon', 'text-black', 'border-neon');

    // Guardar en el input oculto
    document.getElementById('horaSeleccionada').value = hora;
}

// FUNCIÓN 3: Confirmar Reserva (Guardar en BD + WhatsApp + Google Calendar)
async function confirmarReserva() {
    const servicio = document.getElementById('servicioSelect').value;
    const fecha = document.getElementById('fechaInput').value;
    const hora = document.getElementById('horaSeleccionada').value;
    const nombre = document.getElementById('nombreInput').value;
    const telefono = document.getElementById('telefonoInput').value;
    const mensajeEstado = document.getElementById('mensajeEstado');

    // Validaciones
    if (!fecha || !hora || !nombre || !telefono) {
        mensajeEstado.innerText = "⚠ Faltan datos. Por favor completa todo.";
        mensajeEstado.className = "text-center mt-4 text-sm font-bold text-red-500 h-6";
        return;
    }

    mensajeEstado.innerText = "⏳ Guardando tu lugar...";
    mensajeEstado.className = "text-center mt-4 text-sm font-bold text-neon h-6";

    // 1. Guardar en Supabase
    const { error } = await _supabase
        .from('reservas')
        .insert([{ fecha, hora, cliente_nombre: nombre, cliente_telefono: telefono, servicio }]);

    if (error) {
        mensajeEstado.innerText = "❌ Error al guardar. Tal vez alguien ganó el lugar.";
        return;
    }

    // 2. Generar Link de Google Calendar
    // Formato de fecha para Google: YYYYMMDDTHHMMSS
    const fechaLimpia = fecha.replace(/-/g, '');
    const horaLimpia = hora.replace(':', ''); 
    // Calculamos hora fin (1 hora después)
    const horaFinNum = parseInt(horaLimpia) + 100; // Suma 1 hora (ej 1500 -> 1600)
    
    // Link oficial de Google Calendar Event
    const gCalLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Cita MB Studio: " + nombre)}&dates=${fechaLimpia}T${horaLimpia}00/${fechaLimpia}T${horaFinNum}00&details=${encodeURIComponent("Servicio: " + servicio + ". Tel Cliente: " + telefono)}`;

    // 3. Generar Link de WhatsApp con el mensaje y el link del calendario
    const mensajeWhatsApp = `Hola MB STUDIO, soy *${nombre}*.\nSolicito reserva para:\n📅 *${fecha}*\n⏰ *${hora}*\n✂ *${servicio}*\n\n✅ Ya reservé en la web. Para agendarme en tu Google Calendar haz click aquí:\n${gCalLink}`;

    const urlWhatsApp = `https://wa.me/${TELEFONO_BARBERIA}?text=${encodeURIComponent(mensajeWhatsApp)}`;

    // 4. Redirigir y Feedback
    mensajeEstado.innerText = "✅ ¡Listo! Abriendo WhatsApp...";
    
    setTimeout(() => {
        window.open(urlWhatsApp, '_blank');
        // Opcional: Recargar la página para limpiar
        location.reload();
    }, 1500);
}