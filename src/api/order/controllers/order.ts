/**
 * order controller
 */
 import MobilPay from 'mobilpay-card';
 import { factories } from '@strapi/strapi'; 
import order from '../routes/order';
import database from '../../../../config/database';
import { CommandInteractionOptionResolver } from 'discord.js';

 const mobilPay = new MobilPay('2ISS-YFMT-GV1H-AAPH-ZRIQ');

 mobilPay.setPublicKey('-----BEGIN PUBLIC KEY-----\n'+
 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8IdPzYRKWRbir4IWfTe+Ql22t\n'+
 'OTFjQoeNtpHHxSm6j+WFYglAYNzHOWWHdXtF4vVItUCNmf4773Iaw2RkMI2qwKa9\n'+
 '0vW6MBxJGR/NWaJTqDxwWW2KQNvASMh2EXGk14y7YgRr46cLs5Y5l3gaFS4pyGhN\n'+
 'CFKTHp/TC1htnxjHXQIDAQAB\n'+
 '-----END PUBLIC KEY-----\n');

 const NETOPIA_SIGNATURE="2ISS-YFMT-GV1H-AAPH-ZRIQ"
 
 export default factories.createCoreController('api::order.order', ({strapi}) => ({
     async create(ctx) {

        const { email,
            customerFirstName,
            customerLastName,
            products,
            street,
            city,
            county,
            phone,
            postalCode,
            finalPrice,
            orderType} = ctx.request.body

        try{

            let orderAmmount = 0
            products.forEach((item) => {
                orderAmmount += item.quantity * item.price;
            });
       
            

            mobilPay.setClientBillingData({
                firstName: customerFirstName,
                lastName: customerLastName,
                county: county,
                city: city,
                address: street, 
                email: email,
                phone: phone,
            });

            mobilPay.setPaymentData({
                orderId: Date.now().toString(),
                amount: finalPrice,
                currency: "RON",
                details: "Plata la ElectrikFum.ro",
                confirmUrl: "http://79.114.48.133/api/orders/verifyPayment",
                returnUrl:  "http://localhost:3000/order",
            });

           let request = mobilPay.buildRequest(true);

            await strapi.entityService.create('api::order.order',{
                data:{
                    orderIdentifier: mobilPay.paymentData.order.$.id,
                    email,
                    customerFirstName,
                    customerLastName,
                    products,
                    street,
                    city,
                    county,
                    phone,
                    postalCode,
                    orderType,
                    finalPrice,
                    orderStatus: "placed"
                },
            });
            
            return request;

        }catch(err){
            ctx.response.status = 500;
            console.log(err)
            return err;
        }
     },
     async delivery(ctx) {

        const { email,
            customerFirstName,
            customerLastName,
            products,
            street,
            city,
            county,
            phone,
            postalCode,
            finalPrice,
            voucher,
            orderType} = ctx.request.body

        try{

            let orderAmmount = 0
            products.forEach((item) => {
                orderAmmount += item.quantity * item.price;
            });

            const orderId = Date.now().toString();

            await strapi.entityService.create('api::order.order',{
                data:{
                    orderIdentifier: orderId,
                    email,
                    customerFirstName,
                    customerLastName,
                    products,
                    street,
                    city,
                    county,
                    phone,
                    postalCode,
                    finalPrice,
                    orderType,
                    orderStatus: "placed"
                },
            });


            return orderId;


        }catch(err){
            ctx.response.status = 500;
            console.log(err)
            return err;
        }
     },
     async verifyPayment(ctx) {

        try{
            
            const {env_key, data} = ctx.request.body

            mobilPay.setPrivateKey('-----BEGIN PRIVATE KEY-----\n'+
            'MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAPWF5TRG+VH3kcWa\n'+
            'cheCdCB/EwUZYFELepVGldTsDIt/w7h9Bi/55+Eq0HjBp9zqMrz90jZh67akEQKb\n'+
            'x1ilA87XkrBKXTvGzyszglz6UbfLhuLg1UfmjJst9cOtwPOAdL30wNewKHv2uJio\n'+
            'wqqolt+OImKm0MO0/+MM/z8n4szPAgMBAAECgYEA8JL6O3cv5TkIBO+Iy7BvyUe6\n'+
            'g0ySK9drjclUFwYUZLwUMzmOToQ4yVECZNCcgsKYZMbwq4jXRmcMo9mwQxOt3Zvc\n'+
            'ukwcwbnhDbUY2pgEr+SMasYzEErg+pJLhLkWCs8tJL+YppV30+i9JT9LelekBwY3\n'+
            'bQmWdbaLv56P+5w7QIECQQD7SmicemdHGwmhEz13nbOynmP0h5nXY3yFYYkKmUSn\n'+
            'R6VpunCD9G3thIBJfFVyg4EDHqOQIMekypTcd8XRAmHJAkEA+h/Q4Hia8EXJA6hf\n'+
            'ATkaasI6R79ZriOUpa82wo7W2jqSGQ1UtujY3n7TuNuE0GjISgYwbhcowabJKEVJ\n'+
            '5gvF1wJAVjYM9cI4tHheMVi8edEs2Vbly/rJmM+U5N21emFi4FEAOumvuFWfcSFI\n'+
            'Me3qEsNy+3MDgmr8k1i9AXZF85LxoQJBALRifaFlWVgu++lHZDzdkc+sg5t6xJJx\n'+
            '1qIm2rc1jH2WAAdRNeczxjOwA8Etj3s+FjRMgmDjEuGWBzyju8fMdcECQQCj/DtM\n'+
            '+b7wtPqMtet6cbf8Mc45vJnvmIpviG/BMYi8dlQFty1gzw/dyn4CLNM47umAVxTR\n'+
            '9JSX2ToP3Qt102qK\n'+
            '-----END PRIVATE KEY-----');
                


            let response = await mobilPay.validatePayment(env_key, data)

            const id = response.$.id;

            const entry = await strapi.entityService.findMany("api::order.order",{
                filters: {
                    orderIdentifier: {
                        $eq: id
                    }
                }
            })

           

            const realId = entry[0].id;
            
            
            switch(response.action){
                case 'confirmed':
                    await strapi.entityService.update("api::order.order",realId,{
                        data:{
                            orderStatus: "confirmed",
                        },
                    });
                    if(entry.status != "confirmed"){
                        const getItem = await Promise.all(
                            entry[0].products.map(async (product) => {
                                const item = await strapi.service("api::product.product").findOne(product.id, {});
                                await strapi.entityService.update("api::product.product",item.id,{
                                    data:{
                                        stock: item.stock - 1,
                                    },
                                });
                            })
                        )
                    }
                    break;
                case 'paid':
                    console.log("paid")
                    break;
                case 'paid_pending':
                    console.log("pending")
                    break;
                case 'confirmed_pending':
                    console.log("confirmed_pending")
                    break;
            }
            ctx.response.type =  response.res.set.value;
            ctx.response.status = 200;
            ctx.response.body = response.res.send;
            
        }catch(err){
            ctx.response.status = 500;
            console.log(err)
            return err;
        }


    },
    async findOrder(ctx){

        const response = ctx.request.query

        const id = response.id


        const entry = await strapi.query('api::order.order').findMany({
                where: {
                    orderIdentifier: {
                        $eq: id,
                    },
                },
                populate: {
                    users_permissions_user :{
                        select: ['id'],
                    },
                },
        })  
        return entry
    },
    count(ctx){
        var {query} = ctx.request
        return strapi.query('api::order.order').count({where : query});
    },
    fetch(ctx){
        var {query} = ctx.request
        console.log(query)
        return strapi.query('api::order.order').findMany({
            orderBy: {id: 'desc'},
            offset: query.offset,
            limit: 10});
    },
    fetchMy(ctx){
        var {query} = ctx.request
        console.log(query)
        return strapi.entityService.findMany('api::order.order',{
            filters:{
                users_permissions_user:{
                            id:{
                                $eq: query.id
                    }
                }
            }
        });
    },
   async update(ctx){
       return await strapi.entityService.update("api::order.order",ctx.request.body.id,{
        data:{
            orderStatus: ctx.request.body.data.orderStatus,
        },
        
    });
    }

 }))
 