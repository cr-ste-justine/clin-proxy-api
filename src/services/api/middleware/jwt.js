import Keycloak from '../helpers/keycloak'

// TODO: Find an alternative for local management of self-signed certificates
// The following is required when using a local instance of KeyCloak which uses self-signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

export default ( server, config ) => {
    // eslint-disable-next-line new-cap
    const keycloak = Keycloak( config.jwt )
    const exclusions = [
        { methods: [ 'GET' ], path: '/docs' },
        { methods: [ 'GET' ], path: '/health' }
    ]

    server.use( ( req, res, next ) => {
        const accessToken = req.headers.Authorization || req.headers.authorization || null

        // server.router.lookup( req, res )
        const route = req.getRoute()
        let excluded = false

        if ( route ) {
            exclusions.forEach( ( exclusion ) => {
                excluded = exclusion.methods.includes( route.method ) && exclusion.path === route.path
            } )
            if ( !excluded ) {
                keycloak
                    .verifyOffline( ( accessToken && accessToken.indexOf( ' ' ) > -1 ) ? accessToken.split( ' ' )[ 1 ] : '' )
                    .then( ( user ) => {
                        req.fhirPractitionerId = user.fhirPractitionerId
                        req.fhirOrganizationId = user.fhirOrganizationId
                        return next()
                    } )
                    .catch( () => {
                        // Token expired or is invalid
                        res.send( 403 )
                    } )
            }
        } else {
            return next()
        }

    } )
}