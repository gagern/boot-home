# boot-home

This is a tool designed to boot a computer on a home network
if the router for that network is an AVM Fritz!Box
and the computer supports wake on lan (WoL).

## Supported configurations

The following configurations are known to work:

* Fritz!Box 7490 with Fritz!OS 06.51

Other configurations may or may not work.
If you encounter another configuration which does work,
please [edit this page][editReadme] and add your configuration.
If you know of a configuration which does not work,
feel free to look at the network traffic yourself
(e.g. using Chrome network logging) in order to identify
where this differs from what we already have implemented.

## Configuration

Download this package from GitHub.
You have to install some files into the package directory,
so simply installing it via npm won't work just now.

Create a file `config.json` which looks like this:

```js
{
    "url": "https://‹host name of your Fritz!Box, perhaps with port›/",
    "user": "‹user name for your Fritz!Box account›",
    "pass": "‹password for your Fritz!Box account›",
    "machine": "‹name of the machine to book›"
}
```

Also save the certificate for the page in a file `ca.pem`.
You can obtain that certificate e.g. in Firefox
using the context menu, entry “View Page Info”, tab “Security”,
button “View Certificate”, tab “Details”, button “Export…”.

Or you can use OpenSSL like this:

```sh
openssl s_client -connect ‹host›:443 </dev/null 2>/dev/null \
| awk '/---BEGIN CERTIFICATE---/,/---END CERTIFICATE---/' > ca.pem
```

## License

The package is licensed under [the MIT License](LICENSE).

[editReadme]: https://github.com/gagern/boot-home/edit/master/README.md
