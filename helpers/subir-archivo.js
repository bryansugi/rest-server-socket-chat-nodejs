const path = require('path')
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extensionesValida = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {

    return new Promise((resolve, reject) => {

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.')
        const extension = nombreCortado[nombreCortado.length - 1]
            //Validar la extension
        console.log(extensionesValida)
        if (!extensionesValida.includes(extension)) {
            return reject(`La extensión ${extension} no es permitida, ${extensionesValida}`)
        }

        const renameArchivo = uuidv4() + '.' + extension

        const uploadPath = path.join(__dirname, '../uploads/', carpeta, renameArchivo);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve(renameArchivo)

        });

    })


}

module.exports = {
    subirArchivo
}