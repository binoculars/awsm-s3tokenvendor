[![NPM](https://nodei.co/npm/awsm-s3tokenvendor.png?mini=true)](https://nodei.co/npm/awsm-s3tokenvendor/)
[![npm version](https://badge.fury.io/js/awsm-s3tokenvendor.svg)](https://badge.fury.io/js/awsm-s3tokenvendor)

# Description

[![Greenkeeper badge](https://badges.greenkeeper.io/binoculars/awsm-s3tokenvendor.svg)](https://greenkeeper.io/)
An [AWSM module](/awsm-org/awsm) that returns upload tokens for S3 objects. Instead of handling uploads yourself with a passthrough, let AWS do the work for you by generating a signed request and let the client upload the file directly to S3.

# Usage
1. Create a [JAWS](/jaws-framework/jaws) project, `jaws project create`
1. `cd` into the project directory.
1. Run `npm install --save awsm-s3tokenvendor`
1. Run `jaws env set <stage> all UPLOAD_TIMEOUT <value>`, where `<value>` is the timeout in minutes.
1. Run `jaws env set <stage> all UPLOAD_BUCKET <value>`, where `<value>` is the name of the S3 Bucket you want your uploads to go to.
1. *optional* Run `jaws env set <stage> all UPLOAD_CONTENT_TYPE <value>`, where `<value>` is the content type of the upload. For example:
	1. For PNG images, use `image/png`
	1. For any image, use `image/`
	1. For videos, use `video/`
	1. See [the IANA list](http://www.iana.org/assignments/media-types/media-types.xhtml) for all types.

## Front-end
See [Browser Uploads to S3 using HTML POST Forms](https://aws.amazon.com/items/1434)

# TODO
- Ensure Lambda Function has IAM permissions for PutObject access to the S3 bucket in the CloudFormation template
- Hook to create the S3 bucket if it does not exist

Disclaimer: This is currently a WIP. Use at your own risk.