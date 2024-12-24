import products from './constants/products.js'
import Product from './models/products.model.js';

const InsertDefaultData = async() =>{
    try{
        const Inserted = await Product.insertMany(products);
        console.log("inserted Data : " + Inserted);
    }
    catch(error){
        console.log("Error while inserting default data ");
    }
}


export default InsertDefaultData;