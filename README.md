# Aplicación Web De Inventario Sirio Dinar

Este proyecto front-end esta actuamente utiliza Angular 12 con angular universal (SSR). Link online: <https://inventario.siriodinar.com/> (Para algunas las funciones de inventario se requiere una cuenta de administrador).

## Tecnologias Usadas

* Angular 12
* Angular Universal
* Heroku

## Proyectos Relacionados

* [Back End (nodejs)](https://github.com/TacEtarip/sirioinventarioserver "Back End Para Inventario")

## Funciones

* Sistema De Iventario
* Sistema De Ventas
* Reportar preformance de gastos e ingresos.
* Presentación De Empresa
* Usuarios

## Sistema De Inventario

El sistema cumple tanto la funcion de registrar la entrada y salida de productos como la de *presentarle los productos a los potenciales clientes.*. ***Muchas de las funciones presentadas solo estaran disponible si se ingresa con una cuenta de administrador.***

### Agregar Tipo y Sub-Tipo de producto

**El usuario podra crear una tipo o sub-tipo de producto solo ingresando el nombre.**

![picture alt](https://siriotest.s3.us-east-1.amazonaws.com/agregartipo.jpg?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGYaCXVzLWVhc3QtMSJHMEUCIFOvO19Iwd6Xvix9IyeBKAs17lEVKY1xM6PaSmmkR8NHAiEA4FgDWb0AWEzd2FwwXtCTq3JKPdASnjgFPlssaI17T28q%2FwIIrv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARABGgw1ODQ2OTM3NjI5MjIiDDKNkI0FRA7oppCn2yrTAoJTfwOf%2FqL3PM6ookuJvuoLojKH%2Bo7wtovaZkt1LQ3mgxmEocd2C5oMm5LVbOL0Nlr8Di%2BMNLF%2FuZGDE8tWV8F1e%2F%2F61fPy%2BXRMNHWe2D3VmAVfShW1LTw6SpU%2Bc5tiY4Q5CgfpAtNXdXtwR7LP5CM5JLQXO7U65c%2BQN7XMuqBxWs9RUFBXuNKMJj0DwffKISujFi%2Fcb39RtRM%2BbGrTAwqff6xbXo9JngIKJfk64y9G4d%2BPZqcWhip%2FXyrqy0I3bfTcSfpDesc1b4f4Xw%2B6mLrLk9wbgFVK9pGLQL85TbRBz%2F%2Bky2v7BKZNQ4AnMYtIUIqxJMa2wGrBJPMZpTZv1AY%2F%2Fsma6FgLcufH4OwIwk3cLIFRipchHy%2FcVTLU%2FW8o63kpGKNXZvZ7vr%2FRI%2FxM%2FzRRMrWgy4WNuhgv364w5m0uUHzUKJ6d8yzEFyYX76luvpsayTDJ0eSJBjqzAuFt8V3UTg7ACjPi5ZEs4782D1nG8wdxgUoLsNd3%2Bf2C4kZGYH0QCwUZxeuQTPSEtVrIPnyUXeZLVFEft35MOJ%2FsrGVd9VK0DI%2FlS56zBRah%2BGUGXjUgo6GDyIPGvFTts3TLQ0DhZaixIYUJ3xiNFkgwkbyCNkuvUVz%2FaYbmn3ZZGFoLaDNdnYYhE0jjkWM4oZGmj0gwqxs3i4Js2WSeeoUg36Ik9gm2oKjK1RuLm1KFMz3pws9%2FtTwJodWyQ8XzefDKVSQ6kX8lFOcIlfhH8TTd3l01SPWa8QG5%2BfzUSP8Y3XjqukhY765qyqS7oaVdQLOVkqT8xX6mfMcSkxGwI8UHttVEKKb50cc6gUzofR0zVe5A9XWoMkaijMsBMfJQQOovYnAyF1FN5lKMGAntDA%2BUiOM%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210908T212035Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAYQITWZNVLVUNF3UZ%2F20210908%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=9192f362b5114493788e264fcdea67b373ed41d76c4c29d73884982e6ec38291)

### Presentación del tipo o sub-tipo

**Se presentara en forma de *CARD* con 2 posibilidades distintas, una para el usuario comun la cual solo presentara el link al respectivo producto y otra para un usuario administrador el cual podra editar o eliminar el producto.**

![picture alt](https://siriotest.s3.us-east-1.amazonaws.com/imagenagregar.jpg?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGYaCXVzLWVhc3QtMSJHMEUCIFOvO19Iwd6Xvix9IyeBKAs17lEVKY1xM6PaSmmkR8NHAiEA4FgDWb0AWEzd2FwwXtCTq3JKPdASnjgFPlssaI17T28q%2FwIIrv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARABGgw1ODQ2OTM3NjI5MjIiDDKNkI0FRA7oppCn2yrTAoJTfwOf%2FqL3PM6ookuJvuoLojKH%2Bo7wtovaZkt1LQ3mgxmEocd2C5oMm5LVbOL0Nlr8Di%2BMNLF%2FuZGDE8tWV8F1e%2F%2F61fPy%2BXRMNHWe2D3VmAVfShW1LTw6SpU%2Bc5tiY4Q5CgfpAtNXdXtwR7LP5CM5JLQXO7U65c%2BQN7XMuqBxWs9RUFBXuNKMJj0DwffKISujFi%2Fcb39RtRM%2BbGrTAwqff6xbXo9JngIKJfk64y9G4d%2BPZqcWhip%2FXyrqy0I3bfTcSfpDesc1b4f4Xw%2B6mLrLk9wbgFVK9pGLQL85TbRBz%2F%2Bky2v7BKZNQ4AnMYtIUIqxJMa2wGrBJPMZpTZv1AY%2F%2Fsma6FgLcufH4OwIwk3cLIFRipchHy%2FcVTLU%2FW8o63kpGKNXZvZ7vr%2FRI%2FxM%2FzRRMrWgy4WNuhgv364w5m0uUHzUKJ6d8yzEFyYX76luvpsayTDJ0eSJBjqzAuFt8V3UTg7ACjPi5ZEs4782D1nG8wdxgUoLsNd3%2Bf2C4kZGYH0QCwUZxeuQTPSEtVrIPnyUXeZLVFEft35MOJ%2FsrGVd9VK0DI%2FlS56zBRah%2BGUGXjUgo6GDyIPGvFTts3TLQ0DhZaixIYUJ3xiNFkgwkbyCNkuvUVz%2FaYbmn3ZZGFoLaDNdnYYhE0jjkWM4oZGmj0gwqxs3i4Js2WSeeoUg36Ik9gm2oKjK1RuLm1KFMz3pws9%2FtTwJodWyQ8XzefDKVSQ6kX8lFOcIlfhH8TTd3l01SPWa8QG5%2BfzUSP8Y3XjqukhY765qyqS7oaVdQLOVkqT8xX6mfMcSkxGwI8UHttVEKKb50cc6gUzofR0zVe5A9XWoMkaijMsBMfJQQOovYnAyF1FN5lKMGAntDA%2BUiOM%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210908T213011Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAYQITWZNVLVUNF3UZ%2F20210908%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=7b0912483050a2460737c2120a9828472eb472bfa193192a8a5fd4dd4f62ba4f)

### Editar y agregar imagén a tipo y sub-tipo de producto

**El usuario podra editar o eliminar el tipo o sub-tipo deseado ademas de insertar una imagen para presentación.**

![picture alt](https://siriotest.s3.us-east-1.amazonaws.com/presentacion.jpg?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGYaCXVzLWVhc3QtMSJHMEUCIFOvO19Iwd6Xvix9IyeBKAs17lEVKY1xM6PaSmmkR8NHAiEA4FgDWb0AWEzd2FwwXtCTq3JKPdASnjgFPlssaI17T28q%2FwIIrv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARABGgw1ODQ2OTM3NjI5MjIiDDKNkI0FRA7oppCn2yrTAoJTfwOf%2FqL3PM6ookuJvuoLojKH%2Bo7wtovaZkt1LQ3mgxmEocd2C5oMm5LVbOL0Nlr8Di%2BMNLF%2FuZGDE8tWV8F1e%2F%2F61fPy%2BXRMNHWe2D3VmAVfShW1LTw6SpU%2Bc5tiY4Q5CgfpAtNXdXtwR7LP5CM5JLQXO7U65c%2BQN7XMuqBxWs9RUFBXuNKMJj0DwffKISujFi%2Fcb39RtRM%2BbGrTAwqff6xbXo9JngIKJfk64y9G4d%2BPZqcWhip%2FXyrqy0I3bfTcSfpDesc1b4f4Xw%2B6mLrLk9wbgFVK9pGLQL85TbRBz%2F%2Bky2v7BKZNQ4AnMYtIUIqxJMa2wGrBJPMZpTZv1AY%2F%2Fsma6FgLcufH4OwIwk3cLIFRipchHy%2FcVTLU%2FW8o63kpGKNXZvZ7vr%2FRI%2FxM%2FzRRMrWgy4WNuhgv364w5m0uUHzUKJ6d8yzEFyYX76luvpsayTDJ0eSJBjqzAuFt8V3UTg7ACjPi5ZEs4782D1nG8wdxgUoLsNd3%2Bf2C4kZGYH0QCwUZxeuQTPSEtVrIPnyUXeZLVFEft35MOJ%2FsrGVd9VK0DI%2FlS56zBRah%2BGUGXjUgo6GDyIPGvFTts3TLQ0DhZaixIYUJ3xiNFkgwkbyCNkuvUVz%2FaYbmn3ZZGFoLaDNdnYYhE0jjkWM4oZGmj0gwqxs3i4Js2WSeeoUg36Ik9gm2oKjK1RuLm1KFMz3pws9%2FtTwJodWyQ8XzefDKVSQ6kX8lFOcIlfhH8TTd3l01SPWa8QG5%2BfzUSP8Y3XjqukhY765qyqS7oaVdQLOVkqT8xX6mfMcSkxGwI8UHttVEKKb50cc6gUzofR0zVe5A9XWoMkaijMsBMfJQQOovYnAyF1FN5lKMGAntDA%2BUiOM%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210908T213331Z&X-Amz-SignedHeaders=host&X-Amz-Expires=299&X-Amz-Credential=ASIAYQITWZNVLVUNF3UZ%2F20210908%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=a4ae7a665c51dea63015b02bf7172f2616fb8c04aaa933ed81be2e31366f5658)

### Agregar producto

**El usuario podra crear un producto.**

![picture alt](https://siriotest.s3.us-east-1.amazonaws.com/presentacion.jpg?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGYaCXVzLWVhc3QtMSJHMEUCIFOvO19Iwd6Xvix9IyeBKAs17lEVKY1xM6PaSmmkR8NHAiEA4FgDWb0AWEzd2FwwXtCTq3JKPdASnjgFPlssaI17T28q%2FwIIrv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARABGgw1ODQ2OTM3NjI5MjIiDDKNkI0FRA7oppCn2yrTAoJTfwOf%2FqL3PM6ookuJvuoLojKH%2Bo7wtovaZkt1LQ3mgxmEocd2C5oMm5LVbOL0Nlr8Di%2BMNLF%2FuZGDE8tWV8F1e%2F%2F61fPy%2BXRMNHWe2D3VmAVfShW1LTw6SpU%2Bc5tiY4Q5CgfpAtNXdXtwR7LP5CM5JLQXO7U65c%2BQN7XMuqBxWs9RUFBXuNKMJj0DwffKISujFi%2Fcb39RtRM%2BbGrTAwqff6xbXo9JngIKJfk64y9G4d%2BPZqcWhip%2FXyrqy0I3bfTcSfpDesc1b4f4Xw%2B6mLrLk9wbgFVK9pGLQL85TbRBz%2F%2Bky2v7BKZNQ4AnMYtIUIqxJMa2wGrBJPMZpTZv1AY%2F%2Fsma6FgLcufH4OwIwk3cLIFRipchHy%2FcVTLU%2FW8o63kpGKNXZvZ7vr%2FRI%2FxM%2FzRRMrWgy4WNuhgv364w5m0uUHzUKJ6d8yzEFyYX76luvpsayTDJ0eSJBjqzAuFt8V3UTg7ACjPi5ZEs4782D1nG8wdxgUoLsNd3%2Bf2C4kZGYH0QCwUZxeuQTPSEtVrIPnyUXeZLVFEft35MOJ%2FsrGVd9VK0DI%2FlS56zBRah%2BGUGXjUgo6GDyIPGvFTts3TLQ0DhZaixIYUJ3xiNFkgwkbyCNkuvUVz%2FaYbmn3ZZGFoLaDNdnYYhE0jjkWM4oZGmj0gwqxs3i4Js2WSeeoUg36Ik9gm2oKjK1RuLm1KFMz3pws9%2FtTwJodWyQ8XzefDKVSQ6kX8lFOcIlfhH8TTd3l01SPWa8QG5%2BfzUSP8Y3XjqukhY765qyqS7oaVdQLOVkqT8xX6mfMcSkxGwI8UHttVEKKb50cc6gUzofR0zVe5A9XWoMkaijMsBMfJQQOovYnAyF1FN5lKMGAntDA%2BUiOM%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210908T213331Z&X-Amz-SignedHeaders=host&X-Amz-Expires=299&X-Amz-Credential=ASIAYQITWZNVLVUNF3UZ%2F20210908%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=a4ae7a665c51dea63015b02bf7172f2616fb8c04aaa933ed81be2e31366f5658)

### Editar y eliminar producto

**El usuario podra editar o eliminar el producto deseado ademas de insertar una imagen para presentación.**

### Vender producto

**El usuario podra vender inmediamente el producto o agregarlo a una venta existente o crear una nueva venta tomando como base ese producto.**

### Presentación

**Tiende 2 formas de ser presentado en forma de *CARD* una para el usuario que solo contendra el link hacia este producto o para un administrador (o vendedor)el cual vera los botones de editar y eliminar.**

### Pagina unica de producto

**Pagina donde se muestra el producto en un mayor detalle.**

### Extras

**Funciones extra de manejo de inventario.**

#### Ordenamiento de tipos, sub-tipos y productos para una mejor presentación

El usuario puede reordenar como se muestran los tipo, sub-tipo o productos. Ademas de mover los sub-tipos a diferentes tipo y los productos a diferentes productos.

#### Busqueda de productos

El usuario puede buscar los productos requeridos.

## Sistema De Ventas

*Todo esto no es accesible para un usuario normal.*

### Crear venta

**Cada usuario puede crear una o más ventas.**

### Agregar o quitar productos

**Se puede agergar o quitar items a la venta.**

### Anular venta (pre-ejecución)

**El usuario puede decidir anular la venta.**

### Ejecutar venta

**Al ejecutar envia a la back-end los datos de la venta y genera un comprobante. Para esto se tiene que dar información como el documento del cliente (natural o juridico), medio de pago, guia de remision, direccion o email del cliente. Emite un PDF.**

### Presentación de ventas

**Las ventas se presentara de una como una tabla.**

### Post venta

**Pagina de post venta, aqui se podra revisar el comprobante, guia de remisión o datos de la venta.**

### Historial de ventas

**Se presentara todas las ventas realizadas, podran ser filtradas segun nombre o documento del cliente, fecha, nombre del producto, nombre del usuario que realizo la venta o estado. Ademas pemite descargar rapidamente los comprobantes de pago(en PDF).**

### Venta completa

**Pagina similar a *Post Venta* pero añade la opción de anulgar la venta.**

### Anular venta (post-ejecución)

**Permite anular la venta despues de haber sido ejecutada esto modificara el estado de algunos productos.**

### Cotizar

**Permite realizar una cotización con los productos en inventario, dando la posibilodad de generar y descargar un archivo de excel.**

## Reportar preformance de gastos e ingresos

### Resumen

**Resumen de los gastos e ingresos del negocio. Ademas da informacion sobre los mejores clientes y productos.**

### Reporte de productos

**Tabla con todos los productos su disponibilidad, gastos, ingresos y precio de venta. Permite descargar un archivo JSON para que sea usado en otras aplicacionnes.**

### Reporte por producto individual

**Reporte detallado del producto seleccionado, separando los gastos e ingresos por mes. Ademas de una tabla donde se muestra cada variación en las cantidades del producto.**

## Usuario

### Acceder a cuenta

Se pude acceder simplemente ingresando el usuario y contraseña o acceder por usando una cuenta de *Google*.

### Registrarse

Te puedes registrar completando los datos requeridos o usar una cuenta de *Google* para hacerlo.

### Editar usuario

Se pude editar la dirección, celular o documento de usuario asi como cambiar la contraseña.

## Presentación de negocio

Al ser una aplicación web que ademas de inventario sirve como una tienda online, una adecuada presentación es requerida.

### Main Page

En esta pagina se presenta el negocio usando productos del intenvatio. <https://inventario.siriodinar.com/store/main>

### Servicio al cliente

* [Contactanos (nodejs)](https://inventario.siriodinar.com/servicio-al-cliente/contactanos "Contactanos Page")
* [Terminos y condiciones (nodejs)](https://inventario.siriodinar.com/servicio-al-cliente/terminos-y-condiciones "Terminos y condiciones")
* [Política de privacidad (nodejs)](https://inventario.siriodinar.com/servicio-al-cliente/politica-de-privacidad "Politica de privacidad")
* [Política de devolución (nodejs)](https://inventario.siriodinar.com/servicio-al-cliente/politica-de-devolucion "Política de devolución")


## Listado de algunos conocimientos de angular usados

* Guards
* Reactive Forms
* RXJS
* Angular material
* HTTP Interceptor
* Universal cookies
* Lazy loading
* PWA

### PROYECTO REALIZADO POR TAC ETARIP => LUIS HUERTAS; PARA SIRIO DINAR E.I.R.L
