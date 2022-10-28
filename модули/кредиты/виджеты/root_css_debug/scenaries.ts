/* Client scripts module */
declare const window: any
declare const console: any


async function onInit(): Promise<void> {
    console.log( "[+] root example load" )
    console.log( "[+] Debug_enable 1: ", Context.data.debug_enable )

    await Server.rpc.LoadSettings()
    console.log( "[+] Load settings complete - debug_key is ", Context.data.debug_key )

    if ( Context.data.debug_key ) {

        const params = window.location.search
            .replace( '?', '' ).split( '&' )
            .reduce(
                function ( p: any, e: any ) {
                    const a = e.split( '=' );
                    p[ decodeURIComponent( a[ 0 ] ) ] = decodeURIComponent( a[ 1 ] );
                    return p;
                },
                {}
            );
        Context.data.modal_open = Boolean( params[ Context.data.debug_key ] );
        console.log( "[+] Debug_enable 2: ", Context.data.debug_enable )
    }
}

async function close(): Promise<void> {
    Context.data.modal_open = false
}
