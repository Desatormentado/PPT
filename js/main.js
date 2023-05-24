const boton = document.getElementById("boton");
const piedra = document.getElementById("piedra");
const papel = document.getElementById("papel");
const tijeras = document.getElementById("tijeras");
const victorias = document.getElementById("victorias");
const derrotas = document.getElementById("derrotas");
const empates = document.getElementById("empates");
const resultado = document.getElementById("resultado");
const tabla = document.getElementById("tabla");
const borrar = document.getElementById("borrarJugadores")

boton.addEventListener("click", function (event) {
  event.preventDefault();
  guardarDatos();
});

function guardarDatos() {
  const nombrePlayer = document.getElementById("nombre").value;
  const edadPlayer = document.getElementById("edad").value;

  if (nombrePlayer === "" || edadPlayer === "") {
    Toastify({
      text: "Elija un nombre o edad correcta!",
      duration: 1000,
      newWindow: true,
      gravity: "top",
      position: "center",
      stopOnFocus: true, 
      style: {
        background: "linear-gradient(90deg, rgba(255,0,0,1) 74%, rgba(255,176,0,1) 100%)",
      },
      onClick: function(){} 
    }).showToast();
    return;
  }

  let jugador = JSON.parse(localStorage.getItem(nombrePlayer));

  if (!jugador) {
    jugador = {
      nombre: nombrePlayer,
      edad: edadPlayer,
      victorias: 0,
      derrotas: 0,
      empates: 0,
    };
  } else {
    // Si el jugador ya existe, se actualiza la edad con la nueva entrada
    jugador.edad = edadPlayer;
  }

  localStorage.setItem(nombrePlayer, JSON.stringify(jugador));
  reiniciarContadores();
  actualizarTablaPosiciones();
}

function reiniciarContadores() {
  victorias.textContent = "0";
  derrotas.textContent = "0";
  empates.textContent = "0";
  resultado.textContent = "";
}

function jugar(opcionJugador) {
  const opciones = ["piedra", "papel", "tijeras"];
  const opcionComputadora = opciones[Math.floor(Math.random() * opciones.length)];

  const nombrePlayer = document.getElementById("nombre").value;
  let jugador = JSON.parse(localStorage.getItem(nombrePlayer));

  if (!jugador) {
    Toastify({
      text: "Se debe crear un usuario antes de comenzar a jugar",
      duration: 2000,
      newWindow: true,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(90deg, rgba(255,0,0,1) 74%, rgba(255,176,0,1) 100%)",
      },
      onClick: function(){}
    }).showToast();
    return;
  }

  if (opcionJugador === opcionComputadora) {
    Toastify({
      text: "Empate!",
      duration: 1000,
      newWindow: true,
      gravity: "bottom",
      position: "center", 
      stopOnFocus: true,
      style: {
        background: "linear-gradient(90deg, rgba(0,0,167,1) 8%, rgba(0,212,255,1) 100%)",
      },
      onClick: function(){}
    }).showToast();
    jugador.empates++;
    empates.textContent = jugador.empates;
  } else if (
    (opcionJugador === "piedra" && opcionComputadora === "tijeras") ||
    (opcionJugador === "papel" && opcionComputadora === "piedra") ||
    (opcionJugador === "tijeras" && opcionComputadora === "papel")
  ) {
    Toastify({
      text: "Ganaste!",
      duration: 1000,
      newWindow: true,
      gravity: "bottom", 
      position: "center",
      stopOnFocus: true, 
      style: {
        background: "linear-gradient(90deg, rgba(149,226,155,1) 0%, rgba(0,153,23,1) 100%)",
      },
      onClick: function(){} 
    }).showToast();
    jugador.victorias++;
    victorias.textContent = jugador.victorias;
  } else {
    Toastify({
      text: "Perdiste!",
      duration: 1000,
      newWindow: true,
      gravity: "bottom", 
      position: "center", 
      stopOnFocus: true, 
      style: {
        background: "linear-gradient(90deg, rgba(223,19,0,1) 0%, rgba(255,253,42,1) 100%)",
      },
      onClick: function(){} 
    }).showToast();
    jugador.derrotas++;
    derrotas.textContent = jugador.derrotas;
  }

  localStorage.setItem(nombrePlayer, JSON.stringify(jugador));
  actualizarTablaPosiciones();
}

piedra.addEventListener("click", () => jugar("piedra"));
papel.addEventListener("click", () => jugar("papel"));
tijeras.addEventListener("click", () => jugar("tijeras"));

function cargarJugadores() {
  fetch('js/players.json')
    .then(response => response.json())
    .then(data => {
      const jugadores = data;

      jugadores.forEach(jugador => {
        const jugadorExistente = JSON.parse(localStorage.getItem(jugador.nombre));

        if (!jugadorExistente) {
          localStorage.setItem(jugador.nombre, JSON.stringify(jugador));
        }
      });

      actualizarTablaPosiciones();
    })
}

function actualizarTablaPosiciones() {
  const jugadores = [];

  for (let i = 0; i < localStorage.length; i++) {
    const clave = localStorage.key(i);

    if (clave !== "jugador") {
      const jugador = JSON.parse(localStorage.getItem(clave));

      jugadores.push(jugador);
    }
  }

  jugadores.sort((a, b) => b.victorias - a.victorias);

  tabla.innerHTML = "";

  jugadores.forEach(jugador => {
    const fila = document.createElement("tr");
    const celdaNombre = document.createElement("td");
    const celdaEdad = document.createElement("td");
    const celdaVictorias = document.createElement("td");
    const celdaDerrotas = document.createElement("td");
    const celdaEmpates = document.createElement("td");

    celdaNombre.textContent = jugador.nombre;
    celdaEdad.textContent = jugador.edad;
    celdaVictorias.textContent = jugador.victorias ?? 0;
    celdaDerrotas.textContent = jugador.derrotas ?? 0;
    celdaEmpates.textContent = jugador.empates ?? 0;

    fila.appendChild(celdaNombre);
    fila.appendChild(celdaEdad);
    fila.appendChild(celdaVictorias);
    fila.appendChild(celdaDerrotas);
    fila.appendChild(celdaEmpates);

    tabla.appendChild(fila);
  });
}

cargarJugadores();

borrar.addEventListener("click", () => {
  localStorage.clear();
  actualizarTablaPosiciones();
});