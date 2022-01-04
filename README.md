# it-control
![](https://github.com/mia-as/it-control/blob/main/images/previewApp.png)
## Backend
NodeJs 10.16.3
NPM 6.9.0
### Dependencias
   express      4.17.1 <br>
   express-jwt  6.0.0 <br>
   jsonwebtoken 8.5.1 <br>
   body-parser  1.19.0 <br>
   mysql        2.18 <br>
   bcryptjs     2.4.3 <br>
   cors         2.8.5 <br>
   dotenv       9.0.2 <br>
   morgan       1.10.0  //nos proporciona información sobre los request recibidos<br> 
   
### Instalar dependencias
yarn<br>
o<br>
npm i // npm install<br>

### Correr servidor
nodemon<br> 
o<br>
node server.js<br>

### Variables de entorno
PORT                   = 9000<br>
API_URL                = /api/v1<br> 
SECRET                 = d5r1c8gke8df  // utilizado por el json web token<br>
TIEMPO_PRIMER_BLOQUEO  = 10   // segundos<br>
TIEMPO_SEGUNDO_BLOQUEO = 15  // segundos<br>

### Diccionario
#### La lista completa de todas las peticiones que se puede realizar a la API están guardadas en el archivo 'di-control.postman_collection.json'. Dicho archivo puede ser importado al Postman.

![Importar colección al Postman](https://github.com/mia-as/it-control/blob/main/images/postman.jpg)

## Frontend
react 17.0.2 </br>
react-dom 17.0.2 </br>
react-scripts 4.0.3 </br>
material-ui/core 4.11.4  </br>
axios 0.21.1 </br>
downshift 6.1.3 </br>
prop-types 15.7.2 </br>
react-email-validator 1.0.2 </br>
react-icons 4.2.0 </br>
react-loadingg 1.7.2 </br>
react-paginate 7.1.3 </br>
react-router 5.2.0 </br>
react-router-dom 5.2.0 </br>
web-vitals 1.0.1 </br>

## Diagrama de Flujo - Login Usuarios
![](https://github.com/mia-as/it-control/blob/main/images/flujoLogueoUsuarios.png)

