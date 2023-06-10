/* class ProductManager {
    constructor() {
        this.products= []
    }
    getNextId = () => {
        const count = this.products.length
        //[0,1,2,3,4,5] count = 6, count -1 = 5 obtengo el ultimo objeto y obtengo su id
        const nextID = (count > 0 ) ? this.products[count - 1].id + 1 : 1 
        return nextID
    }

    getProducts= () => {return this.products}
    addProduct = (title, description, price, thumbnail, code, stock) => {
        const producto = {
            id: this.getNextId(),
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        //VALIDACION QUE TODOS LOS ESPACIOS DE LOS PRDOCUTOS ESTEN LLENOS QUE TENGA TODOS LOS PARAMETROS
        const espaciosVacios = this.products.map(e => Object.values(e)).map(e => e.includes(undefined)).includes(true)
        if (espaciosVacios == true) {
            return console.log("Hay espacios vacios en la lista de productos")
        }

        // VALIDACION QUE TODOS LOS PRODUCTOS TENGAN DIFERENTE CODE
        const codigoRepe = this.products.filter(e => e.code == code)
        if (codigoRepe.length > 0  ) {

            console.log("El codigo del nuevo producto esta repetido")

        } else {
            this.products.push(producto)
        }
    }

    //METODO PARA BUSCAR UN PRODUCTO SEGUN ID
    getProductById = (id) => {
        const productoFiltrado = this.products.filter(e => e.id == id)
        if (productoFiltrado.length == 0) {
            return console.log("Not Found")
        } else {
            return console.log ("El producto buscado",productoFiltrado)}
    }
}

const manager = new ProductManager()
console.log("Array de Productos Vacio",manager.getProducts())

manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 23) // PRODUCTO NORMAL
manager.addProduct("producto prueba 2 ", "Este es un producto prueba", 2200, "Sin imagen", "abc1", 26) // PRODCUTO NORMAL
manager.addProduct("producto prueba 3 ", "Este es un producto prueba", 200, "Sin imagen", "abc15") // PRODUCTO CON UN PARAMETRO VACIO
manager.addProduct("producto con code REPETIDO ", "Este es un producto prueba", 22, "Sin imagen", "abc123", 26) // PRODUCTO CON CODE REPETIDO
console.log("Array con Productos", manager.getProducts())

manager.getProductById(5) */

const fs = require("fs")
class ProductManager {

    #path
    constructor(path) {
        this.#path = path
        this.products = []
    }

    getProducts = async() => {

        if(fs.existsSync(__dirname + "/BD.json")) {
            const read = await fs.promises.readFile(__dirname + "/BD.json","utf-8").then(e => JSON.parse(e))
            console.log("Productos",read)

        }else if (fs.existsSync(__dirname + "/BDmodified.json")) {
            const read = await fs.promises.readFile(__dirname + "/BDmodified.json","utf-8").then(e => JSON.parse(e))
            console.log("ProductosModificados",read)
        }else return []
    }
    getNextId = () => {
        const count = this.products.length
        //[0,1,2,3,4,5] count = 6, count -1 = 5 obtengo el ultimo objeto y obtengo su id
        const nextID = (count > 0 ) ? this.products[count - 1].id + 1 : 1 
        return nextID
    }
    addProduct = (title, description, price, thumbnail, code, stock) => {

        const producto = {
            id: this.getNextId(),
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        //VALIDACION QUE TODOS LOS ESPACIOS DE LOS PRDOCUTOS ESTEN LLENOS QUE TENGA TODOS LOS PARAMETROS
        const espaciosVacios = this.products.map(e => Object.values(e)).map(e => e.includes(undefined)).includes(true)
        if (espaciosVacios == true) {
            return console.log("Hay espacios vacios en la lista de productos")
        }

        // VALIDACION QUE TODOS LOS PRODUCTOS TENGAN DIFERENTE CODE
        const codigoRepe = this.products.filter(e => e.code == code)
        if (codigoRepe.length > 0  ) {

            console.log("El codigo del nuevo producto esta repetido")

        } else {
            this.products.push(producto)
            const productoString = JSON.stringify(this.products)
            fs.writeFileSync("BD.json", productoString)
        }


    }

    getProductById = (id) => {
        const productoFiltrado = this.products.filter(e => e.id == id)
        if (productoFiltrado.length == 0) {
            return console.log("Not Found")
        } else {
            return console.log ("El producto buscado",productoFiltrado)}
    }

    deleteProduct = async(id)=> {
        fs.unlinkSync(__dirname + "/BD.json")
        const a = this.products.filter(prod => prod.id !== id)
        this.products.push(a)
        const productoString = JSON.stringify(a)
        fs.writeFileSync("BDmodified.json", productoString)
        console.log("Base de datos Modificada", productoString )
    }

    updateProduct = (id, modificarProp)=> {
        fs.unlinkSync(__dirname + "/BD.json")
        const localizarProducto = async ()=> { 
            const n = await this.products.find(e => e.id == id)
            n.title = modificarProp
            this.products.push(n)
            const productoString = JSON.stringify(this.products)
            fs.writeFileSync("BDmodified.json", productoString)
        }
        localizarProducto()
        
       
        
        
    }




}

const manager = new ProductManager("BD.json")
manager.getProducts()
manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123",23)
manager.addProduct("1producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc466", 23)
manager.addProduct("111111111111 prueba", "Este es un producto prueba", 200, "Sin imagen", "abc4546", 23)

manager.getProductById(1)

/* manager.updateProduct(2,"Nombre Modificado") 
manager.getProducts() */


/* manager.deleteProduct(2)
manager.getProducts() */

// NOTA: 1) Primero hay que ejecutar el archivo sin los metodos updateProduct y deleteProduct para que se cree la bdd, sino no van a funcionar estos metodos luego. A la segunda vez de ejecuatar el archivo empieza a grabar en la memoria la base de datos nose por que pero a la segunda ejecucion empieza a funcionar
//       2) Probar los metodos updateproduct y deleteProduct por separado. Por que cada vez que se ejecutan estos metodos eliminan la bdd original y luego crean otra nueva con las modificaciones o eliminaciones hechas 
