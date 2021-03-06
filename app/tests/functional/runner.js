/* eslint-disable global-require */
// https://github.com/postmanlabs/newman#newmanrunoptions-object--callback-function--run-eventemitter

require( 'dotenv' ).config()
import newman from 'newman'

if ( !process.env.TEST_API_SERVICES ) {
    console.error( 'No services defined for functional test in TEST_API_SERVICES. Exiting...' )
    process.exit( 1 )
}

if ( process.env.TEST_AUTH_SERVICE_HOSTNAME ) {
    if ( !process.env.TEST_AUTH_SERVICE_USERNAME || !process.env.TEST_AUTH_SERVICE_PASSWORD ) {
        console.error( 'No TEST_AUTH_SERVICE_USERNAME or TEST_AUTH_SERVICE_PASSWORD defined. Exiting...' )
        process.exit( 1 )
    }
} else {
    console.warn( 'No TEST_AUTH_SERVICE_HOSTNAME defined.' )
}

const enabledServices = JSON.parse( process.env.TEST_API_SERVICES )

enabledServices.forEach( ( service ) => {

    const configPath = `${service.toUpperCase()}_API_SERVICE`

    try {
        const collection = require( `${__dirname}/collections/${service}.json` )
        const environment = require( `${__dirname}/environments/${service}.js` )

        newman.run( {
            collection,
            environment,
            insecure: true,
            reporters: 'cli'
        }, ( ee ) => {
            if ( ee ) {
                console.error( `Collection Error ${ee}` )
            }
            console.info( 'Collection Complete' )
        } )

    } catch ( e ) {
        console.error( `${configPath} ${e}` )
    }

} )
