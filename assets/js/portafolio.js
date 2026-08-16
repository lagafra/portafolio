/* ============================================================
   Portafolio de prácticas docentes — M07
   JavaScript sin dependencias externas.
   Funciones: barra de progreso, índice activo, menú móvil,
   visor de imágenes.
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    /* --- 1. Barra de progreso de lectura ------------------- */
    var barra = document.querySelector(".progreso__barra");

    function actualizarProgreso() {
      if (!barra) return;
      var alto = document.documentElement.scrollHeight - window.innerHeight;
      var avance = alto > 0 ? (window.scrollY / alto) * 100 : 0;
      barra.style.width = Math.min(100, Math.max(0, avance)) + "%";
    }

    /* --- 2. Sección activa en el índice -------------------- */
    var enlaces = Array.prototype.slice.call(
      document.querySelectorAll(".indice__enlace")
    );
    var secciones = enlaces
      .map(function (enlace) {
        var id = enlace.getAttribute("href");
        return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
      })
      .filter(Boolean);

    function marcarActiva(id) {
      enlaces.forEach(function (enlace) {
        if (enlace.getAttribute("href") === "#" + id) {
          enlace.setAttribute("aria-current", "true");
        } else {
          enlace.removeAttribute("aria-current");
        }
      });
    }

    function actualizarIndice() {
      if (!secciones.length) return;
      var umbral = Math.min(200, window.innerHeight * 0.3);
      var activa = secciones[0];

      secciones.forEach(function (seccion) {
        if (seccion.getBoundingClientRect().top <= umbral) activa = seccion;
      });

      // Al llegar al final del documento, la última sección manda.
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      ) {
        activa = secciones[secciones.length - 1];
      }
      marcarActiva(activa.id);
    }

    var esperando = false;
    function alDesplazarse() {
      if (esperando) return;
      esperando = true;
      window.requestAnimationFrame(function () {
        actualizarProgreso();
        actualizarIndice();
        esperando = false;
      });
    }
    window.addEventListener("scroll", alDesplazarse, { passive: true });
    window.addEventListener("resize", alDesplazarse, { passive: true });
    actualizarProgreso();
    actualizarIndice();

    /* --- 3. Menú del índice en pantallas pequeñas ---------- */
    var boton = document.querySelector(".indice__boton");
    var lista = document.querySelector(".indice__lista");

    if (boton && lista) {
      boton.addEventListener("click", function () {
        var abierto = boton.getAttribute("aria-expanded") === "true";
        boton.setAttribute("aria-expanded", String(!abierto));
        lista.classList.toggle("desplegada", !abierto);
      });

      lista.addEventListener("click", function (evento) {
        if (
          evento.target.closest(".indice__enlace") &&
          window.matchMedia("(max-width: 62rem)").matches
        ) {
          boton.setAttribute("aria-expanded", "false");
          lista.classList.remove("desplegada");
        }
      });
    }

    /* --- 4. Visor de imágenes ------------------------------ */
    var visor = document.querySelector(".visor");
    var visorImagen = visor ? visor.querySelector("img") : null;
    var visorCerrar = visor ? visor.querySelector(".visor__cerrar") : null;
    var ultimoFoco = null;

    function abrirVisor(imagen) {
      if (!visor || !visorImagen) return;
      ultimoFoco = document.activeElement;
      visorImagen.src = imagen.currentSrc || imagen.src;
      visorImagen.alt = imagen.alt || "";
      visor.classList.add("abierto");
      visor.setAttribute("aria-hidden", "false");
      if (visorCerrar) visorCerrar.focus();
    }

    function cerrarVisor() {
      if (!visor) return;
      visor.classList.remove("abierto");
      visor.setAttribute("aria-hidden", "true");
      if (ultimoFoco && typeof ultimoFoco.focus === "function") {
        ultimoFoco.focus();
      }
    }

    document.querySelectorAll(".figura__marco img").forEach(function (imagen) {
      imagen.setAttribute("tabindex", "0");
      imagen.setAttribute("role", "button");
      imagen.addEventListener("click", function () {
        abrirVisor(imagen);
      });
      imagen.addEventListener("keydown", function (evento) {
        if (evento.key === "Enter" || evento.key === " ") {
          evento.preventDefault();
          abrirVisor(imagen);
        }
      });
    });

    if (visor) {
      visor.addEventListener("click", function (evento) {
        if (evento.target === visor || evento.target === visorCerrar) {
          cerrarVisor();
        }
      });
      document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape") cerrarVisor();
      });
    }
  });
})();
