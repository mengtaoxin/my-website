---
title: "使用 surge 和 frp 访问内网服务"
date: 2026-08-05
language: chinese
---

surge 是一款网络管理软件，可以配置灵活的策略，以应对复杂的使用场景。

frp 是一个网络代理软件，可以将内网的服务，暴露到外网。

**为什么不能直接访问内网服务？**

因为国内大部分地区，是默认没有外网（公网）IP 的。在路由器上看到的 IP，只可以在内网连接上，外网是请求不到的。而且，将内网主机上的服务直接暴露到外网，也是有安全隐患的。所以，即使有外网 IP，也不建议将内网的服务直接暴露出去。

一个通常的做法是，在外网买一台服务器，此时就有了外网 IP。这时候，理论上，自己内网的服务可以访问这个外网的主机，自己的手机也可以访问到这个外网的主机，那么，就可以通过一些软件，将这个外网的主机作为一个中转站，以配合自己的手机，访问到内网的服务。

frp 就是帮助自己外网主机成为一个中转站的软件。而 surge，可以强制意图访问内网服务的请求，比如 http 请求，走中转站，而不是直接连接。

## frp 配置

首先需要在云服务提供商的服务器上面，配置 frp，从官网下载软件包后，修改配置。其中的 7000 端口，是服务器与内网主机之间连通的端口。注意需要将 auth.token 更换成一个正式的密钥。

```toml
# frps.toml
bindAddr = "0.0.0.0"
bindPort = 7000

# Token 认证（必须和客户端保持一致）
auth.method = "token"
auth.token = "123456"
```

运行服务：

```bash
/opt/frp_0.69.1_linux_amd64/frps -c /opt/frp_0.69.1_linux_amd64/frps.toml
```

再配置内网服务中的 frp，我是使用 docker 配置的。注意 frps 和 frpc 的 auth.token 需要保持一致。

```yaml
# docker-compose.yml
version: "3.8"

services:
  frpc:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: frpc
    restart: unless-stopped
    network_mode: host
    volumes:
      - ./frpc.toml:/etc/frp/frpc.toml:ro
```

```dockerfile
# Dockerfile
FROM alpine:3.20

# 使用本地下载的 frp 0.70.0 二进制文件
COPY frp_0.70.0_linux_amd64/frpc /usr/local/bin/frpc
RUN chmod +x /usr/local/bin/frpc

# 默认配置文件路径
VOLUME ["/etc/frp"]

ENTRYPOINT ["/usr/local/bin/frpc"]
CMD ["-c", "/etc/frp/frpc.toml"]
```

```toml
# frpc.toml
serverAddr = "123.123.123.123"
serverPort = 7000

auth.method = "token"
auth.token = "123456"

[[proxies]]
name = "socks5-vpn"
type = "tcp"
remotePort = 1080
[proxies.plugin]
type = "socks5"
```

好了，现在我们已经可以通过访问外网主机上的 1080 端口，以 socks5 协议，访问自己内网的服务了。尝试在外网主机上，通过 curl 命令访问内网的某个服务。我尝试访问位于 192.168.31.1 的路由器 web 管理页面，可以看到正常返回了内容，说明 frp 运行成功了。

```html
# curl --socks5 127.0.0.1:1080 http://192.168.31.1
<!DOCTYPE html>
<!--[if lt IE 7]><html class="ie6 oldie" lang="zh"><![endif]-->
<!--[if IE 7]><html class="ie7 oldie" lang="zh"><![endif]-->
<!--[if IE 8]><html class="ie8 oldie" lang="zh"><![endif]-->
<!--[if gt IE 8]><!-->
<html lang="zh">
  <!--<![endif]-->
  <head>
    <meta http-equiv="x-ua-compatible" content="IE=9" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>小米路由器</title>
    <noscript>
      <meta http-equiv="refresh" content="0; url=/cgi-bin/luci/web" />
    </noscript>
  </head>
  <body>
    <script>
      省略内容;
    </script>
  </body>
</html>
```

## surge 配置

这时，使用手机，不使用 wifi，使用浏览器访问内网服务，还是无法访问自己的服务。因为手机并不知道这个中转站的存在。

surge 配置太多，我就不全部贴出来了。只附上关键的部分：

```conf
[General]
use-local-host-item-for-proxy = true # 使用这个配置，以保证router.localsite可以被正常地解析

[Proxy]
cloud-server = ssh, 123.123.123.123, 22, username=root, password=123456 # 外网主机
tunnel = socks5, 127.0.0.1, 1080, underlying-proxy=cloud-server # 使用代理链的方式，访问1080端口

[Rule]
IP-CIDR,192.168.31.0/24,tunnel # 内网服务，走tunnel

[Host]
router.localsite = 192.168.31.1 # 给路由器web服务一个域名，便于访问
```

这时，手机浏览器对于 router.localsite 的请求过程是：

1. DNS 解析为 192.168.31.1
2. 匹配到规则，走 tunnel Proxy
3. 通过 SSH 连接上 1080 端口
4. 通过 frp 请求到内网的服务，结束

**为什么不使用.local 域名？**

许多内网服务，可以自动注册为 xxx.local 服务。但是，我不建议直接使用.local 域名。因为 surge 有特殊处理.local 请求的逻辑，就算更改了 skip-proxy 的配置也无法让请求走 tunnel（也可能是我的配置的问题），所以简单点，使用非.local 的域名，可以避免一些问题。

## 防火墙

可以看到，我避免将 1080 端口直接暴露到外网，而是使用 SSH 间接请求 1080 端口。同样地，frp 使用的 7000 端口，也不建议暴露到外网。我的做法是，调整云服务提供商的防火墙配置，将 7000 端口只暴露给自己内网的公网出口 IP。

## 总结

可以看到配置还是有些繁琐的。实际上，市面上是有现成的服务的，比如 tailscale 和贝锐蒲公英（这个好像是偏向企业服务的）。

## 备注

- surge 官网地址： [https://nssurge.com/](https://nssurge.com/)
- frp 项目地址： [http://github.com/fatedier/frp](http://github.com/fatedier/frp)
- frp 中的 frps（frp server）是服务端运行的 frp，frpc（frp client）是客户端运行的 frp。详见 frp 项目文档。
