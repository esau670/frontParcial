const API_URL = "https://practica2-mewx.onrender.com"; // tu backend en Render
let clienteId = null;

// Registrar cliente
async function registrarCliente() {
  const nombre = document.getElementById("reg_nombre").value;
  const email = document.getElementById("reg_email").value;
  const telefono = document.getElementById("reg_telefono").value;

  const res = await fetch(`${API_URL}/clientes/registrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, email, telefono })
  });

  const data = await res.json();
  document.getElementById("reg_msg").innerText = data.msg || "Cliente registrado";
}

// Login cliente
async function loginCliente() {
  const email = document.getElementById("login_email").value;
  const telefono = document.getElementById("login_telefono").value;

  const res = await fetch(`${API_URL}/clientes/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, telefono })
  });

  const data = await res.json();

  if (res.ok) {
    document.getElementById("login_msg").innerText = data.msg;
    clienteId = data.cliente?.id || null;
    listarOrdenes();
  } else {
    document.getElementById("login_msg").innerText = data.msg;
  }
}

// Crear orden
async function crearOrden() {
  if (!clienteId) return alert("Debes iniciar sesión primero");

  const platillo_nombre = document.getElementById("platillo_nombre").value;
  const notes = document.getElementById("notes").value;

  const res = await fetch(`${API_URL}/ordenes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cliente_id: clienteId, platillo_nombre, notes })
  });

  await res.json();
  listarOrdenes();
}

// Listar órdenes
async function listarOrdenes() {
  if (!clienteId) return;

  const res = await fetch(`${API_URL}/ordenes/${clienteId}`);
  const ordenes = await res.json();

  const container = document.getElementById("ordenes");
  container.innerHTML = "";
  ordenes.forEach(o => {
    const div = document.createElement("div");
    div.className = "orden";
    div.innerHTML = `
      <strong>${o.platillo_nombre}</strong> - ${o.notes}<br>
      Estado: ${o.estado}
      <button onclick="cambiarEstado(${o.id}, '${o.estado}')">Avanzar estado</button>
    `;
    container.appendChild(div);
  });
}

// Cambiar estado
async function cambiarEstado(id, estadoActual) {
  let nuevoEstado = estadoActual === "pending" ? "preparing" :
                    estadoActual === "preparing" ? "delivered" : null;
  if (!nuevoEstado) return;

  await fetch(`${API_URL}/ordenes/${id}/estado`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado: nuevoEstado })
  });

  listarOrdenes();
}
