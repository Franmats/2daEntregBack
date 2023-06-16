const fs = require("fs")
class ProductManager {

    #path
    constructor(path) {
        this.#path = path
        this.products = []
    }

    getProducts = async() => {
        if(fs.existsSync(__dirname + "/BD.json")) {
            const read = await fs.promises.readFile(__dirname + "/BD.json","utf-8").then(e => JSON.parse(e))// con jsonparse lo convertimos a objeto para mostralo en consola si existen o actualizan los datos
            console.log("Productos",read)
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

            return console.log("El codigo del nuevo producto esta repetido")

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

    deleteProduct = (id)=> {
        const a = this.products.filter(prod => prod.id !== id)
        this.products.push(a)
        const productoString = JSON.stringify(a)
        fs.writeFileSync("BD.json", productoString)
        console.log("Profucto eliminado", a )
    }

    updateProduct = (id, modificarProp)=> {
        const localizarProducto = async ()=> { 
            const n = await this.products.find(e => e.id == id)
            n.title = modificarProp
            this.products.push(n)
            const productoString = JSON.stringify(this.products)
            fs.writeFileSync("BD.json", productoString)
            console.log("Profucto Modificado", n )
        }
        localizarProducto()    
    }
}
const main = async() => {
    const manager = new ProductManager("BD.json")
    console.log(await manager.getProducts())
    manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123",23)
    manager.addProduct("1producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc466", 23)
    manager.addProduct("111111111111 prueba", "Este es un producto prueba", 200, "Sin imagen", "abc4544",25)
    manager.addProduct("111111111111 prueba", "Este es un producto prueba", 100, "Sin imagen", "abc4544",24)
    /* manager.deleteProduct(2); */
    /* manager.updateProduct(3, "Cambio" ) */
}


main()
