const fechaLarga = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "long",
  timeStyle: "short",
});

const fechaCorta = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" });

export function formatearFechaLarga(iso: string): string {
  return fechaLarga.format(new Date(iso));
}

export function formatearFechaCorta(iso: string): string {
  return fechaCorta.format(new Date(iso));
}

export function calcularEdad(fechaNacimiento: string): number {
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad -= 1;
  return edad;
}

export function iniciales(nombre: string): string {
  return nombre
    .split(" ")
    .filter((parte) => parte.length > 1)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");
}

export function haceDias(dias: number): string {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - dias);
  fecha.setHours(9, 30, 0, 0);
  return fecha.toISOString();
}
