# Gestionando el proceso de tu bot con PM2

PM2 es un administrador de procesos. Administra los estados de sus aplicaciones, para que pueda iniciar, detener, reiniciar y eliminar procesos. Ofrece características tales como monitorear los procesos en ejecución y configurar un "inicio con el sistema operativo" (ya sea Windows, Linux o Mac) para que sus procesos comiencen cuando inicie su sistema.

## Instalación

Puedes instalar pm2 mediante npm:

```bash
npm install --global pm2
```

O, también puedes utilizar Yarn:

```bash
yarn global add pm2
```

## Iniciando tu aplicación

Después de instalar pm2, la manera más sencilla para iniciar tu aplicación es yendo al directorio donde se encuentra tu bot y ejecutar lo siguiente:

```bash
pm2 start your-app-name.js
```

### Notas adicionales

El script `pm2 start` permite el uso de argumentos en línea.

- `--name`: Esto le permite establecer el nombre de su proceso al incluirlo en `pm2 list` o `pm2 monit`:

```bash
pm2 start your-app-name.js --name "Algún nombre cool"
```

- `--watch`: Esta opción reiniciará automáticamente su proceso tan pronto como se detecte un cambio de archivo, lo que puede ser útil para entornos de desarrollo:

```bash
pm2 start your-app-name.js --watch
```

::: tip
El comando `pm2 start` puede tener más parámetros opcionales, pero solo estos dos son relevantes. Si quieres revisar el resto de los parámetros, puedes revisar la documentación de pm2 [here](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/).
:::

Cuando el proceso se inicie con pm2, puedes ejecutar `pm2 monit` para monitorear todas las salidas de la consola de los procesos iniciados por pm2. Esto incluye cualquier `console.log()` en tu código o errores de código.

## Configuración del arranque junto al sistema
Quizás una de las características más útiles de PM2 es poder iniciarse con su sistema operativo. Esta función garantizará que los procesos de su bot siempre se inicien después de un (inesperado) reinicio (por ejemplo, después de un corte de energía).

Los pasos iniciales difieren según el sistema operativo. En esta guía, cubriremos los de Windows y Linux / MacOS.

### Pasos iniciales para Windows

::: tip
Ejecute esto desde el símbolo del sistema con permisos de administrador para evitar ser "golpeado" por múltiples cuadros de dialogo UAC.
:::

**Instalar el paquete de [pm2-windows-service](https://www.npmjs.com/package/pm2-windows-service) a partir de npm:**

```bash
npm install --global pm2-windows-service
```

**Cuando la instalación finalice, instala el servicio ejecutando el siguiente comando:**

```bash
pm2-service-install
```
::: tip
Puedes usar el parámetro `-n` para establecer el nombre del servicio: `pm2-service-install -n "the-service-name"`
:::

### Pasos iniciales para Linux/MacOS

Necesitas un script de arranque, el cual puedes obtener ejecutando los siguientes comandos:

```bash
# Detecta el sistema de inicio disponible, genera la configuración, y habilita el sistema de inicio
pm2 startup
```

O, si quieres especificar su sistema manualmente, selecciona una de las opciones con el comando:

```bash
pm2 startup [ubuntu | ubuntu14 | ubuntu12 | centos | centos6 | arch | oracle | amazon | macos | darwin | freesd | systemd | systemv | upstart | launchd | rcd | openrc]
```

El resultado de ejecutar uno de los comandos enumerados anteriormente generará un comando para que lo ejecute con todas las variables y opciones de entorno configuradas.

**Ejemplo de la "salida" para usuarios de Ubuntu:**

```bash
[PM2] You have to run this command as root. Execute the following command:
      sudo su -c "env PATH=$PATH:/home/user/.nvm/versions/node/v8.9/bin pm2 startup ubuntu -u user --hp /home/user
```

Después de ejecutar el comando, puedes continuar con el siguiente comando.

### Guardar la lista de procesos actual

Para guardar la lista de procesos actual para que se inicie automáticamente después de un reinicio, ejecute el siguiente comando:

```bash
pm2 save
```

Para deshabilitar esto, ejecute el siguiente comando:

```bash
pm2 unstartup
```
