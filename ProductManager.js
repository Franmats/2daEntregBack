const fs = require("fs")
class ProductManager {

    #path
    constructor(path) {
        this.#path = path
        this.products = []
    }

    getProducts = async() => {
        if(fs.existsSync(__dirname + `/${this.#path}`)) {
            const productoString = JSON.stringify(this.products)
            fs.writeFileSync("BD.json", productoString)
            const read = await fs.promises.readFile(__dirname + "/BD.json","utf-8").then(e => JSON.parse(e))// con jsonparse lo convertimos a objeto para mostralo en consola si existen o actualizan los datos 
            return read 
        }else {
            fs.writeFileSync(`${this.#path}`,"[]")
        }
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

        //VALIDACION QUE TODOS LOS ESPACIOS DE LOS PRDOCUTOS ESTEN LLENOS QUE TENGA TODOS LOS PARAMETROS (la idea es q si falta un parametro no lo pushee en el array de productos)
        let espaciosVacios = () => {
            let a = Object.values(producto).includes(undefined)// recorre el objeto producto convetido en array y asi no lo pushea al array principal
            let bolean = a ? console.log("Hay espacios vacios") : false
            return bolean
        }
       

        // VALIDACION QUE TODOS LOS PRODUCTOS TENGAN DIFERENTE CODE
        let codigoRepe = () => { 
            let a = this.products.filter(e => e.code == code) 
            let bolean = (a.length > 0) ? console.log("Hay un codigo repetido") :  false
            return bolean
        }


        // CONDICION FINAL PARA QUE LOS PUSHEE AL ARRAY
        if (espaciosVacios() === false && codigoRepe() === false) {

            this.products.push(producto)


        }

    }

    //METODO PARA BUSCAR UN PRODUCTO SEGUN ID
    getProductById = async (id) => {
        this.products = await this.getProducts()

        const productoFiltrado = this.products.filter(e => e.id == id)
            
        if (productoFiltrado.length > 0 && typeof id == "number") { //VALIDO CON EL TYPE OF QUE LA ENTRADA DEL PARAMETRO SE SOLO UN NUMERO
            return console.log ("El producto buscado",productoFiltrado)
        } else {
            return console.log("Not Found") }
    }


    deleteProduct = async (id)=> {
        this.products = await this.getProducts()
        let a = this.products.filter(prod => prod.id !== id)
        this.products = a
        console.log("Producto Eliminado")
    }

    updateProduct = async (id, parametro, actualizacion)=> {
        this.products = await this.getProducts() 
        let n = this.products.find(e => e.id == id)
            
        switch (parametro) {
            case "title":
                n.title = actualizacion
                    
                break;
            case "description":
                n.description = actualizacion
                break;
            case "price":
                n.price = actualizacion
                break;
            case "stock":
                n.stock = actualizacion
                break;
            
            default:
                console.log("Parametro Incorrecto")
                break;
            }
        let a = this.products.filter(prod => prod.id !== id)
        this.products = a
        this.products.push(n)
        console.log("Producto Modificado", n )
    }  
}

const main = async() => {
    const manager = new ProductManager("BD.json")
    
    manager.addProduct("producto prueba 1", "Este es un producto prueba", 200, "Sin imagen", "abc123",23)
    manager.addProduct("producto prueba 2", "Este es un producto prueba", 200, "Sin imagen", "abc466", 24)
    manager.addProduct("producto pruena 3", "Este es un producto prueba", 200, "Sin imagen", "abc4545",25)
    manager.addProduct("producto prueba 4", "Este es un producto prueba", 100, "Sin imagen", "abc4544",24)
    manager.addProduct("producto prueba 5", "Este es un producto prueba", 100, "Sin imagen", "abc4546",24)
    manager.addProduct("producto prueba 6", "Este es un producto prueba", 100, "Sin imagen", "abc4547",24)
    manager.addProduct("producto prueba 7", "Este es un producto prueba", 100, "Sin imagen", "abc4547",24)
    manager.addProduct("producto prueba 8", "Este es un producto prueba", 100, "Sin imagen", "abc4549",24)
    manager.addProduct("producto prueba 9", "Este es un producto prueba", 100, "Sin imagen", "abc4550",24)
    manager.addProduct("producto prueba 10", "Este es un producto prueba", 100, "Sin imagen", "abc4551",24) 
    console.log(await manager.deleteProduct(3))
    console.log(await manager.updateProduct(1,"price",21))
    console.log("Productos",await manager.getProducts())
}


main()
