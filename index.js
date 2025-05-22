import dotenv from"dotenv";
dotenv.config();

import express from "express";

import cors from "cors";

import{leerTareas,crearTarea, actualizarEstado, actualizarTexto, borrarTarea} from "./datos.js";

const servidor = express();

servidor.use(cors());

servidor.use(express.json()); //pregunta por el content type application json y crea objeto en peticion.body

if(process.env.PRUEBAS){
    servidor.use("/pruebas", express.static("./pruebas"));
}

servidor.get("/tareas", async (peticion,respuesta) => {
    try{

        let tareas = await leerTareas();
        respuesta.json(tareas);

    }catch(error){
        respuesta.status(500);
        respuesta.json({error : "error en el servidor"})
    }
});

servidor.post("/tareas/nueva", async(peticion, respuesta,siguiente) => {
    let {tarea} = peticion.body;
  
    if(tarea == undefined || tarea.toString().trim() == ""){
        return siguente(true);

    }
    try{

        let id = await crearTarea(tarea);

        respuesta.status(201);
        respuesta.json({id});

    }catch(error){
        respuesta.status(404);
        respuesta.json({error : "error en el servidor"})

    }
});

servidor.put("/tareas/actualizar/estado/:id", async(peticion, respuesta,siguiente) => {//exp reg>> solo puede ser 1 o más números
    let {id} = peticion.params;

    if(!/^[0-9]+$/.test(id)){
        return siguiente();
    }
  
    if(tarea == undefined || tarea.toString().trim() == ""){
        return siguente(true);

    }
    try{

        let cantidad = await actualizarEstado(id);

        if(!cantidad){
            return siguiente();
        }

        respuesta.status(204);

        respuesta.send("");

    }catch(error){
        respuesta.status(500);
        respuesta.json({error : "error en el servidor"})

    }
});

servidor.put("/tareas/actualizar/texto/:id", async(peticion, respuesta,siguiente) => {
    let {tarea} = peticion.body;
  
    if(tarea == undefined || tarea.toString().trim() == ""){
        return siguente(true);

    }
    
    let {id} = peticion.params;

    if(!/^[0-9]+$/.test(id)){
        return siguiente();
    }
  
    if(tarea == undefined || tarea.toString().trim() == ""){
        return siguente(true);

    }
    try{

        let cantidad = await actualizarTexto(id,tarea);

        if(!cantidad){
            return siguiente();
        }

        respuesta.status(204);
        
        respuesta.send("");

    }catch(error){
        respuesta.status(500);
        respuesta.json({error : "error en el servidor"})

    }
});

servidor.delete("/tareas/borrar/:id", async(peticion, respuesta,siguiente) => {
    let {id} = peticion.params;

    if(!/^[0-9]+$/.test(id)){
        return siguiente();
    }
  

    try{

        let cantidad = await borrarTarea(id);

        if(!cantidad){
            return siguiente ();
        }

        respuesta.status(204);

        respuesta.send("");

    }catch(error){
        respuesta.status(500);
        respuesta.json({error : "error en el servidor"})

    }
});

servidor.use((error,peticion,respuesta,siguiente) => {   // si metemos 4 parametro se convierte en un middleware de gestion de errores (especial) y interpreta los parametros en el orden >> error,peticion,respuesta,siguiente
    //es gestion total de errores, cualquier error sale por aquí,  por ej error de sintaxis
    respuesta.status(400);
    respuesta.json({error : "recurso no encontrado"});
});


servidor.use((peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({error : "recurso no encontrado"});
});


servidor.listen(process.env.PORT);

//cuando usamos get no se puede enviar el body en la petición, todo tiene que ir en la url