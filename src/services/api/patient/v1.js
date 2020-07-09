import errors from 'restify-errors'

const getPatientById = async ( req, res, elasticService, logService ) => {
    try {
        const response = await elasticService.searchPatients( req.fhir, [], [ { match: { id: req.params.uid } } ], [] )

        if ( response.hits.total < 1 ) {
            return new errors.NotFoundError()
        }

        await logService.debug( `Elastic getPatientById for ${req.params.uid}` )
        return response.hits.hits[ 0 ]._source
    } catch ( e ) {
        await logService.warning( `Elastic getPatientById ${e.toString()}` )
        return new errors.InternalServerError()
    }
}

const searchPatients = async ( req, res, elasticService, logService ) => {
    try {
        const params = req.query || req.params || req.body
        const limit = params.size || 25
        const index = ( params.page ? ( params.page - 1 ) : 0 ) * limit

        const response = await elasticService.searchPatients( req.fhir, [], [], [], index, limit )

        await logService.debug( `Elastic searchPatients [${index},${limit}] returns ${response.hits.total} matches` )
        return {
            total: response.hits.total,
            hits: response.hits.hits
        }
    } catch ( e ) {
        await logService.warning( `Elastic searchPatients ${e.toString()}` )
        return new errors.InternalServerError()
    }
}

const searchPatientsByAutoComplete = async ( req, res, elasticService, logService ) => {
    try {
        const params = req.query || req.params
        const query = params.query
        const type = params.type || 'partial'
        const limit = params.size || 25
        const index = ( params.page ? ( params.page - 1 ) : 0 ) * limit
        const fields = []

        if ( type === 'partial' ) {
            fields.push(
                'id',
                'name.family',
                'name.given',
                'identifier.JHN',
            )
        }

        const matches = [
            {
                multi_match: {
                    query: query,
                    type: 'phrase_prefix',
                    fields: [
                        'id',
                        'familyId',
                        'name.family',
                        'name.given',
                        'studies.title',
                        'specimens.id',
                        'identifier.MR',
                        'identifier.JHN',
                        'studies.title',
                        'samples.id'
                    ]
                }
            }
        ]

        const response = await elasticService.searchPatients( sessionData.acl.fhir, fields, [], matches, index, limit )

        await logService.debug( `Elastic searchPatientsByAutoComplete using ${params.type}/${params.query} [${index},${limit}] returns ${response.hits.total} matches` )
        return {
            total: response.hits.total,
            hits: response.hits.hits
        }
    } catch ( e ) {
        await logService.warning( `Elastic searchPatientsByAutoComplete ${e.toString()}` )
        return new errors.InternalServerError()
    }
}

export default {
    getPatientById,
    searchPatients,
    searchPatientsByAutoComplete
}
