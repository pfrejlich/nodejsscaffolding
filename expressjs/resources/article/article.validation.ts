import Joi from 'joi';

const create = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
});

const getByFilter = Joi.object({
    id: Joi.string(),
    title: Joi.string(),
})
.xor('id', 'title');

const patch = Joi.object({
    title: Joi.string(),
    body: Joi.string(),
})
.xor('title', 'body');

const remove = Joi.object({
    id: Joi.string().required(),
});

export default { create, getByFilter, patch, remove } ;
