/* ============================================================
   Modo edición del portafolio
   ------------------------------------------------------------
   Se activa abriendo la página con  #editar  al final de la
   dirección. Sin eso, este archivo no hace absolutamente nada.

   Permite editar los textos sobre la página ya maquetada,
   sustituir imágenes, cambiar la fuente del audio y del vídeo,
   duplicar o borrar filas, elementos de lista y muestras, y
   descargar el resultado como un index.html limpio.
   ============================================================ */
(function () {
  "use strict";

  var CLAVE = "portafolio-m07-borrador";
  var ANCHO_MAXIMO = 1600; // px a los que se reducen las fotos
  var CALIDAD = 0.82;

  var EDITABLES = [
    ".portada__titulo", ".portada__entrada", ".portada__cintillo",
    ".pregunta-guia", ".portada__video p",
    ".identificacion dt", ".identificacion dd",
    ".indice__pie",
    ".contenido p", ".contenido li", ".contenido h2", ".contenido h3",
    ".contenido h4", ".contenido td", ".contenido th", ".contenido caption",
    ".contenido dt", ".contenido dd", ".contenido summary",
    ".contenido figcaption", ".contenido .ficha__titulo",
    ".contexto__oferta p",
    ".pie__interior p"
  ].join(", ");

  var sucio = false;
  var barra, bloque, estado;

  /* ---------------------------------------------------------- */
  function activo() {
    return (
      window.location.hash === "#editar" ||
      window.location.search.indexOf("editar") !== -1
    );
  }

  function marcarSucio() {
    sucio = true;
    refrescarEstado();
    guardarBorrador();
  }

  /* --- Preparar las zonas editables -------------------------- */
  function prepararEditables(raiz) {
    raiz.querySelectorAll(EDITABLES).forEach(function (el) {
      if (el.isContentEditable || el.closest(".editor-ui")) return;
      el.setAttribute("contenteditable", "true");
      el.setAttribute("spellcheck", "true");
      el.classList.add("editable");
    });
  }

  /* Enter inserta un salto de línea en lugar de romper la
     estructura del documento con etiquetas nuevas. */
  function alPulsarTecla(e) {
    var el = e.target;
    if (!el.isContentEditable) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      document.execCommand("insertLineBreak");
    }
  }

  /* Pegar siempre como texto plano: evita arrastrar estilos
     ajenos desde Word o desde otra página. */
  function alPegar(e) {
    if (!e.target.isContentEditable) return;
    e.preventDefault();
    var texto = (e.clipboardData || window.clipboardData).getData("text/plain");
    document.execCommand("insertText", false, texto);
  }

  /* Al terminar de editar, los marcadores ya sustituidos dejan
     de estar resaltados. */
  function limpiarMarcadores(el) {
    el.querySelectorAll(".marcador").forEach(function (m) {
      var t = m.textContent.trim();
      if (!(t.charAt(0) === "[" && t.charAt(t.length - 1) === "]")) {
        var padre = m.parentNode;
        while (m.firstChild) padre.insertBefore(m.firstChild, m);
        padre.removeChild(m);
        padre.normalize();
      }
    });
    if (el.classList.contains("marcador")) {
      var t2 = el.textContent.trim();
      if (!(t2.charAt(0) === "[" && t2.charAt(t2.length - 1) === "]")) {
        el.classList.remove("marcador");
      }
    }
  }

  /* Si se reescribe el título de una sección, la entrada
     correspondiente del índice se actualiza sola. */
  function sincronizarIndice(el) {
    if (!el.classList.contains("seccion__titulo")) return;
    var seccion = el.closest(".seccion");
    if (!seccion || !seccion.id) return;
    var enlace = document.querySelector(
      '.indice__enlace[href="#' + seccion.id + '"]'
    );
    if (!enlace) return;
    var numero = enlace.querySelector(".indice__numero");
    enlace.textContent = "";
    if (numero) enlace.appendChild(numero);
    enlace.appendChild(document.createTextNode(el.textContent.trim()));
  }

  function refrescarEstado() {
    if (!estado) return;
    var pendientes = document.querySelectorAll(".marcador").length;
    estado.innerHTML =
      "<b>Modo edición</b> · quedan <b>" + pendientes + "</b> marcadores" +
      (sucio
        ? ' · <span class="editor-guardado">cambios sin descargar</span>'
        : ' · <span class="editor-guardado">sin cambios</span>');
  }

  /* --- Sustituir imágenes ------------------------------------ */
  function prepararImagenes(raiz) {
    raiz.querySelectorAll(".figura__marco img").forEach(function (img) {
      if (img.dataset.editorListo) return;
      img.dataset.editorListo = "1";
      img.addEventListener("click", function (e) {
        e.stopPropagation();
        elegirImagen(img);
      });
    });
  }

  function elegirImagen(img) {
    var entrada = document.createElement("input");
    entrada.type = "file";
    entrada.accept = "image/*";
    entrada.addEventListener("change", function () {
      var archivo = entrada.files && entrada.files[0];
      if (!archivo) return;
      var lector = new FileReader();
      lector.onload = function () {
        reducir(lector.result, function (datos) {
          img.setAttribute("src", datos);
          img.removeAttribute("width");
          img.removeAttribute("height");
          var alt = window.prompt(
            "Descripción de la imagen (texto alternativo):",
            img.getAttribute("alt") || ""
          );
          if (alt !== null) img.setAttribute("alt", alt);
          marcarSucio();
        });
      };
      lector.readAsDataURL(archivo);
    });
    entrada.click();
  }

  /* Reduce la foto antes de incrustarla para que el archivo
     final no se dispare de tamaño. */
  function reducir(datos, cuandoTermine) {
    var imagen = new Image();
    imagen.onload = function () {
      var escala = Math.min(1, ANCHO_MAXIMO / imagen.width);
      if (escala === 1 && datos.length < 400000) return cuandoTermine(datos);
      var lienzo = document.createElement("canvas");
      lienzo.width = Math.round(imagen.width * escala);
      lienzo.height = Math.round(imagen.height * escala);
      var ctx = lienzo.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, lienzo.width, lienzo.height);
      ctx.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
      cuandoTermine(lienzo.toDataURL("image/jpeg", CALIDAD));
    };
    imagen.onerror = function () { cuandoTermine(datos); };
    imagen.src = datos;
  }

  /* --- Audio y vídeo ----------------------------------------- */
  function aEmbebido(url) {
    var m = url.match(/(?:youtu\.be\/|v=|\/embed\/)([\w-]{11})/);
    if (m) return "https://www.youtube.com/embed/" + m[1];
    var d = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
    if (d) return "https://drive.google.com/file/d/" + d[1] + "/preview";
    return url;
  }

  function marcaDeVideo(url, caja) {
    var poster = caja.querySelector("video");
    poster = poster ? poster.getAttribute("poster") : null;
    if (/\.(mp4|webm|ogv|mov)(\?.*)?$/i.test(url)) {
      return '<video controls preload="none" playsinline' +
        (poster ? ' poster="' + poster + '"' : "") +
        ' src="' + url + '">Tu navegador no reproduce vídeo. ' +
        '<a href="' + url + '">Descargar el vídeo</a>.</video>';
    }
    return '<iframe src="' + aEmbebido(url) +
      '" title="Vídeo del portafolio" allowfullscreen loading="lazy"></iframe>';
  }

  function prepararMedios(raiz) {
    raiz.querySelectorAll(".video").forEach(function (caja) {
      if (caja.dataset.editorMedio) return;
      caja.dataset.editorMedio = "1";
      // El botón va fuera del bloque: dentro quedaría tapado por
      // el iframe o por el aviso, que ocupan toda la superficie.
      insertarDespues(caja, crearBoton("Cambiar el vídeo", "editor-medio", function () {
        var actual = caja.querySelector("iframe");
        var url = window.prompt(
          "Dirección del vídeo (YouTube o Google Drive):",
          actual ? actual.getAttribute("src") : ""
        );
        if (!url) return;
        caja.innerHTML = marcaDeVideo(url.trim(), caja);
        marcarSucio();
      }));
    });

    raiz.querySelectorAll(".audio").forEach(function (caja) {
      if (caja.dataset.editorMedio) return;
      caja.dataset.editorMedio = "1";
      insertarDespues(caja, crearBoton("Cambiar el audio", "editor-medio", function () {
        var fuente = caja.querySelector("source") || caja.querySelector("audio");
        var url = window.prompt(
          "Ruta o dirección del archivo de audio\n(por ejemplo: assets/audio/mi-grabacion.mp3):",
          fuente ? fuente.getAttribute("src") : ""
        );
        if (!url) return;
        var audio = caja.querySelector("audio");
        audio.innerHTML =
          '<source src="' + url.trim() + '">Tu navegador no reproduce audio.';
        audio.load();
        marcarSucio();
      }));
    });
  }

  function insertarDespues(nodo, nuevo) {
    nodo.parentNode.insertBefore(nuevo, nodo.nextSibling);
  }

  function crearBoton(texto, clase, alPulsar) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "editor-boton editor-ui " + (clase || "");
    b.textContent = texto;
    b.addEventListener("click", alPulsar);
    return b;
  }

  /* --- Controles de bloque (duplicar / eliminar) ------------- */
  function bloqueDe(el) {
    return el.closest("tbody tr, .contenido li, article.ficha");
  }

  function nombreDe(nodo) {
    if (nodo.matches("tbody tr")) return "esta fila";
    if (nodo.matches("article.ficha")) return "esta muestra completa";
    return "este elemento";
  }

  var nodoActual = null;

  function mostrarControles(nodo) {
    if (!nodo) return ocultarControles();
    nodoActual = nodo;
    bloque.innerHTML = "";
    bloque.appendChild(
      crearBoton("⧉ Duplicar", "", function () {
        var copia = nodo.cloneNode(true);
        nodo.parentNode.insertBefore(copia, nodo.nextSibling);
        preparar(copia);
        marcarSucio();
        mostrarControles(copia);
      })
    );
    bloque.appendChild(
      crearBoton("✕ Eliminar", "editor-boton--peligro", function () {
        if (!window.confirm("¿Eliminar " + nombreDe(nodo) + "?")) return;
        nodo.remove();
        ocultarControles();
        marcarSucio();
      })
    );
    bloque.classList.add("visible");
    colocarControles();
  }

  /* Los controles siguen al bloque al desplazar la página en
     lugar de desaparecer al primer movimiento. */
  function colocarControles() {
    if (!nodoActual || !nodoActual.isConnected) return ocultarControles();
    var r = nodoActual.getBoundingClientRect();
    bloque.style.top = window.scrollY + r.top - 34 + "px";
    bloque.style.left =
      Math.max(8, window.scrollX + r.right - bloque.offsetWidth) + "px";
  }

  function ocultarControles() {
    nodoActual = null;
    bloque.classList.remove("visible");
  }

  /* --- Borrador de emergencia -------------------------------- */
  function guardarBorrador() {
    try {
      window.localStorage.setItem(CLAVE, componerHtml());
    } catch (e) {
      /* Si el navegador no lo permite, la descarga sigue siendo
         la forma de guardar. No es un problema. */
    }
  }

  function hayBorrador() {
    try {
      return !!window.localStorage.getItem(CLAVE);
    } catch (e) {
      return false;
    }
  }

  /* --- Exportar ---------------------------------------------- */
  function componerHtml() {
    var clon = document.documentElement.cloneNode(true);

    clon.querySelectorAll(
      "#editor-barra, #editor-bloque, #editor-ayuda, .editor-ui"
    ).forEach(function (e) { e.remove(); });

    clon.querySelectorAll("[contenteditable]").forEach(function (e) {
      e.removeAttribute("contenteditable");
      e.removeAttribute("spellcheck");
      e.classList.remove("editable");
      if (e.getAttribute("class") === "") e.removeAttribute("class");
    });

    clon.querySelectorAll("[data-editor-listo], [data-editor-medio]").forEach(
      function (e) {
        e.removeAttribute("data-editor-listo");
        e.removeAttribute("data-editor-medio");
      }
    );

    clon.classList.remove("editor-modo");
    if (clon.getAttribute("class") === "") clon.removeAttribute("class");
    var cuerpo = clon.querySelector("body");
    if (cuerpo) {
      cuerpo.classList.remove("editor-modo");
      if (cuerpo.getAttribute("class") === "") cuerpo.removeAttribute("class");
    }

    return "<!DOCTYPE html>\n" + clon.outerHTML + "\n";
  }

  function descargar(html, nombre) {
    var url = URL.createObjectURL(
      new Blob([html], { type: "text/html;charset=utf-8" })
    );
    var enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = nombre;
    enlace.className = "editor-ui";
    document.body.appendChild(enlace);
    enlace.click();
    // Revocar de inmediato puede cancelar la descarga antes de que
    // el navegador la haya iniciado: se espera un momento.
    window.setTimeout(function () {
      if (enlace.parentNode) enlace.parentNode.removeChild(enlace);
      URL.revokeObjectURL(url);
    }, 4000);
  }

  function exportar() {
    descargar(componerHtml(), "index.html");
    sucio = false;
    refrescarEstado();
  }

  /* --- Interfaz ---------------------------------------------- */
  function construirBarra() {
    barra = document.createElement("div");
    barra.id = "editor-barra";
    barra.className = "editor-ui";

    estado = document.createElement("p");
    estado.className = "editor-estado";
    barra.appendChild(estado);

    barra.appendChild(crearBoton("Cómo funciona", "", function () {
      document.getElementById("editor-ayuda").classList.add("visible");
    }));
    barra.appendChild(crearBoton("Salir", "", function () {
      if (sucio && !window.confirm(
        "Hay cambios que todavía no has descargado. ¿Salir igualmente?"
      )) return;
      window.location.href = window.location.pathname;
    }));
    barra.appendChild(
      crearBoton("Descargar index.html", "editor-boton--lleno", exportar)
    );

    document.body.appendChild(barra);

    bloque = document.createElement("div");
    bloque.id = "editor-bloque";
    bloque.className = "editor-ui";
    document.body.appendChild(bloque);

    var ayuda = document.createElement("div");
    ayuda.id = "editor-ayuda";
    ayuda.className = "editor-ui";
    ayuda.innerHTML =
      '<div class="editor-ayuda__caja">' +
      "<h2>Editar el portafolio</h2><ol>" +
      "<li>Haz clic sobre cualquier texto y escribe. Enter crea un salto de línea; el diseño no se rompe.</li>" +
      "<li>Los recuadros rosas son marcadores pendientes. Al sustituir el texto, el resaltado desaparece solo.</li>" +
      "<li>Haz clic en una imagen para cambiarla por una tuya. Se reduce automáticamente antes de incrustarla.</li>" +
      "<li>En el vídeo y en el audio hay un botón para cambiar la dirección del archivo.</li>" +
      "<li>Al situarte en una fila, un elemento de lista o una muestra, aparecen arriba a la derecha los botones <b>Duplicar</b> y <b>Eliminar</b>.</li>" +
      "<li>Cuando termines, pulsa <b>Descargar index.html</b> y sustituye con ese archivo el que está publicado.</li>" +
      "</ol><p>No olvides actualizar la fecha de última edición en la barra lateral y en el pie de página.</p>" +
      '<button type="button" class="editor-boton editor-boton--lleno" data-cerrar>Entendido</button></div>';
    ayuda.addEventListener("click", function (e) {
      if (e.target === ayuda || e.target.hasAttribute("data-cerrar")) {
        ayuda.classList.remove("visible");
      }
    });
    document.body.appendChild(ayuda);
  }

  function preparar(raiz) {
    prepararEditables(raiz);
    prepararImagenes(raiz);
    prepararMedios(raiz);
  }

  /* --- Arranque ---------------------------------------------- */
  function iniciar() {
    document.documentElement.classList.add("editor-modo");
    document.body.classList.add("editor-modo");

    construirBarra();
    preparar(document);
    refrescarEstado();

    document.addEventListener("keydown", alPulsarTecla, true);
    document.addEventListener("paste", alPegar, true);

    document.addEventListener("input", function (e) {
      if (!e.target.isContentEditable) return;
      sincronizarIndice(e.target);
      marcarSucio();
    });

    document.addEventListener("blur", function (e) {
      if (e.target.isContentEditable) {
        limpiarMarcadores(e.target);
        refrescarEstado();
      }
    }, true);

    document.addEventListener("focusin", function (e) {
      if (e.target.closest(".editor-ui")) return;
      mostrarControles(bloqueDe(e.target));
    });

    document.addEventListener("click", function (e) {
      // Los enlaces no navegan mientras se edita.
      var a = e.target.closest("a");
      if (a && !a.closest(".editor-ui")) e.preventDefault();
      if (!e.target.closest(".editor-ui") && !bloqueDe(e.target)) {
        ocultarControles();
      }
    });

    window.addEventListener("scroll", colocarControles, { passive: true });
    window.addEventListener("resize", colocarControles, { passive: true });

    window.addEventListener("beforeunload", function (e) {
      if (!sucio) return;
      e.preventDefault();
      e.returnValue = "";
    });

    if (hayBorrador() && window.confirm(
      "Este navegador guardó una copia de seguridad de una sesión anterior.\n\n" +
      "Aceptar la descarga como index-borrador.html: ábrelo y sigue " +
      "trabajando desde ahí.\nCancelar sigue con la versión publicada."
    )) {
      try {
        descargar(window.localStorage.getItem(CLAVE), "index-borrador.html");
      } catch (err) {
        /* Si falla, se sigue con la versión publicada. */
      }
    }

    document.getElementById("editor-ayuda").classList.add("visible");
  }

  var iniciado = false;

  function arrancar() {
    if (iniciado || !activo()) return;
    iniciado = true;
    iniciar();
  }

  /* Añadir #editar en la barra de direcciones no recarga la
     página, así que también se escucha el cambio de hash. */
  window.addEventListener("hashchange", arrancar);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", arrancar);
  } else {
    arrancar();
  }
})();
