import errors from 'restify-errors'

const searchHPODescendants = async( req, res, elasticService, logService ) => {
    try {
        const params = req.query || req.params || req.body
        const { parentHpoId } = params
        const response = await elasticService.searchHPODescendants( parentHpoId )

        return {
            total: response.hits.total.value,
            hits: response.hits.hits
        }
    } catch ( error ) {
        await logService.warning( `Elastic searchHPODescendants ${error.toString()}` )
        return new errors.InternalServerError()
    }
}

const searchHPOAutocomplete = async( req, res, elasticService, logService ) => {
    try {
        const params = req.query || req.params || req.body
        const { prefix } = params
        const response = await elasticService.searchHPOAutocomplete( prefix )

        return {
            total: response.hits.total.value,
            hits: response.hits.hits
        }
    } catch ( error ) {
        await logService.warning( `Elastic searchHPOAutocomplete ${error.toString()}` )
        return new errors.InternalServerError()
    }
}

export default {
    searchHPODescendants,
    searchHPOAutocomplete
}
