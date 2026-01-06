document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DEL CURSOR (NAVAJA) ---
    const razorCursor = document.getElementById('razor-cursor');
    // Actualizamos la lista de interactables constantemente por si se generan botones nuevos
    const getInteractables = () => document.querySelectorAll('.interactable, button, a, select, input');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Movimiento rápido y preciso (duration: 50ms)
        razorCursor.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 50, fill: "forwards" });
    });

    // Función para aplicar efectos hover
    function setupHoverEffects() {
        getInteractables().forEach(el => {
            el.addEventListener('mouseenter', () => {
                razorCursor.classList.add('hovered');
            });
            el.addEventListener('mouseleave', () => {
                razorCursor.classList.remove('hovered');
            });
        });
    }
    
    // Llamamos una vez al inicio
    setupHoverEffects();
    
    // Truco: Como los botones de hora se crean después, re-aplicamos hover listeners cuando se mueve el mouse
    window.addEventListener('mouseover', (e) => {
        if (e.target.matches('.interactable') || e.target.closest('.interactable')) {
             razorCursor.classList.add('hovered');
        } else {
             razorCursor.classList.remove('hovered');
        }
    });


    // --- SCROLL REVEAL (Animaciones al bajar) ---
    window.addEventListener('scroll', reveal);

    function reveal(){
        var reveals = document.querySelectorAll('.reveal');

        for(var i = 0; i < reveals.length; i++){
            var windowHeight = window.innerHeight;
            var revealTop = reveals[i].getBoundingClientRect().top;
            var revealPoint = 100;

            if(revealTop < windowHeight - revealPoint){
                reveals[i].classList.add('active');
            }
        }
    }
    // Ejecutar al inicio
    reveal();
});