const zod = require('zod')

const inputValidation = zod.object({
    a:zod.number().min(0),
    b:zod.number().min(0)
})
module.exports = inputValidation