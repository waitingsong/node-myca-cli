# myca-cli

A command line for [myca](https://www.npmjs.com/package/myca) for creating my CA center, 
generating a self signed x509 certificate, issuing server certificate from node.js via openssl. 
Multiple center supported. RSA, EC(P-256, P-384) supported.

[![Version](https://img.shields.io/npm/v/myca-cli.svg)](https://www.npmjs.com/package/myca-cli)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)


## Installing

```bash
npm install -g myca-cli
```

## myca module
- [myca](https://www.npmjs.com/package/myca)


## Usage

- Initialize default center
  ```bash
  myca init
  ```

  will output:
  ```bash
  Default center created at path: "C:\Users\<user>\.myca"
  ```

- Initialize CA cert of default center
  ```bash
  myca initca --days=10950 --pass=mycapass \
    --cn="my root ca" --o="my company" --c=CN \
  ```
  will output:
  ```bash
  CA certificate created with:
    centerName: "default"
    crtFile: "C:\Users\<user>\.myca\ca.crt"
    privateKeyFile: "C:\Users\<user>\.myca\ca.key"
  ```

- Issue a RSA serve certificate
  ```bash
  myca issue --kind=server --days=730 --pass=fooo \
    --cn="waitingsong.com" --o="my company" --c=CN --caKeyPass=mycapass \
  ```

  will output:
  ```bash
  Issue a Certificate with:
    pubKey:
  -----BEGIN PUBLIC KEY-----
  MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxJunjvIoZ5bFQsA9D/1A
  MHt36viM7AJZFpQdmVuTLUZXEiTFU6gMdBarikHsXt0xRPcnGHiP1hgSsTIh2j1k
  3HiNinwfV/MePvy/8f/XWY+J3BbljQCPQmtUIZAnBebiVcvQrL1cP4l5xgJiv5/p
  EdRhCs92J/1MMDxhp41BzatBKwbQJ7UQtLnTdWXCs/qptTgaD6vh4a3snWHlfatg
  TsfzjmSmiXcEYGZM9z6tDrSjR9kBZoog+9DTh+FCdVaasL7QvYlWlOzsjSO2yvLX
  lYQJ9VJbBGxV0cOKbmPm46aMK6n5br/75CAm8cHyfgsE0MhxH2uxQW3leUy+3MHK
  ZwIDAQAB
  -----END PUBLIC KEY-----

    pass: "fooo"
    privateKeyFile: "C:\Users\<user>\.myca\server\01.key"
    privateUnsecureKeyFile: "C:\Users\<user>\.myca\server\01.key.unsecure"
    centerName: "default"
    caKeyFile: "C:\Users\<user>\.myca\ca.key"
    caCrtFile: "C:\Users\<user>\.myca\ca.crt"
    csrFile: "C:\Users\<user>\.myca\server\01.csr"
    crtFile: "C:\Users\<user>\.myca\server\01.crt"
  ```

- Initialize a center named ec
  ```bash
  // path can be omitted
  myca initcenter --name=ec --path="c:/users/<user>/.myca-ec"
  ```

  will output:
  ```bash
  center created with:
    centerName: "ec"
    path: "c:/users/<user>/.myca-ec"
  ```

- Create self-signed EC CA certificate under center ec (default P-256)
  ```bash
  myca initca --days=10950 --pass=mycapass \
    --cn="my root ca" --o="my company" --c=CN --centerName=ec --alg=ec \
  ```

  will output:
  ```bash
  CA certificate created with:
    centerName: "ec"
    crtFile: "c:\users\<user>\.myca-ec\ca.crt"
    privateKeyFile: "c:\users\<user>\.myca-ec\ca.key"
  ```

- Issue a ec server certificate by center ec CA cert
  ```bash
  myca issue --kind=server --days=730 --pass=fooo \
    --cn="foo.waitingsong.com" --o="my comany" --c=CN --caKeyPass=mycapass \
    --centerName=ec --alg=ec \
  ```

- Issue a serve certificate with Domain Name SANs
  ```bash
  myca issue --kind=server --days=730 --pass=fooo \
    --cn="waitingsong.com" --o="my company" --c=CN --caKeyPass=mycapass \
    --SAN="foo.waitingsong.com, bar.waitingsong.com" \
  ```

- Issue a serve certificate with IP SANs
  ```bash
  myca issue --kind=server --days=730 --pass=fooo \
    --cn="waitingsong.com" --o="my company" --c=CN --caKeyPass=mycapass \
    --ips=192.168.0.1 \

  myca issue --kind=server --days=730 --pass=fooo \
    --cn="waitingsong.com" --o="my company" --c=CN --caKeyPass=mycapass \
    --ips="192.168.0.1, 192.168.0.2" \
  ```

- Issue a RSA client p12/pfx certificate
  ```bash
  myca issue --kind=client --days=730 --pass=fooo \
    --cn="waitingsong.com" --o="my company" --c=CN --caKeyPass=mycapass \
  ```

  will output:
  ```bash
  Issue a Certificate with:
    pubKey:
  -----BEGIN PUBLIC KEY-----
  MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsu8wZDZ0a/HNtlJPqCjs
  9Isg795iUAJ+5OREb08hPthDN4/LOoLgepIyWbZ/A+0Gv8jHkbqlUvOJV5O5ggjR
  ezpK3jXln621nbjS3Fzs/uw4+40e4RX7fYIoE9sk94rP+od1ZMRjE8+e+qb34ubC
  WiXtsyR4EyaRen23IqLNlvxGlcg4xLczaCDA06zkva+wL7qvLYF2331X/rZ+dQgY
  xh6iWKO7C9qcliF23OOByYIKS8jqQ8ngwHIEogIqNBdt/QyEVN7CvF4M6abQnrrx
  9wnnmlaRX2WiybsA06wWl7+4BgKjeULehCVQOpMsS/3QV1dO79vn9hZWM/dAPlnF
  QwIDAQAB
  -----END PUBLIC KEY-----

    pass: "fooo"
    privateKeyFile: "C:\Users\<user>\.myca\client\0A.key"
    centerName: "default"
    caKeyFile: "C:\Users\<user>\.myca\ca.key"
    caCrtFile: "C:\Users\<user>\.myca\ca.crt"
    csrFile: "C:\Users\<user>\.myca\client\0A.csr"
    crtFile: "C:\Users\<user>\.myca\client\0A.crt"
    pfxFile: "C:\Users\<user>\.myca\client\0A.p12"
  ```


## License

[MIT](LICENSE)


## Languages

- [English](README.md)
- [中文](README.zh-CN.md)
