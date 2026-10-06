# MERAD — Web con área administrativa

## Estructura
- `index.html`: web pública para solicitar citas.
- `admin.html`: login + panel privado.
- `styles.css`: estilos.
- `public.js`: formulario público.
- `admin.js`: login, búsqueda, filtros y panel.
- `seed-data.js`: 50 registros 

## Credenciales del prototipo
- Usuario: `admin`
- Contraseña: `12345678!`

## Sobre los teléfonos
Se usan números únicos con formato dominicano (809/829/849) y bloque `555-01xx` para que parezcan reales sin pretender corresponder a clientes reales.

## Importante sobre privacidad y GitHub Pages
GitHub Pages sirve archivos estáticos. El login de este proyecto **oculta los datos en la interfaz**, pero no es seguridad real de servidor.
Alguien con conocimientos técnicos podría inspeccionar los archivos publicados.

Para datos reales se necesitaría un backend con autenticación y base de datos, por ejemplo Supabase/Firebase/PostgreSQL.

## Publicar
Sube todos los archivos a la raíz de un repositorio y activa:
`Settings > Pages > Deploy from a branch > main > /(root)`
