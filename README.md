![](https://github.com/Ferlab-Ste-Justine/clin-proxy-api/workflows/Build%20Images/badge.svg)
![](https://github.com/Ferlab-Ste-Justine/clin-proxy-api/workflows/Publish%20Images%20Using%20Commit%20Hash/badge.svg)
![](https://github.com/Ferlab-Ste-Justine/clin-proxy-api/workflows/Publish%20Images%20Using%20Tag/badge.svg)

# CLIN Proxy API

## Creating Services

### Boilerplate

`src/services/api/boilerplate`

###  Default Endpoints

* `GET` on `/{endpoint}/health` returns a health check for the service endpoint
* `GET` on `/{endpoint}/docs` returns the documentation for the service endpoint ( https://editor.swagger.io )

## Available Scripts

* `pnpm start` launches of the Services in local development mode.<br>
* `pnpm test` launches all test runners using .env file.<br>
* `pnpm run functional-tests` start functional tests using  [newman](https://github.com/postmanlabs/newman) through Postman collections
* `pnpm run unit-tests` start unit tests using  [mocha](https://www.npmjs.com/package/mocha)
* `pnpm run build` builds all of the Services for production mode.<br>
* `pnpm run service-patient` starts the Patient API Service in production (built) mode.<br>
* `pnpm run service-variant` starts the Variant API Service in production (built) mode.<br>
* `pnpm run service-gene` starts the Gene API Service in production (built) mode.<br>
* `pnpm run service-meta` starts the Meta API Service in production (built) mode.<br>
* `pnpm run dev-service-xyz` launches specified service in docker development mode.<br>

## Development Set-up

### Directly on Computer

Install Node.js LTS 10.14.1 using [nvm](https://github.com/creationix/nvm/blob/master/README.md) and run
```
cp -p development.env .env
npm install -g pnpm
pnpm install
pnpm start
```

### Dockerized Version

If you haven't done so already, generate self-signed certificates for the **dev.chusj-clin-dev.org** domain: https://github.com/cr-ste-justine/devops/tree/dev/certificates

Run the following to launch:

```
./launch-docker-local.sh
```

Run the following to tear down:

```
./teardown-docker-local.sh
```

### ElasticSearch Set-up

To create the 'statement' and 'profile' indices, run the following command line where ElasticSearch is available (ssh -L or ssh thru environment)

```
curl -XPUT "http://localhost:9200/statement" -H 'Content-Type: application/json' -d @clin-statement-centric.json
curl -XPUT "http://localhost:9200/profile" -H 'Content-Type: application/json' -d @clin-profile-centric.json
```

## CI/CD Workflow

### Pushing images

Images are pushed by merging on dev. The version tag is taken from the version in the package.json file so make sure you increment it before merging to dev.

If you add a new service, make sure to add it to the **build_images.yml** pipeline and to the **push_images.sh** script.

### Deploying

Assuming you have access to deployments, you can go to this repo: https://github.com/cr-ste-justine/clin-environments

Then, go to the directory of the environment you want to deploy on, go to the **clin-proxy-api** directory, change the orchestration, get it merged to master and let the pipeline do the deployment for you.