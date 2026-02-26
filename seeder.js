const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const productos = [
    // CHOCOLATES
    { nombre: "Carlos V", precio: 18, categoria: "chocolates", imagen: "https://www.laranitadelapaz.com.mx/images/thumbs/0004975_chocolate-carlos-v-16-tabletas-de-20-g-ieps-inc_625.jpeg", stock: 100 },
    { nombre: "Hershey's", precio: 22.5, categoria: "chocolates", imagen: "https://images.albertsons-media.com/is/image/ABS/101011698-C1N1?$ng-ecom-pdp-desktop$&defaultImage=Not_Available", stock: 100 },
    { nombre: "Ferrero 3pz", precio: 45, categoria: "chocolates", imagen: "https://farmaciacalderon.com/cdn/shop/products/78909434_580x.png?v=1605547085", stock: 100 },
    { nombre: "Kinder Bueno", precio: 32, categoria: "chocolates", imagen: "https://resources.sears.com.mx/medios-plazavip/fotos/productos_sears1/original/3093051.jpg", stock: 100 },
    { nombre: "Snickers", precio: 20, categoria: "chocolates", imagen: "https://resources.sanborns.com.mx/imagenes-sanborns-ii/1200/7506174512248.jpg", stock: 100 },
    { nombre: "Milky Way", precio: 20, categoria: "chocolates", imagen: "https://i5.walmartimages.com/asr/b4a66d05-ed9a-41ca-9f5d-b8ef4682bfb1.61a51d6e8e0c125a3fc05e304f2f9fd5.jpeg", stock: 100 },
    { nombre: "Crunch", precio: 19, categoria: "chocolates", imagen: "https://www.laranitadelapaz.com.mx/images/thumbs/0008565_chocolate-crunch-6-barras-de-40-g-ieps-inc_625.jpeg", stock: 100 },
    { nombre: "Larín", precio: 15, categoria: "chocolates", imagen: "https://lagranbodega.vteximg.com.br/arquivos/ids/284793-1000-1000/7501059299429_1--1-.jpg", stock: 100 },
    { nombre: "M&M's", precio: 25, categoria: "chocolates", imagen: "https://mundodulces17.com/wp-content/uploads/2023/03/45_40_zoom_m-y-m-cafe-01.jpg", stock: 100 },
    { nombre: "Caja Ferrero", precio: 180, categoria: "chocolates", imagen: "https://decorazon.mx/cdn/shop/files/IMG-2932.jpg", stock: 50 },

    // GOMITAS
    { nombre: "Gomitas Osito", precio: 15, categoria: "gomitas", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7NXcvWE1D9AkzWelvvVvz5JX84lBqw9TKxh-9c7EjUiT0lUKSN_6LiBLNyPXQx7dT1fZhoTeOLaQuFN55qiVhKPTNSA3qgqtEMCKvi2g&s=10", stock: 100 },
    { nombre: "Panditas", precio: 18, categoria: "gomitas", imagen: "https://i5.walmartimages.com/asr/9d90cbd5-bde9-499c-a1c1-71081be1eba3.77c1814f5fc0f6836c55bbe73b9541b3.jpeg", stock: 100 },
    { nombre: "Gomitas de fresa", precio: 25, categoria: "gomitas", imagen: "https://lamarinamx.vtexassets.com/arquivos/ids/1184214/7501206990087_1.jpg?v=638736147051500000", stock: 100 },
    { nombre: "Gomitas Rings", precio: 20, categoria: "gomitas", imagen: "https://lamimigb.com/cdn/shop/files/7433_1_1000x.jpg?v=1689020970", stock: 100 },

    // PALETAS
    { nombre: "Paleta Payaso", precio: 12, categoria: "paletas", imagen: "https://supermode.com.mx/cdn/shop/products/100006576_b7b3681d-c35a-4144-851a-da174020e3a0.jpg", stock: 100 },
    { nombre: "Rockaleta", precio: 9, categoria: "paletas", imagen: "https://basicos.mayoreoenlinea.mx/cdn/shop/products/7501011135055.jpg", stock: 100 },
    { nombre: "Paleta Corazón", precio: 45, categoria: "paletas", imagen: "https://i5.walmartimages.com.mx/gr/images/product-images/img_large/00750081002694L3.jpg", stock: 50 },
    { nombre: "Chupa Chups", precio: 8, categoria: "paletas", imagen: "https://resources.sanborns.com.mx/imagenes-sanborns-ii/1200/75060428_3.jpg", stock: 100 },

    // DULCES REGIONALES
    { nombre: "Mazapán", precio: 6, categoria: "dulces_regionales", imagen: "https://tiendadelarosa.com/cdn/shop/products/Disenosintitulo-2021-05-20T163304.109_23c5de19-c79c-499b-bf75-8378be91896b_900x.png", stock: 100 },
    { nombre: "Pulparindo", precio: 5, categoria: "dulces_regionales", imagen: "https://tiendadelarosa.com/cdn/shop/products/Disenosintitulo-2021-05-21T101910.664_4100x.png", stock: 100 },
    { nombre: "Pelón Pelo Rico", precio: 10, categoria: "dulces_regionales", imagen: "https://www.cannatlan.com/wp-content/uploads/2021/07/Pelon.jpg", stock: 100 },
    { nombre: "Duvalín", precio: 7, categoria: "dulces_regionales", imagen: "https://www.fpsf.mx/cdn/shop/products/72pz-dulce-duvalin-trisabor-cremoso-avellana-vainilla-fresa-D_NQ_NP_605550-MLM32301683394_092019-F_1024x1024.jpg", stock: 100 },

    // CHICLES
    { nombre: "Bubbaloo Fresa", precio: 3, categoria: "chicle", imagen: "https://m.media-amazon.com/images/I/61NQWhT6EBL._AC_UF894,1000_QL80_.jpg", stock: 100 },
    { nombre: "Clorets", precio: 5, categoria: "chicle", imagen: "https://i5.walmartimages.com.mx/mg/gm/3pp/asr/e1f78ca1-f6e7-4739-bf70-ef75aba5953d.0544b521d268ae0448175a4de349a8c2.jpeg?odnHeight=2000&odnWidth=2000&odnBg=ffffff", stock: 100 },
    { nombre: "Chiclet Adams", precio: 4, categoria: "chicle", imagen: "https://i5.walmartimages.com.mx/samsmx/images/product-images/img_large/981012555-2l.jpg?odnHeight=612&odnWidth=612&odnBg=FFFFFF", stock: 100 },

    // CARAMELOS
    { nombre: "Skittles", precio: 20, categoria: "caramelo", imagen: "https://i5.walmartimages.com/asr/530de111-dbd8-4d2c-bf5e-7ffb7bdd3418.b47fb14bc2205f4297a863dbba81ed02.jpeg", stock: 100 },
    { nombre: "Starburst", precio: 18, categoria: "caramelo", imagen: "https://static.wixstatic.com/media/19ab08_446da728ebdf44778d01fdfe47b2179e~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg", stock: 100 },
    { nombre: "Werther's", precio: 15, categoria: "caramelo", imagen: "https://m.media-amazon.com/images/I/51SICwbyEvL.jpg", stock: 100 },

    // GALLETAS
    { nombre: "Oreo", precio: 18, categoria: "galletas", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFqpojyg5bxVAo5xKR-s1Pm2xR07ZkvA3CTw&s", stock: 100 },
    { nombre: "Marías", precio: 12, categoria: "galletas", imagen: "https://www.gamesacookies.com/sites/gamesa.com/files//2021-11/marias-individual-v3.png", stock: 100 },
    { nombre: "Chokis", precio: 15, categoria: "galletas", imagen: "https://d1zc67o3u1epb0.cloudfront.net/media/catalog/product/c/h/chokis_1000x1000_142-f.jpg?width=265&height=390&store=tienda&image-type=image", stock: 100 },

    // HALLOWEEN
    { nombre: "Dulces Halloween Mix", precio: 45, categoria: "halloween", imagen: "https://dulcesbalu.mx/cdn/shop/files/Dulces-balu-bolsa-las_delicias-bolsa-pinatera-surtida-halloween-1.2_-kilos-frente_56600fe5-1031-4a09-969b-e6c24165965e.png?v=1729535065", stock: 100 },
    { nombre: "Gomitas Calavera", precio: 25, categoria: "halloween", imagen: "https://http2.mlstatic.com/D_Q_NP_889376-MLA99897117381_112025-O.webp", stock: 100 },
    { nombre: "Chocolate Bruja", precio: 30, categoria: "halloween", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbrCpsQs-aJQrFE_LoJxlVWcxQ3U7uNWOLIw&s", stock: 100 },

    // NAVIDAD
    { nombre: "Caja Navideña Ferrero", precio: 250, categoria: "navidad", imagen: "https://m.media-amazon.com/images/I/816nAvvJLFL._AC_UF894,1000_QL80_.jpg", stock: 50 },
    { nombre: "Bastón de Caramelo", precio: 20, categoria: "navidad", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx2xq8oq81PduUK9byi9YcnH8rhhu2Vk9lmg&s", stock: 100 },
    { nombre: "Chocolates Navideños", precio: 80, categoria: "navidad", imagen: "https://i5.walmartimages.com.mx/samsmx/images/product-images/img_large/981025059-3l.jpg", stock: 50 },

    // SAN VALENTÍN
    { nombre: "Caja Ferrero San Valentín", precio: 180, categoria: "san_valentin", imagen: "https://http2.mlstatic.com/D_NQ_NP_990683-MLM81945129959_012025-O.webp", stock: 50 },
    { nombre: "Kisses Gigante", precio: 95, categoria: "san_valentin", imagen: "https://www.hersheyland.mx/content/dam/Hersheyland_Mexico/es_mx/products/kisses/chocolate-hersheys-kisses-con-leche-198g/Chocolate-HERSHEYS-KISSES-con-leche-198g-front.png", stock: 50 },
    { nombre: "Ramo Paletas Amor", precio: 85, categoria: "san_valentin", imagen: "https://aquisureste.com/wp-content/uploads/2022/02/chupa-chups-ramo-flower-bouquet.jpeg", stock: 50 },

    // DÍA DEL NIÑO
    { nombre: "Kinder Sorpresa", precio: 25, categoria: "dia_del_nino", imagen: "https://resources.sears.com.mx/medios-plazavip/fotos/productos_sears1/original/3093051.jpg", stock: 100 },
    { nombre: "Dulces con Juguete", precio: 35, categoria: "dia_del_nino", imagen: "https://supermode.com.mx/cdn/shop/products/100006576_b7b3681d-c35a-4144-851a-da174020e3a0.jpg", stock: 100 },
    { nombre: "Bolsa Sorpresa Niño", precio: 50, categoria: "dia_del_nino", imagen: "https://i.ebayimg.com/images/g/nlQAAeSw~LZpYOAt/s-l1200.webp", stock: 100 },

    // AÑO NUEVO
    { nombre: "Kit Año Nuevo", precio: 120, categoria: "anio_nuevo", imagen: "https://tyranosaurioregalos.com/cdn/shop/files/IMG_4665_800x.png?v=1759364152", stock: 50 },
    { nombre: "Chocolates Celebración", precio: 85, categoria: "anio_nuevo", imagen: "https://img2.elyerromenu.com/images/chocosuenos/caja-de-feliz-ano-nuevo/img.webp", stock: 50 },
    { nombre: "Gomitas Confeti", precio: 30, categoria: "anio_nuevo", imagen: "https://res.cloudinary.com/nassau-candy/image/upload/c_fit,w_1000,h_1000,f_auto/v1706122931/47818.jpg", stock: 100 },

    // DÍA DE REYES
    { nombre: "Roscón de Dulces", precio: 95, categoria: "dia_de_reyes", imagen: "https://sacher.com.mx/a/blog/media/b7f3c4-34.myshopify.com/Post/featured_img/rosca-de-reyes-the-royal-nutcracker-edicion-limitada_1.jpg", stock: 50 },
    { nombre: "Caja Reyes Magos", precio: 150, categoria: "dia_de_reyes", imagen: "https://i.pinimg.com/736x/4e/c9/33/4ec9331583878b92693d767e4bd4091b.jpg", stock: 50 },
    { nombre: "Dulces Tradicionales Reyes", precio: 45, categoria: "dia_de_reyes", imagen: "https://lekkerlandstore.com/139991-large_default/reyes-magos-25-g-20-ud-nadal-y-saroti.jpg", stock: 100 },
];

async function cargarDatos() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB');
        await Product.deleteMany({});
        console.log('Productos anteriores eliminados');
        await Product.insertMany(productos);
        console.log(` ${productos.length} productos cargados exitosamente`);
        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
}

cargarDatos();