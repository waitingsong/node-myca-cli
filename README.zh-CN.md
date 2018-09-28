# myca-cli

命令行调用 [myca](https://www.npmjs.com/package/myca) 创建自有 CA 中心（自签发CA证书或者上级CA签发的中级CA证书），
签发自签名数字证书。支持创建多个 CA 中心。支持 RSA，EC（P-256, P-384）算法。

[![Version](https://img.shields.io/npm/v/myca-cli.svg)](https://www.npmjs.com/package/myca-cli)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)



## 安装

```bash
npm install -g myca-cli
```

## 使用

- 初始化默认中心
  ```bash
  myca init
  ```

  输出:
  ```bash
  Default center created at path: "C:\Users\<user>\.myca"
  ```

- 初始化默认中心的 CA 自签发证书
  ```bash
  myca initca --days=10950 --pass=mycapass \
    --cn="my root ca" --o="my company" --c=CN \
  ```

  输出:
  ```bash
  CA certificate created with:
    centerName: "default"
    crtFile: "C:\Users\<user>\.myca\ca.crt"
    privateKeyFile: "C:\Users\<user>\.myca\ca.key"
  ```

- 签发一张 RSA 服务器证书
  ```bash
  myca issue --kind=server --days=730 --pass=fooo \
    --cn="waitingsong.com" --o="my company" --c=CN --caKeyPass=mycapass \
  ```

  输出:
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

- 创建名为 ec 的中心
  ```bash
  myca initcenter --name=ec --path="c:/users/<user>/.myca-ec"
  ```

  输出:
  ```bash
  center created with:
    centerName: "ec"
    path: "c:/users/<user>/.myca-ec"
  ```


- 在 ec 中心下初始化自签发 EC CA 证书 (default P-256)
  ```bash
  myca initca --days=10950 --pass=mycapass \
    --cn="my root ca" --o="my company" --c=CN --centerName=ec --alg=ec \
  ```
  输出:
  ```bash
  CA certificate created with:
    centerName: "ec"
    crtFile: "c:\users\<user>\.myca-ec\ca.crt"
    privateKeyFile: "c:\users\<user>\.myca-ec\ca.key"
  ```


- 签发 SAN 多域名服务器证书
  ```bash
  myca issue --kind=server --days=730 --pass=fooo \
    --cn="waitingsong.com" --o="my company" --c=CN --caKeyPass=mycapass \
    --SAN="foo.waitingsong.com, bar.waitingsong.com" \
  ```

- 签发 SAN 多ip服务器证书
  ```bash
  myca issue --kind=server --days=730 --pass=fooo \
    --cn="waitingsong.com" --o="my company" --c=CN --caKeyPass=mycapass \
    --ips=192.168.0.1 \

  myca issue --kind=server --days=730 --pass=fooo \
    --cn="waitingsong.com" --o="my company" --c=CN --caKeyPass=mycapass \
    --ips="192.168.0.1, 192.168.0.2" \
  ```


- 签发一张 RSA p12/pfx 客户端证书
  ```bash
  myca issue --kind=client --days=730 --pass=fooo \
    --cn="waitingsong.com" --o="my company" --c=CN --caKeyPass=mycapass \
  ```

  输出:
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
