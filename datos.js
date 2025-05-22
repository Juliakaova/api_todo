import dotenv from"dotenv";
dotenv.config();

import postgres from "postgres";


function conectar(){ // deja preparada la conexión a la base de datos
    return postgres({
        host : process.env.DB_HOST,
        database : process.env.DB_NAME,
        user : process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });
}

export function leerTareas(){// lee las tareas de la base de datos
    return new Promise((ok,ko)=> {
        const conexion = conectar();

        conexion `SELECT * FROM tareas ORDER BY id`
        .then(tareas => {// aquí ya están las tareas, ya tengo esa info por eso corto conexión en la siguiente línea
            conexion.end();   
            ok(tareas)
        })
        .catch( error => ko({ error : "error en la base de datos"}))
    });
}

export function crearTarea(tarea){
    return new Promise((ok,ko)=> {
        const conexion = conectar();

        conexion `INSERT INTO tareas (tarea) VALUES (${tarea}) RETURNING id`
        .then(([{id}])=> {
            conexion.end();   
            ok(id)
        })
        .catch( error =>  ko({ error : "error en la base de datos"}))
    });
}

export function actualizarEstado(id){
    return new Promise((ok,ko)=> {
        const conexion = conectar();

        conexion `UPDATE tareas SET terminada = NOT terminada WHERE id = ${id}`
        .then( ({count})=> {        // revisar desestructuración
            conexion.end();   
            ok(count)//devuelve 1 o 0
        })
        .catch( error =>  ko({ error : "error en la base de datos"}))
    });
}

export function actualizarTexto(id,tarea){
    return new Promise((ok,ko)=> {
        const conexion = conectar();

        conexion `UPDATE tareas SET tarea = ${tarea} WHERE id = ${id}`
        .then( ({count})=> {   
            conexion.end();   
            ok(count)
        })
        .catch( error =>  ko({ error : "error en la base de datos"}))
    });

 }

 export function borrarTarea(id){
    return new Promise((ok,ko) => {
        const conexion = conectar();

        conexion`DELETE FROM tareas WHERE id = ${id}`
        .then( ({count}) => {
            conexion.end();
            ok(count)
        })
        .catch( error => ko({ error : "error en la base de datos"}))
    });
}