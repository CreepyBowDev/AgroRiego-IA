#  AgroRiego IA

##  Descripción general

**AgroRiego IA** es un MVP funcional que utiliza inteligencia artificial para recomendar decisiones de riego y estimar el consumo energético de bombas agrícolas.

El sistema está orientado a productores agrícolas de Santa Cruz que necesitan decidir si conviene regar, cuánto tiempo hacerlo, en qué horario y cuánto podría costar aproximadamente el consumo de energía.

La plataforma permite registrar una parcela, ingresar datos del cultivo, bomba, clima y humedad estimada del suelo. Luego, el sistema genera una recomendación inteligente y explicable.



##  Problema identificado

Muchos productores agrícolas toman decisiones de riego con poca información técnica. Esto puede generar:

- Desperdicio de agua.
- Gasto energético innecesario.
- Riego en horarios poco eficientes.
- Menor eficiencia en el manejo del cultivo.



##  Solución propuesta

**AgroRiego IA** permite registrar datos básicos de una parcela agrícola y generar una recomendación de riego mediante un motor de inteligencia artificial.

El sistema indica:

- Si conviene regar o esperar.
- Prioridad del riego.
- Tiempo recomendado.
- Horario sugerido.
- Consumo energético estimado.
- Costo aproximado en bolivianos.
- Razones de la recomendación.



##  Aplicación de inteligencia artificial

La IA del MVP funciona como un motor de recomendación basado en reglas agronómicas y energéticas.

Evalúa variables como:

- Temperatura.
- Humedad ambiental.
- Probabilidad de lluvia.
- Humedad estimada del suelo.
- Sensibilidad del cultivo a sequía.
- Potencia de la bomba.
- Costo por kWh.

Con estos datos, calcula un nivel de riesgo hídrico y genera una recomendación explicable para el productor.



---

## Arquitectura del sistema

```text
Usuario / Productor
        ↓
Frontend HTML, CSS y JavaScript
        ↓
Backend Node.js + Express
        ↓
Motor IA de recomendación
        ↓
Persistencia local
```

---

##  Flujo de la demo

```text
Registro de parcela
        ↓
Datos del cultivo
        ↓
Datos de la bomba
        ↓
Datos del clima
        ↓
Recomendación IA
        ↓
Resultado e historial
```



##  Tecnologías utilizadas

### Frontend

* HTML5
* CSS3
* JavaScript
* Live Server

### Backend

* Node.js
* Express.js
* dotenv
* CORS

### Inteligencia artificial

* Motor de recomendación basado en reglas.
* Cálculo de riesgo hídrico.
* Estimación de consumo energético.
* Recomendación explicable.



## Estructura del proyecto

```text
AgroRiego-IA/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   └── server.js
│
├── fronted/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── api.js
│   │   ├── main.js
│   │   ├── plots.js
│   │   └── recommendation.js
│   ├── index.html
│   ├── dashboard.html
│   ├── plots.html
│   └── recommendation.html
│
├── database/
├── package.json
└── README.md
```

---


=======
##  Imágenes referenciales  



```md
A continuación se muestran capturas de las principales pantallas del MVP.

### Pantalla de inicio

![Pantalla de inicio](docs/img/inicio.png)

### Dashboard

![Dashboard](docs/img/dashboard.png)

### Registro de parcela

![Registro de parcela](docs/img/registro-parcela.png)

### Generación de recomendación IA

![Recomendación IA](docs/img/recomendacion-ia.png)

### Resultado generado por la IA.

![Resultado IA](docs/img/resultado-ia.png)
>>>>>>> 012f0dc (readme.terminado)
```

---

##  Instalación

Clonar el repositorio:

```bash
git clone https://github.com/CreepyBowDev/AgroRiego-IA.git
```

Entrar a la carpeta del proyecto:

```bash
cd AgroRiego-IA
```

Instalar dependencias:

```bash
npm install
```

En PowerShell, si aparece error con `npm`, usar:

```bash
npm.cmd install
```

---

## Instrucciones de ejecución

Ejecutar el backend desde la carpeta principal:

```bash
node backend/server.js
```

El servidor debería mostrar:

```text
Servidor AgroRiego IA corriendo en http://localhost:3000
```

Verificar el backend en el navegador:

```text
http://localhost:3000/api/plots
```

Para ejecutar el frontend, abrir con Live Server:

```text
fronted/index.html
```

La URL debería verse parecida a:

```text
http://127.0.0.1:5500/fronted/index.html
```

---

##  Datos de prueba

### Parcela

```text
Nombre: Parcela Norte
Municipio: Montero
Comunidad: Comunidad Demo
Superficie: 3 hectáreas
Tipo de suelo: Franco arenoso
Fuente de agua: Pozo
```

### Cultivo

```text
Cultivo: Maíz
Etapa: Crecimiento vegetativo
Sensibilidad a sequía: Alta
```

### Bomba

```text
Tipo: Eléctrica
Potencia: 2.5 kW
Caudal: 120 litros/minuto
Costo kWh: 1.2 Bs
Fuente de energía: Energía eléctrica
```

### Clima

```text
Temperatura: 34 °C
Humedad: 35 %
Probabilidad de lluvia: 15 %
Viento: 12 km/h
Humedad estimada del suelo: 25 %
```

---

## Resultado esperado

```text
Se recomienda regar.
Prioridad: alta.
Tiempo recomendado: 120 minutos.
Horario sugerido: 05:00 - 07:00.
Consumo estimado: 5 kWh.
Costo aproximado: Bs 6.
```

---

##  Impacto esperado

AgroRiego IA busca mejorar la toma de decisiones agrícolas, reducir el desperdicio de agua y optimizar el consumo energético en sistemas de riego con bombas.

---

##  Próximos pasos

* Integrar una API climática real.
* Conectar sensores de humedad del suelo.
* Agregar alertas por WhatsApp.
* Implementar login para productores.
* Mejorar el historial de recomendaciones.
* Crear una versión móvil.

---

##  Equipo
---
* Wilber Jesus Auza Caceres
* Ciro Andres Lino Toledo
* Maryory Montenegro Aramayo
* Franco David Zurita Figueroa


---

##  Repositorio

```text
https://github.com/CreepyBowDev/AgroRiego-IA
```

