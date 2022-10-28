/* Client scripts module */
declare const window: any
declare const console: any


async function onInit(): Promise<void> {
    console.log( "[+] Custom icon init" )
    await Server.rpc.LoadSettings()
    console.log( "[+] Custom icon load settings complete" )
    console.log( "[+] Icon enable: ", Context.data.icon_enable )
    console.log( "[+] Icon width: ", Context.data.icon_width )
    console.log( "[+] Icon height: ", Context.data.icon_height )
    console.log( "[+] Icon width: ", Context.data.icon_url )
}
