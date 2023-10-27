---
layout: post
title: "Angular HTTPS localhost"
tags: ["Angular"]
toc: false
icon: ssl.svg
keywords: "ssl https localhost trust always trust system macos linux windows development certificate chrome keychain"
---

Make your web browser trust the link `https://localhost:4200`!

::: hsbox In case you wanna create a simple app `testing-angular` to test
``` bash
npm i -g @angular/cli
ng new testing-angular
```
:::

``` bash
cd testing-angular/
mkdir ssl
cd ssl
```

``` bash
# Create rootCA.key (with password)
openssl genrsa -des3 -out rootCA.key 2048
# Create rootCA.pem
# Using previous password & FR & "Random" & "Fake email"
openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -out rootCA.pem
```

On Mac, open **Keychain Access** > *File* > *Import items* > choose "rootCA.pem" > Double click on it > set "Always trust" in "When using this certificate" > Type your system password to confirm.

``` bash
# Create server.csr.cnf
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn

[dn]
C=US
ST=RandomState
L=RandomCity
O=RandomOrganization
OU=RandomOrganizationUnit
emailAddress=hello@example.com
CN = localhost
```

``` bash
# Create v3.ext
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
```

``` bash
# Create server.key
openssl req -new -sha256 -nodes -out server.csr -newkey rsa:2048 -keyout server.key -config <( cat server.csr.cnf )
```

``` bash
# Create server.crt
openssl x509 -req -in server.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out server.crt -days 500 -sha256 -extfile v3.ext
```

Open **angular.json**,

``` json
{
    "projects" : {
        "architect" : {
             "serve": {
                "options": {
                    "browserTarget": "testing-angular:build",
                    "ssl": true,
                    "sslKey": "./ssl/server.key",
                    "sslCert": "./ssl/server.crt",
                    "port": 4200
                }
            },
        }
    }
}
```

Restart your browser (sometimes, it's not necessary) and then

``` bash
ng serve -o
```

Go to **https://localhost:4200** to verify!