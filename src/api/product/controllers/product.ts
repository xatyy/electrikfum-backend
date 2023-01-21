/**
 * product controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::product.product',({strapi}) => ({
    count(ctx){
        var {query} = ctx.request
        return strapi.query('api::product.product').count({where : query});
    }
})
    );
